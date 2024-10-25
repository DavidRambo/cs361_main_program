import {
  NavLink,
  Outlet,
  useLoaderData,
  useNavigation,
} from "react-router-dom";
import {
  buildLocalData,
  getPeople,
  getMyId,
  getDisplayName,
} from "../fetchers";

export async function loader() {
  buildLocalData();
  const myId = await getMyId();
  const myself = await getDisplayName(myId);
  const people = await getPeople(myId);
  return { myself, people };
}

export default function Root() {
  const { myself, people } = useLoaderData();

  // returns current navigation state: "idle" | "submitting" | "loading"
  const navigation = useNavigation();

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
          <form id="search-form" role="search">
            <input
              id="q"
              aria-label="Search wish lists"
              placeholder="Search"
              type="search"
              name="q"
            />
            <div id="search-spinner" aria-hidden hidden={true} />
            <div className="sr-only" aria-live="polite"></div>
          </form>
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
