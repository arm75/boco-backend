from core.exceptions import BaseValidationError


class AddressCannotBeLocatedError(BaseValidationError):
    """An exception class that extends BaseValidationError. This exception is raised when address
        entered cannot be processed for latitude and longitude
             This class overrides both 'message' and 'code' variables.
        """
    message = 'Address cannot be located.'
    code = 'address_not_located'


class CannotMarkCompleteWorkOrderError(BaseValidationError):
    """An exception class that extends BaseValidationError. This exception is raised user tries
    to mark a workorder as completed and one of the tab entries is not provided.
             This class overrides both 'message' and 'code' variables.
        """
    message = 'Cannot mark completed an incomplete workorder'
    code = 'cannot_mark_completed'
