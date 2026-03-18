from app.core.errors import AppError


class ResponseAccessDeniedError(AppError):
    def __init__(self, message: str = "Response access denied") -> None:
        super().__init__("AUTHORIZATION_DENIED", message, 403)


class InvalidSubmissionStateError(AppError):
    def __init__(self, message: str = "Invalid submission state") -> None:
        super().__init__("INVALID_STATE", message, 409)


class ArtifactReferenceError(AppError):
    def __init__(self, message: str = "Artifact reference is invalid") -> None:
        super().__init__("VALIDATION_FAILED", message, 422)


class DraftNotFoundError(AppError):
    def __init__(self, message: str = "Draft not found") -> None:
        super().__init__("RESOURCE_NOT_FOUND", message, 404)
