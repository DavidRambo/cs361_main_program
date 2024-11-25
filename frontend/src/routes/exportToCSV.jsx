import { redirect } from "react-router-dom";

import { csv_api } from "../api";

export async function action({ request }) {
  const formData = await request.formData();
  const res = await csv_api.get("convert-to-csv", formData.gifts);
  console.log(res.data);
  // TODO: download res.attachment "output.csv"
  return redirect("/mywishlist");
}
