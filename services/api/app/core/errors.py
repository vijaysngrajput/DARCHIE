from pydantic import BaseModel


class ErrorResponse(BaseModel):
    error_code: str
    message: str
    request_id: str


class AppError(Exception):
    def __init__(self, error_code: str, message: str, status_code: int) -> None:
        super().__init__(message)
        self.error_code = error_code
        self.message = message
        self.status_code = status_code
