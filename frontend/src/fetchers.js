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
          link: "https://kingloupets.com/collections/shop-treats/products/free-range-whole-chicken-feet",
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
    console.log(">>> Loading mock user data...");
    localStorage.setItem("PeopleData", JSON.stringify(mockDB.people));
  }
  if (!localStorage.getItem("WishlistsData")) {
    console.log(">>> Loading mock wishlist data...");
    localStorage.setItem("WishlistsData", JSON.stringify(mockDB.wishlists));
  }
}

function getPeopleData() {
  try {
    return JSON.parse(localStorage.getItem("PeopleData"));
  } catch (err) {
    console.log("Failed to parse JSON: ", err);
  }
}

async function getWishlistsData() {
  try {
    return JSON.parse(localStorage.getItem("WishlistsData"));
  } catch (err) {
    console.log("Failed to parse JSON: ", err);
  }
}

async function writePeopleData(data) {
  localStorage.setItem("PeopleData", JSON.stringify(data));
}

async function writeWishlistsData(data) {
  localStorage.setItem("WishlistsData", JSON.stringify(data));
}

export async function getDisplayName(id) {
  const people = await getPeopleData();
  const match = people.filter((person) => person.id === id)[0];
  return match.displayName;
}

/** Returns a list of other users' ids and displayNames.
 *
 * @param {any} selfId primary key of the logged-in user
 * @returns {JSON array} array of objects comprising the id
 *   and displayName of users other than the logged-in user
 */
export async function getPeople(selfId) {
  const people = await getPeopleData();
  return people.filter((person) => person.id != selfId);
}

export async function getWishlist(personId) {
  const wishlists = await getWishlistsData();
  console.log(">>> ", wishlists);
  const match = wishlists.filter((wishlist) => wishlist.id === personId)[0];
  return match.items;
}

export async function getItem(userId, itemId) {
  const allItems = await getWishlist(parseInt(userId));
  const match = allItems.filter((item) => item.id === parseInt(itemId))[0];
  return match ?? null;
}

export async function getMyId() {
  return 1;
}

export async function nameIsUnique(newName) {
  const people = await getPeopleData();
  for (const person of people) {
    if (newName === person.displayName) {
      return false;
    }
  }
  return true;
}

export async function changeDisplayName(userId, newName) {
  const people = await getPeopleData();
  const user = people.filter((person) => person.id === userId)[0];
  user.displayName = newName;
  writePeopleData(people);
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
