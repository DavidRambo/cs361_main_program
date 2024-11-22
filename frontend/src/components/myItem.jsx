import React from "react";
import { Link } from "react-router-dom";

import ProductLink from "./productLink";

/* The textarea newline trick for React is from comments to an answer on stackoverflow:
 * https://stackoverflow.com/a/36260137 */

export default function MyItem({ item }) {
  const [hidden, setHidden] = React.useState(true);

  return (
    <li id="wish-list-item">
      <div id="wish-list-main-content">
        <div id="list-what">{item.what}</div>

        <div id="list-button-container">
          {item.details === null ? (
            <button
              className="noDetails"
              onClick={(event) => event.preventDefault()}
            >
              No more info
            </button>
          ) : (
            <button
              type="submit"
              id="list-details-button"
              onClick={() => {
                setHidden(hidden ? false : true);
              }}
            >
              More details
            </button>
          )}
          <Link className="buttonLink" to={`/mywishlist/edit/${item.id}`}>
            Edit
          </Link>
        </div>
      </div>

      <div>{item.link !== null && <ProductLink itemLink={item.link} />}</div>

      <div className={hidden ? "hidden" : "revealed"}>
        {item.details !== null &&
          item.details.split("\n").map((portion, i) => {
            return (
              <span key={i}>
                {portion}
                <br />
              </span>
            );
          })}
      </div>
    </li>
  );
}
