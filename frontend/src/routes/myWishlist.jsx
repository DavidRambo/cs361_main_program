import { Link, useLoaderData } from "react-router-dom";

import MyItem from "../components/myItem";

import { getMyWishlist } from "../fetchers";
import { csv_api, text_api } from "../api";

export async function loader() {
  return await getMyWishlist();
}

export default function MyWishlist() {
  const gifts = useLoaderData();

  const sendToService = async (gdata, service_name) => {
    try {
      const gjson = gdata.map((g) => {
        return { what: g.what, link: g.link, details: g.details };
      });
      const output = {};
      if (service_name === "csv") {
        const res = await csv_api.post("convert-to-csv", gjson);
        output.data = res.data;
      } else if (service_name === "text") {
        const data = { data: gjson };
        console.log(data);
        const res = await text_api.post("parse-wishlist", data);
        output.data = res.data.text;
      } else {
        console.log("No service by that name.");
        return;
      }

      const blob = new Blob([output.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      if (service_name === "csv") {
        link.setAttribute("download", "wishlist.csv");
      } else if (service_name === "text") {
        link.setAttribute("download", "wishlist.txt");
      }
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.log(`Error converting wish list to ${service_name}.`);
    }
  };

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
              sendToService(gifts, "csv");
            }}
          >
            Export to CSV
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              sendToService(gifts, "text");
            }}
          >
            Export to Plain Text
          </button>
        </li>
      </ul>
    </div>
  );
}
