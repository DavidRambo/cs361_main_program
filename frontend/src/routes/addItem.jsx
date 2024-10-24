import React from "react";
import { Form, redirect } from "react-router-dom";

import { createItem, getMyId } from "../fetchers";

export async function action({ request }) {
  const formData = await request.formData();

  // Retrieve value field of button with name="intent".
  const intent = formData.get("intent");
  if (intent === "cancel") {
    return redirect(`/mywishlist`);
  }

  const what = formData.get("what");
  const itemLink = formData.get("itemLink");
  const details = formData.get("details");

  if (what === "") {
    alert("You have to ask for *something*.");
    return redirect(`/mywishlist/add`);
  }

  createItem(await getMyId(), what, itemLink, details);
  return redirect(`/mywishlist`);
}

export default function AddItem() {
  return (
    <>
      <Form method="post" id="item-form">
        <h2>Add a Gift Idea to Your Wish List</h2>
        <p>What is it?</p>
        <input
          type="text"
          name="what"
          aria-label="What is it?"
          className="itemText"
        />

        <p>Want to provide a URL to the item?</p>
        <input
          type="text"
          name="itemLink"
          aria-label="Enter a URL for the item."
          className="itemText"
        />

        <p>Anything else to know?</p>
        <textarea
          name="details"
          aria-label="Add more details here."
          className="itemTextArea"
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
    </>
  );
}
