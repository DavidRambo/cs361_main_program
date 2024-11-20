import uuid
from typing import Any

import pydantic
import sqlmodel

from app.models import (
    # UpdatePassword,
    User,
    UserCreate,
    UserUpdateName,
    # UserUpdateEmail,
    Gift,
    GiftCreate,
    # GiftUpdate,
)

from app.core.security import get_password_hash, verify_password


def create_user(*, session: sqlmodel.Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user_name(
    *, session: sqlmodel.Session, db_user: User, user_in: UserUpdateName
) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    db_user.sqlmodel_update(user_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


# def update_user(
#     *,
#     session: sqlmodel.Session,
#     db_user: User,
#     user_in: UserUpdateEmail | UpdatePassword,
# ) -> Any:
#     user_data = user_in.model_dump(exclude_unset=True)
#     extra_data = {}
#     if "password" in user_data:
#         password = user_data["password"]
#         hashed_password = get_password_hash(password)
#         extra_data["hashed_password"] = hashed_password
#     db_user.sqlmodel_update(user_data, update=extra_data)
#     session.add(db_user)
#     session.commit()
#     session.refresh(db_user)
#     return db_user


def get_user_by_email(
    *, session: sqlmodel.Session, email: pydantic.EmailStr
) -> User | None:
    statement = sqlmodel.select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(
    *, session: sqlmodel.Session, email: str, password: str
) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_gift(
    *, session: sqlmodel.Session, gift_in: GiftCreate, owner_id: uuid.UUID
) -> Gift:
    db_gift = Gift.model_validate(gift_in, update={"owner_id": owner_id})
    session.add(db_gift)
    session.commit()
    session.refresh(db_gift)
    return db_gift
