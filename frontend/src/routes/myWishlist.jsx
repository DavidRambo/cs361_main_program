import { Form, Link, useLoaderData } from "react-router-dom";

import MyItem from "../components/myItem";

import { getMyWishlist } from "../fetchers";
import { csv_api } from "../api";

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

      <ul id="my-wishlist-buttons">
        <li>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              const sendToService = async (gdata) => {
                try {
                  const gjson = gdata.map((g) => {
                    return { what: g.what, link: g.link, details: g.details };
                  });
                  const res = await csv_api.post("convert-to-csv", gjson);
                  console.log(res.data);

                  const blob = new Blob([res.data]);
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", "output.csv");
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                } catch (err) {
                  console.log("Error converting wish list to CSV.");
                }
              };
              sendToService(gifts);
            }}
          >
            Export to CSV
          </button>
        </li>
      </ul>
    </div>
  );
}
