from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.core.exceptions import UnauthorizedException, ForbiddenException
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import UserCreate, UserLogin, Token, UserResponse

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


class AuthService:
    @staticmethod
    def register(db: Session, user_in: UserCreate) -> Token:
        if UserRepository.get_by_username(db, user_in.username):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this username already exists."
            )
        if UserRepository.get_by_email(db, user_in.email):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists."
            )

        # First registered user can be made admin if desired
        is_first = UserRepository.count(db) == 0
        db_user = UserRepository.create(db, user_in, is_admin=is_first)

        access_token = create_access_token(subject=str(db_user.id), is_admin=db_user.is_admin)
        refresh_token = create_refresh_token(subject=str(db_user.id), is_admin=db_user.is_admin)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(db_user)
        )

    @staticmethod
    def login(db: Session, login_data: UserLogin) -> Token:
        user = UserRepository.get_by_username(db, login_data.username)
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise UnauthorizedException("Incorrect username or password.")

        if not user.is_active:
            raise ForbiddenException("User account is inactive.")

        access_token = create_access_token(subject=str(user.id), is_admin=user.is_admin)
        refresh_token = create_refresh_token(subject=str(user.id), is_admin=user.is_admin)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            user=UserResponse.model_validate(user)
        )


def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """Resolves current user if authorization header is supplied, else returns None."""
    if not token:
        return None
    payload = decode_token(token)
    if not payload or not payload.get("sub"):
        return None
    user_id = int(payload["sub"])
    return UserRepository.get_by_id(db, user_id)


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Strict authorization dependency."""
    if not token:
        raise UnauthorizedException("Authentication token required.")
    payload = decode_token(token)
    if not payload or not payload.get("sub"):
        raise UnauthorizedException("Invalid or expired token.")
    user_id = int(payload["sub"])
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise UnauthorizedException("User not found.")
    return user


def get_current_admin_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Admin privilege dependency."""
    if not current_user.is_admin:
        raise ForbiddenException("Admin privileges required.")
    return current_user
