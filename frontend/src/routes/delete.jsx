import { redirect } from "react-router-dom";

import { deleteItem } from "../fetchers";

export async function action({ params }) {
  await deleteItem(parseInt(params.itemId));
  return redirect("/mywishlist");
}
