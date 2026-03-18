from app.core.errors import AppError


class SessionNotFoundError(AppError):
    def __init__(self, message: str = "Session not found") -> None:
        super().__init__("RESOURCE_NOT_FOUND", message, 404)


class SessionAccessDeniedError(AppError):
    def __init__(self, message: str = "Session access denied") -> None:
        super().__init__("AUTHORIZATION_DENIED", message, 403)


class InvalidSessionStateError(AppError):
    def __init__(self, message: str = "Invalid session state") -> None:
        super().__init__("INVALID_STATE", message, 409)


class InvalidTaskProgressionError(AppError):
    def __init__(self, message: str = "Invalid task progression") -> None:
        super().__init__("INVALID_STATE", message, 409)


class TimingPolicyViolationError(AppError):
    def __init__(self, message: str = "Timing policy violation") -> None:
        super().__init__("VALIDATION_FAILED", message, 422)


class AttemptPolicyViolationError(AppError):
    def __init__(self, message: str = "Attempt policy violation") -> None:
        super().__init__("VALIDATION_FAILED", message, 422)


class GatingNotSatisfiedError(AppError):
    def __init__(self, message: str = "Gating not satisfied") -> None:
        super().__init__("INVALID_STATE", message, 409)
