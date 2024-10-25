import React from "react";
import { redirect, useLoaderData } from "react-router-dom";
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

  // Retrieve value field of button with name="intent".
  const intent = formData.get("intent");
  if (intent === "cancel") {
    return redirect(`/mywishlist`);
  } else {
    await editItem(updates.hiddenUserId, updates.hiddenItemId, updates);
    return redirect(`/mywishlist`);
  }
}

export default function EditItem() {
  const { userId, item } = useLoaderData();
  const [hidden, setHidden] = React.useState(true);

  return (
    <div id="edit-item-component">
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

        <p>Anything else to add?</p>
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
          <button type="submit" name="intent" value="submit">
            Submit
          </button>

          <button type="submit" name="intent" value="cancel">
            Cancel
          </button>
        </div>
      </Form>

      <div id="delete-button-container">
        <Form
          method="post"
          action="delete"
          onSubmit={(event) => {
            if (!confirm("Are you sure you want to delete this item?")) {
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
