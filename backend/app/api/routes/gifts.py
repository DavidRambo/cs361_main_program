"""API Routes pertaining to Gifts."""

import fastapi
import sqlmodel

from app.models import (
    InputText,
    Gift,
    GiftCreate,
    GiftUpdate,
    GiftPublic,
    GiftsPublic,
    GiftForOwner,
    GiftsForOwner,
    GiftsList,
    GiftsMarkedByOwner,
    Message,
)
from app.api.deps import CurrentUser, SessionDep

import app.utils

router = fastapi.APIRouter(prefix="/gifts", tags=["gifts"])


@router.get("/me/wishlist", response_model=GiftsForOwner)
def get_own_wishlist(session: SessionDep, current_user: CurrentUser):
    """Get gifts from the logged-in user's wish list."""
    statement = sqlmodel.select(Gift).where(Gift.owner_id == current_user.id)
    gifts = session.exec(statement).all()
    return GiftsForOwner(data=gifts)


@router.get("/marked", response_model=GiftsMarkedByOwner)
def get_marked_gifts(session: SessionDep, current_user: CurrentUser):
    """Gets all the gifts the current user has marked on others' wish lists."""
    statement = sqlmodel.select(Gift).where(Gift.marked_by == current_user.id)
    gifts: list[Gift] = session.exec(statement).all()

    # Convert list of gifts into a mapping from their owners.
    marked_gifts: dict[str, list[GiftForOwner]] = {}
    for gift in gifts:
        name: str = gift.owner.display_name
        if name in marked_gifts:
            marked_gifts[name].append(gift)
        else:
            marked_gifts[name] = [gift]

    return GiftsMarkedByOwner(data=marked_gifts)


@router.post("/parse-text", response_model=GiftsList)
def parse_text(text: InputText):
    if len(text.text) == 0:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_400_BAD_REQUEST,
            detail="Empty request body.",
        )

    return GiftsList(data=app.utils.parse_text(text.text))


@router.get("/{user_id}/wishlist", response_model=GiftsPublic)
def get_wishlist(session: SessionDep, current_user: CurrentUser, user_id: int):
    """Gets a user's wishlist for the logged-in user to view."""
    if current_user.id == user_id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="You cannot view your own wish list in this way.",
        )

    statement = sqlmodel.select(Gift).where(Gift.owner_id == user_id)
    gifts = session.exec(statement).all()
    return GiftsPublic(data=gifts)


@router.get("/{gift_id}", response_model=GiftPublic)
def get_gift(session: SessionDep, current_user: CurrentUser, gift_id: int):
    """Gets a gift owned by a user other than the one who is logged in."""
    gift: Gift = session.get(Gift, gift_id)
    if gift.owner_id == current_user.id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="You cannot view your own gift in this way.",
        )
    return gift


@router.get("/me/{gift_id}", response_model=GiftForOwner)
def get_own_gift(session: SessionDep, current_user: CurrentUser, gift_id: int):
    """Gets a gift owned by the current user."""
    gift: Gift = session.get(Gift, gift_id)
    if gift.owner_id != current_user.id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="You cannot view another user's gift in this way.",
        )
    return gift


@router.post("/me", response_model=GiftForOwner)
def create_gift(*, session: SessionDep, current_user: CurrentUser, gift_in: GiftCreate):
    """Create a new gift for the logged-in user's wish list."""
    gift = Gift.model_validate(gift_in, update={"owner_id": current_user.id})
    session.add(gift)
    session.commit()
    session.refresh(gift)
    return gift


@router.patch("/me/{gift_id}", response_model=GiftForOwner)
def update_gift(
    *,
    session: SessionDep,
    gift_id: int,
    current_user: CurrentUser,
    gift_in: GiftUpdate,
):
    """Updates the gift."""
    gift: Gift = session.get(Gift, gift_id)

    if not gift:
        raise fastapi.HTTPException(status_code=404, detail="Gift not found.")

    if gift.owner_id != current_user.id:
        raise fastapi.HTTPException(
            status_code=403, detail="You don't have permission to do this."
        )

    update_dict = gift_in.model_dump(exclude_unset=True)
    gift.sqlmodel_update(update_dict)
    session.add(gift)
    session.commit()
    session.refresh(gift)
    return gift


@router.patch("/{gift_id}", response_model=GiftPublic)
def mark_gift(session: SessionDep, current_user: CurrentUser, gift_id: int):
    """Marks or unmarks the gift by the logged-in user."""
    gift: Gift = session.get(Gift, gift_id)

    # A user cannot mark their own gift.
    if gift.owner_id == current_user.id:
        raise fastapi.HTTPException(
            status_code=403, detail="You don't have permission to do this."
        )

    # Only the user who marked a gift may unmark it.
    if gift.marked and gift.marked_by != current_user.id:
        raise fastapi.HTTPException(
            status_code=403, detail="You don't have permission to do this."
        )

    if gift.marked:
        update_dict = {"marked": False, "marked_by": None}
    else:
        update_dict = {"marked": True, "marked_by": current_user.id}

    gift.sqlmodel_update(update_dict)

    session.add(gift)
    session.commit()
    session.refresh(gift)
    return gift


@router.delete("/{gift_id}")
def delete_gift(session: SessionDep, current_user: CurrentUser, gift_id: int):
    """Deletes a gift from the logged-in user's wish list."""
    gift: Gift = session.get(Gift, gift_id)
    if not gift:
        raise fastapi.HTTPException(status_code=404, detail="Gift not found.")

    if current_user.id != gift.owner_id:
        raise fastapi.HTTPException(
            status_code=403, detail="You don't have permission to do this."
        )

    session.delete(gift)
    session.commit()
    return Message(message="Gift deleted.")
