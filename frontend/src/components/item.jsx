import React from "react";

import ProductLink from "./productLink";
import { markItem } from "../fetchers";

export default function Item({ item, personId, myId }) {
  const [hidden, setHidden] = React.useState(true);
  const [marked, setMarked] = React.useState(item.marked);
  const [checkedBy, setCheckedBy] = React.useState(item.markedBy);

  const changeCheckedBy = (isMarked) => {
    if (isMarked) {
      setCheckedBy(myId);
    } else {
      setCheckedBy(0);
    }
  };

  return (
    <li id="wish-list-item">
      <div id="wish-list-main-content">
        <div id="mark-container">
          <input
            type="checkbox"
            name="mark-gift"
            id="marked-checkbox"
            value={marked}
            aria-label={
              marked
                ? "Uncommit from giving this gift"
                : "Call dibs on giving this gift"
            }
            checked={marked === true}
            disabled={checkedBy === 0 || checkedBy === myId ? "" : "disabled"}
            onChange={() => {
              setMarked(marked ? false : true);
              markItem(marked ? false : true, personId, item.id, myId);
              changeCheckedBy(marked ? false : true);
            }}
          />
        </div>

        <div id="list-what" className={marked ? "marked" : "unmarked"}>
          {item.what}
        </div>

        <div id="list-button-container">
          {item.details === "" ? (
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
        </div>
      </div>

      <div>
        <ProductLink itemLink={item.link} />
      </div>

      <div className={hidden ? "hidden" : "revealed"}>
        {item.details.split("\n").map((portion, i) => {
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
