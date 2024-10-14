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
          what: "ZSA Voyager (white, blank, pro red switches)",
          details: "zsa.io",
        },
        {
          id: 2,
          what: "Extra long headphone cable",
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

export async function getMyId() {
  return 1;
}
