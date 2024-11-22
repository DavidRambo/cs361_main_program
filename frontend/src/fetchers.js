import { matchSorter } from "match-sorter";

import api from "./api";

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
    return res;
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
export async function getUsers() {
  try {
    const res = await api.get("/users");
    return res.data.data;
  } catch (err) {
    console.log("Error: ", err);
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

export async function getGift(id) {
  try {
    const res = await api.get(`/gifts/${id}`);
    return res.data;
  } catch (err) {
    console.log("Error retrieving gift: ", err);
  }
}

async function getWishlistsData() {
  try {
    return JSON.parse(localStorage.getItem("WishlistsData"));
  } catch (err) {
    console.log("Failed to parse JSON: ", err);
  }
}

async function writeWishlistsData(data) {
  localStorage.setItem("WishlistsData", JSON.stringify(data));
}

/** Returns a list of other users' ids and displayNames.
 *
 * @param {Number} selfId primary key of the logged-in user
 * @param {String} search string to match with user name
 * @returns {JSON array} array of objects comprising the id
 *   and displayName of users other than the logged-in user
 */
export async function getPeople(selfId, search) {
  const people = await getPeopleData();
  let otherPeople = people.filter((person) => person.id != selfId);
  if (!otherPeople) otherPeople = [];
  if (search) {
    otherPeople = matchSorter(otherPeople, search, { keys: ["displayName"] });
  }
  return otherPeople;
}

/** GET baseUrl/gifts/{user_id}/wishlist -> JSON array of GiftsPublic
 *
 * @param {any} personId id of the user whose wish list is being retrieved
 * @returns {JSON array} the user's wish list
 */
export async function getWishlist(userId) {
  const wishlist = await api.get(`gifts/${userId}/wishlist`);
  return wishlist.data.data;
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
export async function getItem(itemId) {
  try {
    const res = await api.get(`/gifts/${itemId}`);
    return res;
  } catch (err) {
    console.log("Error retrieving gift: ", err);
  }
}

/** GET baseUrl/gifts/me/{gift_id} -> GiftForOwner
 */
export async function getMyItem(itemId) {
  try {
    const res = await api.get(`/gifts/me/${itemId}`);
    return res;
  } catch (err) {
    console.log("Error retrieving gift: ", err);
  }
}

export async function getMyId() {
  return 1;
}

export async function createItem(userId, what, itemLink, details = "") {
  const allWishlists = await getWishlistsData();
  const wishlist = allWishlists.filter((wishlist) => wishlist.id === userId)[0]
    .items;

  // Determine its id based on last id in mock db array
  const itemId = wishlist[wishlist.length - 1].id + 1;

  // Store in wishlist.
  wishlist.push({
    id: itemId,
    what: what,
    link: itemLink,
    details: details,
    marked: false,
    markedBy: 0,
  });
  writeWishlistsData(allWishlists);
}

export async function editItem(userId, itemId, updates) {
  const allWishlists = await getWishlistsData();
  const wishlist = allWishlists.filter((w) => w.id === parseInt(userId))[0]
    .items;
  const item = wishlist.filter((item) => item.id === parseInt(itemId))[0];
  Object.assign(item, updates);
  writeWishlistsData(allWishlists);
}

export async function deleteItem(itemId) {
  const userId = await getMyId();

  const allWishlists = await getWishlistsData();
  const wishlist = allWishlists.filter((w) => w.id === userId)[0].items;

  const indexToDelete = wishlist.findIndex((item) => item.id === itemId);

  if (indexToDelete === -1) {
    console.log("Failed to delete item: item now found.");
  } else {
    let deletedItem = wishlist.splice(indexToDelete, indexToDelete);
    writeWishlistsData(allWishlists);
  }
}
