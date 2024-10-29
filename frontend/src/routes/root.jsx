import React from "react";
import {
  Form,
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";

import {
  buildLocalData,
  getPeople,
  getMyId,
  getDisplayName,
} from "../fetchers";

/* Loads the names of the current user and other users, which are used in the
 * sidebar navigation links.
 */
export async function loader({ request }) {
  buildLocalData(); // Prepopulate local storage for dev/demo purposes.

  // Get search data.
  const url = new URL(request.url);
  const search = url.searchParams.get("search");

  const myId = await getMyId();
  const myself = await getDisplayName(myId);
  const people = await getPeople(myId, search);

  return { myself, people, search };
}

export default function Root() {
  const { myself, people, search } = useLoaderData();

  // returns current navigation state: "idle" | "submitting" | "loading"
  const navigation = useNavigation();

  // To submit search Form on change.
  const submit = useSubmit();

  // To display a search spinner when navigating to a new URL and loading data.
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("search");

  // Synchronize search field's value with url parameter.
  React.useEffect(() => {
    document.getElementById("search").value = search;
  }, [search]);

  return (
    <>
      <div id="sidebar">
        <div id="my-list-button">
          <NavLink
            to={`/mywishlist/`}
            className={({ isActive, isPending }) =>
              isActive ? "active" : isPending ? "pending" : ""
            }
          >
            My List — {myself}
          </NavLink>
        </div>

        <div>
          <Form id="search-form" role="search">
            <input
              id="search"
              aria-label="Search wish lists"
              placeholder="Search"
              autoComplete="off"
              type="search"
              name="search"
              defaultValue={search}
              onChange={(event) => {
                submit(event.currentTarget.form, {
                  replace: !isFirstSearch, // Only replace search results in nav history.
                });
              }}
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
        </div>

        <nav>
          {people.length ? (
            <ul>
              {people.map((person) => (
                <li key={person.id}>
                  <NavLink to={`wishlists/${person.id}`}>
                    {person.displayName ? (
                      <>{person.displayName}</>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No wish lists to view.</i>
            </p>
          )}
        </nav>

        <div id="logout">
          <ul>
            <li>
              <a href={`/logout/`}>Logout</a>
            </li>
          </ul>
        </div>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
