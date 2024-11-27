from collections.abc import Generator
from typing import Annotated

import jwt
import fastapi
import pydantic
import sqlmodel

from app.core import security
from app.core.config import settings
from app.core.db import engine
from app.models import TokenPayload, User


# I think with 3.12 or 3.13, there's no need to include the ", None, None" in Generator
def get_db() -> Generator[sqlmodel.Session]:
    with sqlmodel.Session(engine) as session:
        yield session


reusable_outh2 = fastapi.security.OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)


SessionDep = Annotated[sqlmodel.Session, fastapi.Depends(get_db)]
TokenDep = Annotated[str, fastapi.Depends(reusable_outh2)]


def get_current_user(session: SessionDep, token: TokenDep) -> User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (jwt.InvalidTokenError, pydantic.ValidationError):
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    user = session.get(User, token_data.sub)
    if not user:
        raise fastapi.HTTPException(status_code=404, detail="User not found")
    return user


CurrentUser = Annotated[User, fastapi.Depends(get_current_user)]
