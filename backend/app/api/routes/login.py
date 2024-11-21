"""User authentication routes."""

import datetime
from typing import Annotated

from fastapi.security import OAuth2PasswordRequestForm

import fastapi

from app import crud
from app.api.deps import CurrentUser, SessionDep, get_current_user
from app.core import security
from app.core.config import settings
from app.models import Message, NewPassword, Token, UserPublic


router = fastapi.APIRouter()


@router.post("/login/access-token")
def login_access_token(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, fastapi.Depends()],
) -> Token:
    """Returns an OAuth2-compatible token upon successful credential verification.."""
    user = crud.authenticate(
        session=session, email=form_data.username, password=form_data.password
    )
    if not user:
        raise fastapi.HTTPException(
            status_code=400, detail="Incorrect email or password."
        )

    access_token_expires = datetime.timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )


@router.post("/login/test-token", response_model=UserPublic)
def test_token(current_user: CurrentUser):
    """Tests access token."""
    return current_user


# @router.post("/password-recovery/{email}")
# def recover_password(email: str, session: SessionDep) -> Message:
#     """Sends a password recovery email."""
#     user = crud.get_user_by_email(session=session, email=email)

#     if not user:
#         raise fastapi.HTTPException(
#             status_code=404, detail="A user with that email does not exist."
#         )

#     # TODO: write app.utils.generate_password_reset_token

#     # TODO: Integrate with email microservice.


# @router.post("/reset-password")
# def reset_password(session: SessionDep, body: NewPassword) -> Message:
#     """Resets password."""
#     # TODO: write app.utils.verify_password_reset_token
#     pass


# NOTE: FastAPI's template provides another path operation that provides
# HTML content for the password recovery process.
