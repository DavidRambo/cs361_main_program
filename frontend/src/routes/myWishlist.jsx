import { Form, Link, useLoaderData } from "react-router-dom";

import MyItem from "../components/myItem";

import { getMyId, getWishlist } from "../fetchers";

export async function loader() {
  const userId = await getMyId();
  const match = await getWishlist(userId);
  return match;
}

export default function MyWishlist() {
  const items = useLoaderData();

  return (
    <>
      <h1>My Wish List</h1>

      <ul id="my-wishlist-buttons">
        <li>
          <Link to={`/mywishlist/change-name`}>Change your name</Link>
        </li>
        <li>
          <Link to={`/mywishlist/add`}>Add to your list</Link>
        </li>
      </ul>

      <ul>
        {items.map((item) => (
          <MyItem key={item.id} what={item.what} details={item.details} />
        ))}
      </ul>
    </>
  );
}
