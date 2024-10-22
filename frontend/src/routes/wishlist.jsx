import { Form, useLoaderData } from "react-router-dom";

import Item from "../components/item";
import { getDisplayName, getWishlist } from "../fetchers";

export async function loader({ params }) {
  const name = await getDisplayName(parseInt(params.personId));
  const items = await getWishlist(parseInt(params.personId));
  return { name, items };
}

// For marking and unmarking radio inputs next to each item, try useFetcher:
// https://reactrouter.com/en/main/hooks/use-fetcher

export default function Wishlist() {
  const { name, items } = useLoaderData();

  return (
    <>
      <h1>{name}'s Wish List</h1>
      <ul>
        {items.map((item) => (
          <Item key={item.id} what={item.what} details={item.details} />
        ))}
      </ul>
    </>
  );
}
