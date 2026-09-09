from fastapi import Request, HTTPException, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from loguru import logger


class AppException(HTTPException):
    """Base application exception."""
    def __init__(self, status_code: int, detail: str, error_code: str = "ERROR"):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code


class ModelNotTrainedException(AppException):
    def __init__(self, detail: str = "Machine learning model is not trained yet."):
        super().__init__(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=detail, error_code="MODEL_NOT_TRAINED")


class ResourceNotFoundException(AppException):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} with identifier '{identifier}' not found.",
            error_code="RESOURCE_NOT_FOUND"
        )


class UnauthorizedException(AppException):
    def __init__(self, detail: str = "Invalid authentication credentials."):
        super().__init__(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail, error_code="UNAUTHORIZED")


class ForbiddenException(AppException):
    def __init__(self, detail: str = "Access forbidden. Insufficient permissions."):
        super().__init__(status_code=status.HTTP_403_FORBIDDEN, detail=detail, error_code="FORBIDDEN")


async def app_exception_handler(request: Request, exc: AppException):
    """Global handler for application exceptions."""
    logger.warning(f"AppException: {exc.detail} (Path: {request.url.path})")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error_code": exc.error_code,
            "message": exc.detail,
            "path": request.url.path
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Global handler for Pydantic schema validation errors."""
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error_code": "VALIDATION_ERROR",
            "message": "Input validation failed. Please check your submission fields.",
            "details": exc.errors(),
            "path": request.url.path
        }
    )


async def unhandled_exception_handler(request: Request, exc: Exception):
    """Fallback handler for unhandled 500 errors."""
    logger.exception(f"Unhandled internal server error on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error_code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred. Please contact support or retry.",
            "path": request.url.path
        }
    )
