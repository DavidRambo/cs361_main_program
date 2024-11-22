import { Link, useLoaderData } from "react-router-dom";

import MyItem from "../components/myItem";

import { getMyWishlist } from "../fetchers";

export async function loader() {
  return await getMyWishlist();
}

export default function MyWishlist() {
  const gifts = useLoaderData();

  return (
    <div className="wishlist">
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
        {gifts.map((item) => (
          <MyItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}
