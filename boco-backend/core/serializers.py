from rest_framework import serializers
from . import exceptions as core_exceptions


class BaseModelSerializer(serializers.ModelSerializer):
    """
    BaseModelSerializer
        Base class that extends default functionality:
        1. Support dynamic fields on serializer, user can now pass required or not required fields
           in query parameter.
        2. Support required_fields attribute, ensures that fields is present in payload and if not
           raise error. Must write corresponding validate_<field>() methods for each field
           mentioned in required_field.
        Inherits : 'serializers.ModelSerializer'
    """

    def to_internal_value(self, data):
        """
        Check if any required_fields are mentioned in Meta class, if so, check if
        corresponding validate_<field>() method is provided in the class or not.
        :param data:
        :return data:
        """
        if not data:
            data = {}
        # check that the instance of data is dict or not
        if not isinstance(data, dict):
            raise core_exceptions.BaseInvalidValidationError(data=data)

        # add required fields, if not available in payload
        if hasattr(self.Meta, 'required_fields'):
            assert isinstance(self.Meta.required_fields, tuple), (
                "Attribute 'required_fields' must be a tuple in "
                "{0}.Meta".format(self.__class__.__name__)
            )
            for required_field in self.Meta.required_fields:
                validator_method = 'validate_{0}'.format(required_field)
                if not hasattr(self, validator_method):
                    raise Exception(
                    "Cannot locate validator method '{0}' "
                    "for required field '{1}' in {2} class.".format(
                        validator_method, required_field,
                        self.__class__.__name__,
                    )
                )

                # add None to fields that are missing in payload but required for validation
                if required_field not in data:
                    data.setdefault(required_field, None)
                    raise core_exceptions.RequiredFieldValidationError(required_field=required_field)
        return super().to_internal_value(data)

    def validate(self, validated_data):
        return super().validate(validated_data)
