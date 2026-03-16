from app.core.errors import AppError


class AuthenticationFailedError(AppError):
    def __init__(self, message: str = "Authentication failed") -> None:
        super().__init__("AUTHENTICATION_FAILED", message, 401)


class AccessSessionExpiredError(AppError):
    def __init__(self, message: str = "Access session is expired or terminated") -> None:
        super().__init__("AUTHENTICATION_FAILED", message, 401)


class AuthorizationDeniedError(AppError):
    def __init__(self, message: str = "Authorization denied") -> None:
        super().__init__("AUTHORIZATION_DENIED", message, 403)


class InvalidRoleAssignmentError(AppError):
    def __init__(self, message: str = "Invalid role assignment") -> None:
        super().__init__("VALIDATION_FAILED", message, 422)


class UserNotFoundError(AppError):
    def __init__(self, message: str = "User not found") -> None:
        super().__init__("RESOURCE_NOT_FOUND", message, 404)
