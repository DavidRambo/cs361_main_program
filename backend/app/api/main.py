import fastapi

from app.api.routes import gifts, login, users


api_router = fastapi.APIRouter()
api_router.include_router(gifts.router)
api_router.include_router(login.router)
api_router.include_router(users.router)
