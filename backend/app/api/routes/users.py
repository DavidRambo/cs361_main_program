"""API Routes pertaining to Users."""

import fastapi
import sqlmodel

from app import crud
from app.api.deps import CurrentUser, SessionDep
from app.core.config import settings
from app.core.security import get_password_hash, verify_password
from app.models import (
    Gift,
    Message,
    # UpdatePassword,
    User,
    UserCreate,
    # UserUpdateEmail,
    UserUpdateName,
    UserPublic,
    UsersPublic,
)


# All path operations' paths added to this router are prefixed with "/users".
# For example, @router.get("/") will handle "/users/", and @router.patch("/me/name")
# will handle "/users/me/name".
router = fastapi.APIRouter(prefix="/users", tags=["users"])


@router.get("/", response_model=UsersPublic)
def read_users(session: SessionDep, current_user: CurrentUser):
    """Retrieve users other than the logged-in user."""
    users = session.exec(sqlmodel.select(User).where(User.id != current_user.id)).all()
    return UsersPublic(
        data=users,
    )


@router.patch("/me/name", response_model=UserPublic)
def update_user_name(
    *, session: SessionDep, user_in: UserUpdateName, current_user: CurrentUser
):
    """Updates the user's display name."""
    db_user = session.get(User, current_user.id)

    db_user = crud.update_user_name(session=session, db_user=db_user, user_in=user_in)

    return db_user


# @router.patch("/me/password", response_model=Message)
# def update_password(
#     *, session: SessionDep, body: UpdatePassword, current_user: CurrentUser
# ):
#     """Updates the logged-in user's password."""
#     if not verify_password(body.current_password, current_user.hashed_password):
#         raise fastapi.HTTPException(status_code=400, detail="Incorrect password")

#     if body.current_password == body.new_password:
#         raise fastapi.HTTPException(
#             status_code=400,
#             detail="New password cannot be the same as the current password.",
#         )

#     hashed_password = get_password_hash(body.new_password)
#     current_user.hashed_password = hashed_password
#     session.add(current_user)
#     session.commit()
#     return Message(message="Password updated.")


@router.get("/me", response_model=UserPublic)
def read_user_current(current_user: CurrentUser):
    """Get logged-in user."""
    return current_user


@router.post("/register", response_model=UserPublic)
def register_user(session: SessionDep, user_in: UserCreate):
    """Creates a new user."""
    user = crud.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise fastapi.HTTPException(
            status_code=400, detail="A user with this email already exists."
        )
    if user_in.reg_code != settings.REGISTRATION_CODE:
        raise fastapi.HTTPException(
            status_code=400, detail="Incorrect registration code."
        )
    user_create = UserCreate.model_validate(user_in)
    user = crud.create_user(session=session, user_create=user_create)
    return user


@router.get("/{user_id}", response_model=UserPublic)
def read_user_by_id(user_id: int, session: SessionDep, current_user: CurrentUser):
    """Get a user by their id."""
    user = session.get(User, user_id)
    return user


@router.delete("/me")
def delete_user(
    session: SessionDep, current_user: CurrentUser, user_id: int
) -> Message:
    """Delete one's own user account."""
    user = session.get(User, user_id)
    if not user:
        raise fastapi.HTTPException(status_code=404, detail="User not found.")
    if user != current_user:
        raise fastapi.HTTPException(
            status_code=403, detail="Only users may delete their accounts."
        )

    # Delete all gift entries belonging the user.
    statement = sqlmodel.delete(Gift).where(sqlmodel.col(Gift.owner_id) == user_id)
    session.exec(statement)  # type: ignore

    session.delete(current_user)
    session.commit()

    return Message(message="User and their wish list deleted.")
