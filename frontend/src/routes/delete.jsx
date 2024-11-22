import { redirect } from "react-router-dom";

import { deleteGift } from "../fetchers";

export async function action({ params }) {
  await deleteGift(params.itemId);
  return redirect("/mywishlist");
}
