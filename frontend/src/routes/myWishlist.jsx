import { Link, useLoaderData } from "react-router-dom";

import MyItem from "../components/myItem";

import { getMe, getMarkedGifts, getMyWishlist } from "../fetchers";
import { csv_api, email_api, text_api } from "../api";

export async function loader() {
  return await getMyWishlist();
}

export default function MyWishlist() {
  const gifts = useLoaderData();
  console.log(`Gifts count = ${gifts.length}`);

  const exportService = async (gdata, service_name) => {
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

  const emailMyList = async (gifts) => {
    const myself = await getMe();

    const parse_response = await text_api.post("parse-wishlist", {
      data: gifts.map((g) => {
        return { what: g.what, link: g.link, details: g.details };
      }),
    });

    const emailData = {
      recipient_name: myself.display_name,
      recipient_addr: myself.email,
      subject: "Here's your wish list.",
      message: parse_response.data.text,
    };

    const res = await email_api.post("send-email", emailData);

    if (res.status === 201) {
      alert(`Email successfully sent to ${myself.email}`);
    } else {
      alert(`Email failed to send.`);
    }
  };

  const emailOtherGifts = async () => {
    const myself = await getMe();
    const markedGifts = await getMarkedGifts();

    console.log(markedGifts);

    const parse_response = await text_api.post("parse-marked", {
      data: markedGifts.data,
    });

    console.log("Parsed response: \n\n", parse_response.data);

    const emailData = {
      recipient_name: myself.display_name,
      recipient_addr: myself.email,
      subject: "Here are the gifts you've marked.",
      message: parse_response.data.text,
    };

    const res = await email_api.post("send-email", emailData);

    if (res.status === 201) {
      alert(`Email successfully sent to ${myself.email}`);
    } else {
      alert(`Email failed to send.`);
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

      {gifts.length > 0 ? (
        <ul id="my-wishlist-buttons">
          <li>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                exportService(gifts, "csv");
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
                exportService(gifts, "text");
              }}
            >
              Export to Plain Text
            </button>
          </li>
        </ul>
      ) : (
        <br />
      )}

      <h3>Email lists of gifts to myself:</h3>
      <ul id="my-wishlist-buttons">
        <li>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              emailMyList(gifts);
            }}
          >
            My List
          </button>
        </li>

        <li>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              emailOtherGifts();
            }}
          >
            Gifts I'm Getting Others
          </button>
        </li>
      </ul>
    </div>
  );
}
