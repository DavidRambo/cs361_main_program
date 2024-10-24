// model data in JSON for prepopulating localStorage.
// Two main sections: people and wishlists. These are paired by id.
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
          marked: false,
          markedBy: 0,
        },
        {
          id: 2,
          what: "Extra long headphone cable",
          link: "",
          details: "",
          marked: false,
          markedBy: 0,
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
          marked: true,
          markedBy: 2,
        },
      ],
    },
    {
      id: 3,
      items: [
        {
          id: 3,
          what: "King Lou's Duck Necks",
          link: "",
          details: "Multiple boxes!",
          marked: true,
          markedBy: 1,
        },
      ],
    },
    {
      id: 4,
      items: [
        {
          id: 1,
          what: "King Lou's chicken feet",
          link: "",
          details: "Or similar.",
          marked: false,
          markedBy: 0,
        },
      ],
    },
  ],
};

// Prepopulate localStorage with people and wishlists data if they do not exist.
export function buildLocalData() {
  if (!localStorage.getItem("PeopleData")) {
    localStorage.setItem("PeopleData", JSON.stringify(mockDB.people));
  }
  if (!localStorage.getItem("WishlistsData")) {
    localStorage.setItem("WishlistsData", JSON.stringify(mockDB.wishlists));
  }
}

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

export async function getWishlist(personId) {
  const match = mockDB.wishlists.filter(
    (wishlist) => wishlist.id === personId,
  )[0];
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
  wishlist.push({
    id: itemId,
    what: what,
    details: details,
    marked: false,
    markedBy: 0,
  });
}

export async function editItem(userId, itemId, updates) {
  const item = getItem(userId, itemId);
  // FIX: Won't mutate object in the way that changeDisplayName does.
  // item.what = updates.what;
  // item.details = updates.details;
  Object.assign(item, updates);
}

export async function markItem(isMarked, personId, itemId, userId) {
  const item = await getItem(parseInt(personId), parseInt(itemId));

  if (isMarked) {
    // Update item to be marked by the current user.
    item.marked = true;
    item.markedBy = userId;
  } else {
    // Update the item to be no longer marked.
    item.marked = false;
    item.markedBy = 0;
  }
}
