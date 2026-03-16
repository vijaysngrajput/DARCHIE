import logging


LOGGER_NAME = "d_archie.api"


def get_logger(name: str = LOGGER_NAME) -> logging.Logger:
    return logging.getLogger(name)


def log_request_completion(
    *,
    logger: logging.Logger,
    method: str,
    path: str,
    status_code: int,
    request_id: str,
    duration_ms: float,
) -> None:
    logger.info(
        "request_completed",
        extra={
            "method": method,
            "path": path,
            "status_code": status_code,
            "request_id": request_id,
            "duration_ms": round(duration_ms, 2),
        },
    )
