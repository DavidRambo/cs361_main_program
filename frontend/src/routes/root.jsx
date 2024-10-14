import { Link, Outlet, useLoaderData } from "react-router-dom";
import { getPeople } from "../fetchers";

export async function loader() {
  const userId = 1; // TODO: remove hardcoded id
  const people = await getPeople(userId);
  return { people };
}

export default function Root() {
  const { people } = useLoaderData();

  return (
    <>
      <div id="sidebar">
        <div id="my-list-button">
          <Link to={`/mywishlist/`}>My List</Link>
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
                  <Link to={`wishlists/${person.id}`}>
                    {person.displayName ? (
                      <>{person.displayName}</>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                  </Link>
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
      <div id="detail">
        <Outlet />
      </div>
    </>
  );
}
