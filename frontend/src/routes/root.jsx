export default function Root() {
  return (
    <>
      <div id="sidebar">
        <div id="my-list-button">
          <a href={`/mywishlist/`}>My List</a>
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
          <ul>
            <li>
              <a href={`/wishlists/1`}>Person 1</a>
            </li>
            <li>
              <a href={`/wishlists/2`}>Person 2</a>
            </li>
          </ul>
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
        <h1>Wish Lists</h1>
        <p>Select a person to view their wish list.</p>
        <p>Or select "My List" to add to and edit your own.</p>
      </div>
    </>
  );
}
