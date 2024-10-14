import { Form, useLoaderData } from "react-router-dom";
import { getDisplayName, getWishlist } from "../fetchers";

export async function loader({ params }) {
  const name = await getDisplayName(Number(params.personId));
  const items = await getWishlist(Number(params.personId));
  return { name, items };
}

export default function Wishlist() {
  const { name, items } = useLoaderData();

  return (
    <>
      <h1>{name}'s Wish List</h1>
    </>
  );
}
