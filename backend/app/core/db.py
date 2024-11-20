"""Database code."""

import os

import sqlmodel

from app import crud
from app.core.config import settings
from app.models import User, UserCreate, Gift


BASE_DIR = os.path.abspath(os.path.dirname(__name__))
SQLITE_FILE_NAME = "database.db"
SQLITE_URI = "sqlite:///" + os.path.join(BASE_DIR, SQLITE_FILE_NAME)

connect_args = {"check_same_thread": False}
engine = sqlmodel.create_engine(SQLITE_URI, connect_args=connect_args)


def init_db(session: sqlmodel.Session) -> None:
    # TODO: For production, have a migration script (Alembic).
    sqlmodel.SQLModel.metadata.create_all(engine)

    user = session.exec(
        sqlmodel.select(User).where(User.email == settings.FIRST_USER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_USER,
            password=settings.FIRST_USER_PASSWORD,
            display_name=settings.FIRST_USER_NAME,
        )
        user = crud.create_user(session=session, user_create=user_in)
