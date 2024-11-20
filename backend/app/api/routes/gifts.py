"""API Routes pertaining to Gifts."""

import uuid

import fastapi
import sqlmodel

from app.models import (
    Gift,
    GiftCreate,
    GiftUpdate,
    GiftPublic,
    GiftsPublic,
    GiftForOwner,
    GiftsForOwner,
    Message,
)
from app.api.deps import CurrentUser, SessionDep


router = fastapi.APIRouter(prefix="/gifts", tags=["gifts"])


@router.get("/me/wishlist", response_model=GiftsForOwner)
def get_own_wishlist(session: SessionDep, current_user: CurrentUser):
    """Get gifts from the logged-in user's wish list."""
    statement = sqlmodel.select(Gift).where(Gift.owner_id == current_user.id)
    gifts = session.exec(statement).all()
    return GiftsForOwner(data=gifts)


@router.get("/{user_id}/wishlist", response_model=GiftsPublic)
def get_wishlist(session: SessionDep, current_user: CurrentUser, id: uuid.UUID):
    """Gets a user's wishlist for the logged-in user to view."""
    if current_user.id == id:
        raise fastapi.HTTPException(
            status_code=fastapi.status.HTTP_403_FORBIDDEN,
            detail="You cannot view your own wish list in this way.",
        )

    statement = sqlmodel.select(Gift).where(Gift.owner_id == current_user.id)
    gifts = session.exec(statement).all()
    return GiftsPublic(data=gifts)


@router.post("/me", response_model=GiftForOwner)
def create_gift(*, session: SessionDep, current_user: CurrentUser, gift_in: GiftCreate):
    """Create a new gift for the logged-in user's wish list."""
    gift = Gift.model_validate(gift_in, update={"owner_id": current_user.id})
    session.add(gift)
    session.commit()
    session.refresh(gift)
    return gift


@router.put("/me/{gift_id}", response_model=GiftForOwner)
def update_gift(
    *,
    session: SessionDep,
    gift_id: uuid.UUID,
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
def mark_gift(session: SessionDep, current_user: CurrentUser, gift_id: uuid.UUID):
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
def delete_gift(session: SessionDep, current_user: CurrentUser, gift_id: uuid.UUID):
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
