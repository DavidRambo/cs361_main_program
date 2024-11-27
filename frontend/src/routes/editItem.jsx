import React from "react";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { Form } from "react-router-dom";

import { editGift, getOwnGift } from "../fetchers";
import { validateURL } from "../utils";

export async function loader({ params }) {
  const gift = await getOwnGift(params.itemId);
  return { gift };
}

export async function action({ request }) {
  const formData = await request.formData();
  const { hiddenGiftId, itemLink, ...updates } = Object.fromEntries(formData);

  if (itemLink !== "") {
    if (validateURL(itemLink)) {
      updates.link = itemLink;
    } else {
      alert("Your product link should start with `https://`");
      return redirect(`/mywishlist/edit/${hiddenGiftId}`);
    }
  } else {
    updates.link = null;
  }

  await editGift(hiddenGiftId, updates);
  return redirect(`/mywishlist`);
}

export default function EditItem() {
  const { gift } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="item-entry">
      <Form method="post">
        <h2>Edit Your Gift Idea</h2>

        <p>What is it?</p>
        <input
          name="what"
          type="text"
          className="itemText"
          defaultValue={gift.what}
        />

        <p>Want to provide a URL to the item?</p>
        <input
          type="text"
          name="itemLink"
          aria-label="Enter a URL for the gift."
          className="itemText"
          defaultValue={gift.link}
        />

        <p>Anything else that would help the gift giver?</p>
        <textarea
          name="details"
          className="itemTextArea"
          defaultValue={gift.details}
        />

        <input
          name="hiddenGiftId"
          type="number"
          readOnly
          hidden
          value={gift.id}
        />

        <div id="form-buttons">
          <button type="submit">Submit</button>

          <button
            type="button"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </button>
        </div>
      </Form>

      <div id="delete-button-container">
        <Form
          method="post"
          action="delete"
          onSubmit={(event) => {
            if (
              !confirm(
                "Are you sure? This will permanently remove the item from your list.",
              )
            ) {
              event.preventDefault();
            }
          }}
        >
          <button type="submit" id="delete-button">
            Delete
          </button>
        </Form>
      </div>
    </div>
  );
}
