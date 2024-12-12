import { matchSorter } from "match-sorter";

import api, { csv_api } from "./api";

/** GET baseURL/users/{user_id} -> JSON of UserPublic
 *
 * Returns:
 *  {
 *    "display_name": str,
 *    "email": str,
 *    "id": int
 *  }
 */
export async function getUser(userId) {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  } catch (err) {
    console.log("Error: ", err);
  }
}

/** GET baseURL/users -> JSON array of UsersPublic
 *
 * Excludes the current user.
 *
 * Returns:
 *  [
 *  {
 *    "display_name": str,
 *    "email": str,
 *    "id": int
 *  },
 *  ]
 */
export async function getUsers(search) {
  try {
    const res = await api.get("/users/");
    if (search) {
      return matchSorter(res.data.data, search, { keys: ["display_name"] });
    } else {
      return res.data.data;
    }
  } catch (err) {
    console.log("Error retrieving users: ", err);
  }
}

/** GET baseUrl/users/me -> JSON of UserPublic
 *
 * Returns the schema of the current user:
 * {
 *    "display_name": str,
 *    "email": str,
 *    "id": int
 *  }
 */
export async function getMe() {
  try {
    const res = await api.get("/users/me");
    return res.data;
  } catch (err) {
    console.log("Error: ", err);
  }
}

/**
 * @param {string} newName submitted name to display
 * @returns {boolean} true if no other user is using that name
 */
export async function nameIsUnique(newName) {
  // TODO: cache getUsers() data when it runs in Root, since it's used in nav sidebar?
  const users = await getUsers();
  for (const person of users) {
    if (newName === person.display_name) {
      return false;
    }
  }
  return true;
}

/**
 * @param {string} newName new display name for the current user
 */
export async function changeDisplayName(newName) {
  await api.patch("/users/me/name", {
    display_name: newName,
  });
}

/** GET baseUrl/gifts/me/wishlist -> JSON of list[GiftsForOwner]
 *
 * Returns the current user's wish list, which is a JSON array.
 * */
export async function getMyWishlist() {
  try {
    const res = await api.get("/gifts/me/wishlist");
    return res.data.data;
  } catch (err) {
    console.log("Error: ", err);
  }
}

/** GET baseUrl/gifts/me/gift_id -> JSON of GiftForOwner
 *
 * Retrieves the gift with the specified id if it belongs to the currently
 * logged-in user.
 */
export async function getOwnGift(id) {
  try {
    const res = await api.get(`/gifts/me/${id}`);
    return res.data;
  } catch (err) {
    console.log("Error retrieving gift: ", err);
  }
}

/** GET baseUrl/gifts/{user_id}/wishlist -> JSON array of GiftsPublic
 *
 * @param {any} personId id of the user whose wish list is being retrieved
 * @returns {JSON array} the user's wish list
 */
export async function getWishlist(userId) {
  try {
    const wishlist = await api.get(`gifts/${userId}/wishlist`);
    return wishlist.data.data;
  } catch (err) {
    console.log("Error retrieving a user's wishlist: ", err);
  }
}

/** GET baseUrl/me/marked -> JSON array of GiftsForOwner
 *
 * Returns a list of the gifts the logged-in user has marked on others' lists.
 */
export async function getMarkedGifts() {
  try {
    const res = await api.get("/gifts/marked");
    console.log(`Marked Gifts = ${res.data}`);
    return res.data;
  } catch (err) {
    console.log("Error fetching marked gifts.");
  }
}

/** PATCH baseUrl/gifts/{gift_id} -> GiftPublic
 *
 * Toggles whether the gift has been marked by another user.
 */
export async function markItem(itemId) {
  try {
    const res = await api.patch(`/gifts/${itemId}`);
    return res;
  } catch (err) {
    console.log("Error marking the gift: ", err);
  }
}

/** GET baseUrl/gifts/{gift_id} -> GiftPublic
 */
export async function getGift(itemId) {
  try {
    const res = await api.get(`/gifts/${itemId}`);
    return res;
  } catch (err) {
    console.log("Error retrieving gift: ", err);
  }
}

/** POST baseUrl/gifts/me -> GiftForOwner
 *
 * Request body: JSON with `what` and optionally `link` and `details`
 *
 * Returns JSON with schema: {what, link, details, id}
 */
export async function createGift(newGift) {
  try {
    if (newGift.link === "") {
      newGift.link = null;
    }
    const res = await api.post("/gifts/me", newGift);
    return res;
  } catch (err) {
    console.log(`Error creating new gift, ${newGift}: `, err);
  }
}

/** Receives an array of new gift idea data and calls createGift for each.
 *
 * @param {any} gifts JSON array of gift data
 */
export async function createGiftsFromArray(gifts) {
  for (const gift of gifts) {
    const _ = await createGift(gift);
  }
}

/** PATCH /gifts/me/{gift_id} -> JSON of GiftForOwner
 */
export async function editGift(giftId, updates) {
  try {
    const res = await api.patch(`/gifts/me/${giftId}`, updates);
    return res;
  } catch (err) {
    console.log("Error editing gift: ", err);
  }
}

/** DELETE /gifts/{gift_id} -> String
 */
export async function deleteGift(giftId) {
  try {
    const res = await api.delete(`/gifts/${giftId}`);
    return res; // "Gift deleted."
  } catch (err) {
    console.log("Failed to delete item. Error: ", err);
  }
}
