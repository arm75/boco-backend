from django.core import exceptions as django_exceptions
from rest_framework import exceptions as rest_exceptions
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.settings import api_settings
from rest_framework.views import exception_handler


def _format_full_details(response, exc, context):
    """Convert response.data to get full details in error messages,
    """
    # if response is empty, set response for Django's validation error
    if not response:
        if isinstance(exc, django_exceptions.ValidationError):
            data = {
                'detail': exc,
            }

            response = Response(data, status=status.HTTP_400_BAD_REQUEST)

    # either a ValidationError or has ValidationError as its ancestor
    if (
            isinstance(exc, serializers.ValidationError) or
            serializers.ValidationError in exc.__class__.__mro__
    ):
        # get_full_details() creates [{message:'<msg>', 'code':<code>}] dict
        response.data = exc.get_full_details()

    if response.data is not None:
        # custom ValidationError classes, check if this is non_field_exception,
        # i.e. raised from serializer's update(), create() etc.
        if isinstance(response.data, list):
            # add extra={}, if not already there
            response.data = {
                api_settings.NON_FIELD_ERRORS_KEY: response.data,
            }

        for field, errors in response.data.items():
            # standard ValidationError ErrorDetail type
            # field = '<field>' # valid model field name
            # eg: exc='You do not have permission to perform this action.'
            # exc.code = 'permission_denied'
            if isinstance(errors, rest_exceptions.ErrorDetail):
                response.data[field] = {
                    'message': errors,
                    'code': errors.code,
                }
            # standard ValidationError of string type, eg: Not Found
            # field = 'detail' # DRF's default name, added by exception_handler
            # exc = 'Not Found.'
            # exc.code = Not valid as this is not of type ErrorDetail
            elif isinstance(errors, str):
                response.data[field] = {
                    'message': errors,
                    # convert message as code
                    # convert to snake case and also to lowercase
                    'code': "_".join(errors.strip(" .").split(" ")).lower(),
                }
            # Django ValidationError
            # field = 'detail' # added by _exception_handler
            # eg: exc="'1234' is not a valid UUID."
            # exc.code = 'invalid'
            elif isinstance(errors, django_exceptions.ValidationError):
                response.data[field] = {
                    'message': errors.message % {'value': errors.params.get('value')},
                    'code': errors.code,
                }
            elif isinstance(errors, list):
                # for each error check if key is 'extra', if so then reformat
                for err in errors:
                    if isinstance(err, dict) and 'extra' in err:
                        _extra = {}
                        # change format from :
                        # {'extra': {
                        #   'curr_val': {'message': '12342517', 'code': 'invalid'},
                        #   'curr_val2': {'message': '12342517', 'code': 'invalid'}}
                        # }
                        # to:
                        # {'extra': {
                        #   'curr_val': '12342517',
                        #   'curr_val2': '12342517',
                        # }
                        for extra_key, extra_val_dict in err.get('extra').items():
                            _extra.setdefault(extra_key, extra_val_dict.get('message'))
                        err['extra'] = _extra
            elif isinstance(errors, dict):
                # TODO: do this recursively

                # occurs for nested serializer validation
                # for each error check if key is 'extra', if so then reformat

                for nested_field, _errors in errors.items():
                    if isinstance(_errors, list):
                        """
                        converting format from:

                        {'purchaser': {'client_id': [{'code': 'required_mentioned_field',
                                      'message': 'Mentioned Field is required.'},
                                     {'extra': {'abc': {'code': 'required_mentioned_field',
                                                        'message': 'date_of_birth'}}}],
                       'extra': {}},

                        to:

                        {'purchaser': {'client_id': {'code': 'required_mentioned_field',
                                     'extra': {'abc': 'date_of_birth'},
                                     'message': 'Mentioned Field is required.'},
                       'extra': {}},
                        """
                        for err in _errors:
                            if isinstance(err, dict) and 'extra' in err:
                                _extra = {}
                                for extra_key, extra_val_dict in err.get('extra').items():
                                    _extra.setdefault(extra_key, extra_val_dict.get('message'))
                                err['extra'] = _extra
                        _new_errors = {}
                        for d in _errors:
                            _new_errors.update(d)
                        errors[nested_field] = _new_errors
                    elif isinstance(_errors, dict):
                        _xerrors = _errors
                        for sub_nested_field, _errors in _xerrors.items():
                            if isinstance(_errors, list):
                                for err in _errors:
                                    if isinstance(err, dict) and 'extra' in err:
                                        _extra = {}
                                        for extra_key, extra_val_dict in err.get('extra').items():
                                            _extra.setdefault(
                                                extra_key,
                                                extra_val_dict.get('message'),
                                            )
                                        err['extra'] = _extra
                                _new_errors = {}
                                for d in _errors:
                                    _new_errors.update(d)
                                _xerrors[sub_nested_field] = _new_errors

            if isinstance(errors, list):
                _errors = {}
                for d in errors:
                    _errors.update(d)
                response.data[field] = _errors

            # for every field, there should be an 'extra' key, add if not exist
            response.data[field].setdefault('extra', {})

    return response


def custom_exception_handler(exc, context):
    """Custom exception handler, which extends the default exceptions and convert
     them to another, a more comprehensive error format
    """

    # Call REST framework's default exception handler first,
    # to get the standard error response.
    response = exception_handler(exc, context)
    response = _format_full_details(response, exc, context)

    return response


class ValidationErrorCode:
    """Contains a list of exception codes as constants"""
    INVALID = 'invalid'
    REQUIRED = 'required'
    DEPENDENT = 'dependency_not_found'
    NOT_SUPPORTED = 'not_supported_field'
    PERMISSION_DENIED = 'permission_denied'
    NOT_FOUND = 'not_found'


class BaseValidationError(serializers.ValidationError):
    """Base validation error class that extends serializers.ValidationError. This
     inherits the functionality of parent class but overrides message.

     If an 'extra', a kwargs dict, arguments passed when an error is raised, then those
     arguments would be stored as dict in 'extra' key and overrides default message
     to a list of messages.

     Instance variables:
       * message
       * code
    """
    message = ''
    code = ''

    # It avoids evaluation of message during initialization of urls/models by Django.
    # Message will be evaluated only when the exception is raised.
    @property
    def prop_message(self):
        return self.message

    @prop_message.setter
    def prop_message(self, msg):
        self.__dict__['message'] = msg

    def __init__(self, **extra):
        """Initialize with prop_message and a code, but override prop_message
        if 'extra' kwargs is passed
        """
        if extra:
            self.prop_message = [
                self.prop_message,
                {
                    'extra': extra,
                }
            ]
        super().__init__(self.prop_message, code=self.code)


class BaseInvalidValidationError(BaseValidationError):
    """Base class for invalid exceptions that extends BaseValidatorError class.
    It inherits the functionality of parent class and overrides message and code variables,
    to handle invalid fields.

    Instance variables:
       * message
       * code
    """
    message = 'Invalid field data.'
    code = ValidationErrorCode.INVALID


class BaseRequiredValidationError(BaseValidationError):
    """Base class for required exceptions that extends BaseValidatorError class.
    It inherits the functionality of parent class and overrides message and code variables,
    to handle invalid fields.

    Instance variables:
       * message
       * code
    """
    message = "Field is required."
    code = 'required'


class RequiredFieldValidationError(BaseRequiredValidationError):
    message = "Required fields missing."
    code = "required_field_missing"
