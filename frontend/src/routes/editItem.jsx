import React from "react";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { Form } from "react-router-dom";

import { editItem, getItem, getMyId } from "../fetchers";

export async function loader({ params }) {
  const userId = await getMyId();
  const item = await getItem(userId, parseInt(params.itemId));
  return { userId, item };
}

export async function action({ request }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);

  await editItem(updates.hiddenUserId, updates.hiddenItemId, updates);
  return redirect(`/mywishlist`);
}

export default function EditItem() {
  const { userId, item } = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="item-entry">
      <Form method="post" id="item-form">
        <h2>Edit Your Gift Idea</h2>

        <p>What is it?</p>
        <input
          name="what"
          type="text"
          className="itemText"
          defaultValue={item.what}
        />

        <p>Want to provide a URL to the item?</p>
        <input
          type="text"
          name="itemLink"
          aria-label="Enter a URL for the item."
          className="itemText"
          defaultValue={item.link}
        />

        <p>Anything else that would help the gift giver?</p>
        <textarea
          name="details"
          className="itemTextArea"
          defaultValue={item.details}
        />

        <input
          name="hiddenUserId"
          type="number"
          readOnly
          hidden
          value={userId}
        />
        <input
          name="hiddenItemId"
          type="number"
          readOnly
          hidden
          value={item.id}
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
