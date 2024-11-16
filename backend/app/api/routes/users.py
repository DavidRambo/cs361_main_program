"""API Routes pertaining to Users."""

import fastapi

from app.models import (
    User,
    UserCreate,
    UpdatePassword,
    UserUpdateName,
    UserPublic,
    UsersPublic,
    UserForSelf,
    UserForOthers,
)


router = fastapi.APIRouter()
