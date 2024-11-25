import { Link, useFetcher, useLoaderData } from "react-router-dom";

import MyItem from "../components/myItem";

import { getMyWishlist } from "../fetchers";
import { csv_api } from "../api";

export async function clientAction({ request }) {
  const formData = await request.formData();
  const { gifts } = Object.fromEntries(formData);
  console.log(gifts);
  const res = await csv_api.get("convert-to-csv", formData.get("gifts"));
  console.log(res.data);
  // TODO: download res.attachment "output.csv"
  return { ok: true };
}

export async function loader() {
  return await getMyWishlist();
}

export default function MyWishlist() {
  const gifts = useLoaderData();
  const fetcher = useFetcher();

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

      <ul id="my-wishlist-buttons">
        <fetcher.Form method="post">
          <input name="gifts" value={gifts} hidden readOnly />
          <button type="submit">Export to CSV</button>
        </fetcher.Form>
        <li>
          <Link to={`/mywishlist/csv-export`} wishlist={gifts}>
            Export to CSV
          </Link>
        </li>
      </ul>
    </div>
  );
}
