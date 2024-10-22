const mockDB = {
  people: [
    { id: 1, displayName: "David" },
    { id: 2, displayName: "Bri" },
    { id: 3, displayName: "Ranger" },
    { id: 4, displayName: "Sookie" },
  ],
  wishlists: [
    {
      id: 1,
      items: [
        {
          id: 1,
          what: "ZSA Voyager ",
          link: "zsa.io",
          details: "white, blank, pro red switches",
        },
        {
          id: 2,
          what: "Extra long headphone cable",
          link: "",
          details: "",
        },
      ],
    },
    {
      id: 2,
      items: [
        {
          id: 1,
          what: "Aphrodite's Advent Calendar",
          link: "",
          details: "",
        },
      ],
    },
    { id: 3, items: [] },
    {
      id: 4,
      items: [
        {
          id: 1,
          what: "King Lou's chicken feet",
          link: "",
          details: "Or similar.",
        },
      ],
    },
  ],
};

export async function getDisplayName(id) {
  const match = mockDB.people.filter((person) => person.id === id)[0];
  return match.displayName;
}

/** Returns a list of other users' ids and displayNames.
 *
 * @param {any} selfId primary key of the logged-in user
 * @returns {JSON array} array of objects comprising the id
 *   and displayName of users other than the logged-in user
 */
export async function getPeople(selfId) {
  return mockDB.people.filter((person) => person.id != selfId);
}

export async function getWishlist(id) {
  const match = mockDB.wishlists.filter((wishlist) => wishlist.id === id)[0];
  return match.items;
}

export async function getItem(userId, itemId) {
  const allItems = await getWishlist(parseInt(userId));
  const match = allItems.filter((item) => item.id === parseInt(itemId))[0];
  // const match = mockDB.wishlists
  //   .filter((wishlist) => wishlist.id === userId)[0]
  //   .items.filter((item) => item.id === itemId)[0];
  return match ?? null;
}

export async function getMyId() {
  return 1;
}

export async function nameIsUnique(newName) {
  for (const person of mockDB.people) {
    if (newName === person.displayName) {
      return false;
    }
  }
  return true;
}

export async function changeDisplayName(userId, newName) {
  const user = mockDB.people.filter((person) => person.id === userId)[0];
  user.displayName = newName;
}

export function createItem(userId, what, details = "") {
  const wishlist = mockDB.wishlists.filter(
    (wishlist) => wishlist.id === userId,
  )[0].items;

  // Determine its id based on last id in mock db array
  const itemId = wishlist[wishlist.length - 1].id + 1;

  // Store in wishlist.
  wishlist.push({ id: itemId, what: what, details: details });
}

export async function editItem(userId, itemId, updates) {
  const item = getItem(userId, itemId);
  // FIX: Won't mutate object in the way that changeDisplayName does.
  // item.what = updates.what;
  // item.details = updates.details;
  Object.assign(item, updates);
}
