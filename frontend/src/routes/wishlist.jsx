import { useLoaderData } from "react-router-dom";

import Item from "../components/item";
import { getMe, getUser, getWishlist } from "../fetchers";

export async function loader({ params }) {
  const user = await getUser(params.userId);
  const items = await getWishlist(params.userId);
  const myself = await getMe();
  return {
    user,
    items,
    myself,
  };
}

export default function Wishlist() {
  const { user, items, myself } = useLoaderData();

  return (
    <div className="wishlist">
      <h1>{user.display_name}'s Wish List</h1>
      <p>
        To commit to giving a gift, mark the checkbox on the left. You can
        always come back and unmark it. The recipient won't know that they're
        receiving it. No one else will be able to select it.
      </p>
      <ul>
        {items.map((item) => (
          <Item key={item.id} item={item} myId={myself.id} />
        ))}
      </ul>
    </div>
  );
}
