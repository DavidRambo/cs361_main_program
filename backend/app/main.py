"""A FastAPI application for uploading and serving images."""

import fastapi
import sqlmodel
from fastapi.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings
from app.core import db

app = fastapi.FastAPI(title=settings.PROJECT_NAME)

if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.on_event("startup")
def on_startup():
    """Sets up the database on application startup."""
    # TODO: For production, have a migration script (Alembic).
    with sqlmodel.Session(db.engine) as session:
        db.init_db(session)


app.include_router(api_router, prefix=settings.API_V1_STR)
