"""Models for the SQL Database"""

import uuid

from pydantic import EmailStr, Url
from sqlmodel import SQLModel, Field, Relationship


class UserBase(SQLModel):
    """Model for User properties shared by all User models.

    Attributes:
        display_name: the string that will represent the user in the UI
        email: used for logging in, database index
    """

    display_name: str = Field(min_length=1, max_length=255)
    email: EmailStr = Field(unique=True, index=True)


class UserCreate(UserBase):
    """Model for properties received via API when creating a new user.

    Attributes:
        password: the password to be hashed
    """

    password: str = Field(min_length=8, max_length=120)


class User(UserBase, table=True):
    """User database model.

    Attributes:
        id: primary key
        hashed_pasword: password hash
        wishlist: array of all Gift rows with owner_id == User.id
    """

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_pasword: str
    wishlist: list["Gift"] = Relationship(back_populates="owner", cascade_delete=True)


class UserForOthers(UserBase):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    wishlist: list["Gift"] = Relationship(back_populates="owner", cascade_delete=True)


class UserForSelf(UserBase):
    wishlist_self: list["GiftForOwner"] = Relationship(
        back_populates="owner", cascade_delete=True
    )


class UserUpdateName(UserBase):
    """Properties to receive when updating User's display name."""

    display_name: str = Field(min_length=1, max_length=255)


class UpdatePassword(SQLModel):
    """Properties to receive via API when resetting password."""

    current_password: str = Field(min_length=8, max_length=120)
    new_password: str = Field(min_length=8, max_length=120)


class UserPublic(UserBase):
    """Properties to return via API: id, email, and display_name."""

    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


class GiftBase(SQLModel):
    """Base properties for a Gift, shared by all other Gift models.

    Attributes:
        what: name of the gift
        link: product URL
        details: additional information about the gift idea
    """

    what: str = Field(min_length=1, max_length=255)
    link: Url | None = Field(default=None)
    details: str | None = Field(default=None)


class GiftCreate(GiftBase):
    """Properties to receive upon creating a Gift."""

    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User = Relationship(back_populates="wishlist")


class GiftForOwner(GiftBase):
    """View of a Gift provided to the owner whose gift idea it is."""

    id: int = Field(primary_key=True)


class GiftUpdate(GiftForOwner):
    """Properties to receive upon updating a Gift."""

    pass


class GiftPublic(GiftCreate):
    """View of a Gift for users other than the gift idea's owner.

    Attributes:
        marked: whether the Gift has been selected by another User
        marked_by: id of the User who has marked the Gift
    """

    marked: bool = Field(default=False)
    marked_by: int | None = Field(default=None, foreign_key="user.id")


class Gift(GiftPublic, table=True):
    """Gift model for the database.

    Index on Gift.owner_id in order to make wish list lookups more efficient.

    From GiftPublic(GiftBase):
        what: name of the gift
        link: product URL
        details: additional information about the gift idea
        marked: whether the Gift has been selected by another User
        marked_by: id of the User who has marked the Gift

    Attributes:
        id: primary key
        owner_id: id of the user whose gift it is
        owner: User row in database whose gift it is
    """

    id: int = Field(primary_key=True)


class Token(SQLModel):
    """JSON payload containing access token."""

    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    """Contents of JWT token."""

    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=120)
