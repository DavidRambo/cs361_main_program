import React from "react";

import ProductLink from "./productLink";
import { getItem, markItem } from "../fetchers";

export default function Item({ item, myId }) {
  // For revealing "More Details".
  const [hidden, setHidden] = React.useState(true);

  // For toggling the marked checkbox.
  const [gift, setGift] = React.useState(item);
  const [marked, setMarked] = React.useState(gift.marked);
  const [markedBy, setMarkedBy] = React.useState(gift.marked_by);

  React.useEffect(() => {
    async function runEffect() {
      const newGift = await getItem(item.id);
      setGift(newGift.data);
    }
    runEffect();
  }, []);

  const toggleMarked = () => {
    async function runToggle() {
      const markedGift = await markItem(item.id);
      setGift(markedGift.data);
      setMarked(markedGift.data.marked ? true : false);
    }
    runToggle();
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
            disabled={markedBy === null || markedBy === myId ? "" : "disabled"}
            onChange={() => {
              toggleMarked();
            }}
          />
        </div>

        <div id="list-what" className={marked ? "marked" : "unmarked"}>
          {gift.what}
        </div>

        <div id="list-button-container">
          {gift.details === null ? (
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

      <div>{gift.link !== null && <ProductLink itemLink={gift.link} />}</div>

      <div className={hidden ? "hidden" : "revealed"}>
        {gift.details !== null &&
          gift.details.split("\n").map((portion, i) => {
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
