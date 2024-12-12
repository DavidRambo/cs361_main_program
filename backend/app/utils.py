"""Utility functions for parsing text."""

import re

RE_SEP = re.compile(r"\n\n+")


def parse_text(text: str) -> list[dict[str, str | None]] | None:
    # Remove any carriage returns (this is client-OS-dependent).
    text = re.sub(r"\r", "", text)
    # Split into separate gift ideas based on consecutive newlines.
    if len(text) == 0:
        return None
    else:
        entries = RE_SEP.split(text)

    gifts = []

    # For each gift idea entry:
    for gift in entries:
        # Split off the "what"
        gift = gift.split("\n", maxsplit=1)
        what = gift[0]

        #   Verify it is < 256 characters.
        if len(what) > 255:
            what = what[0:255]

        # Are there additional lines?
        if len(gift) == 1:  # No.
            link = None
            details = None
        else:  # Yes.
            link, details = parse_extra(gift[1])

        gifts.append({"what": what, "link": link, "details": details})

    return gifts if len(gifts) > 0 else None


def parse_extra(text: str) -> tuple[str | None, str | None]:
    """Returns the link and details portions of the gift entry."""
    if text.startswith("https://"):
        # Includes a link, so split it off from the rest.
        text = text.split("\n", maxsplit=1)
        link = text[0]

        if len(text) > 1:
            details = text[1].rstrip()
            if details == "":
                details = None
        else:
            details = None
    else:
        link = None
        text = text.rstrip()
        details = text if text else None

    return (link, details)


def parse_json(wishlist: list[dict[str, str | None]]) -> str:
    """Converts a wish list into plain text format."""
    result = ""

    for gift in wishlist:
        result += gift["what"]
        if gift["link"] is not None:
            result += "\n" + gift["link"]
        if gift["details"] is not None:
            result += "\n" + gift["details"]
        result += "\n\n"

    return result.rstrip()
