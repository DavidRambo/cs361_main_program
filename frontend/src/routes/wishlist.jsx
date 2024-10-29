import { Form, useLoaderData } from "react-router-dom";

import Item from "../components/item";
import { getDisplayName, getMyId, getWishlist } from "../fetchers";

export async function loader({ params }) {
  const personId = parseInt(params.personId);
  const name = await getDisplayName(personId);
  const items = await getWishlist(personId);
  const userId = await getMyId();
  return { name, personId, items, userId };
}

// For marking and unmarking radio inputs next to each item, try useFetcher:
// https://reactrouter.com/en/main/hooks/use-fetcher

export default function Wishlist() {
  const { name, personId, items, userId } = useLoaderData();

  return (
    <div className="wishlist">
      <h1>{name}'s Wish List</h1>
      <p>
        To commit to giving a gift, mark the checkbox on the left. The recipient
        won't know that they're receiving it. No one else will be able to select
        it.
      </p>
      <ul>
        {items.map((item) => (
          <Item key={item.id} item={item} personId={personId} myId={userId} />
        ))}
      </ul>
    </div>
  );
}
