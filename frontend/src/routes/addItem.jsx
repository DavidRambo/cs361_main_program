import React from "react";
import { Form, redirect, useNavigate } from "react-router-dom";

import { createGift } from "../fetchers";
import { validateURL } from "../utils";

export async function action({ request }) {
  const formData = await request.formData();

  const newGift = {};
  newGift.what = formData.get("what");

  if (newGift.what === "") {
    alert("You have to ask for something.");
    return redirect(`/mywishlist/add`);
  }

  const link = formData.get("itemLink");
  if (link !== "") {
    if (validateURL(link)) {
      newGift.link = formData.get("itemLink");
    } else {
      alert("Your product link should start with `https://`");
      return redirect(`/mywishlist/add`);
    }
  }

  const details = formData.get("details");
  if (details !== "") {
    newGift.details = formData.get("details");
  }

  await createGift(newGift);
  return redirect(`/mywishlist`);
}

export default function AddItem() {
  const navigate = useNavigate();

  return (
    <>
      <div className="item-entry">
        <h2>Add a Gift Idea to Your Wish List</h2>

        <p>You can add multiple gift ideas at once:</p>
        <div id="form-buttons">
          <button
            type="button"
            onClick={() => {
              navigate("/mywishlist/csv-upload");
            }}
          >
            Upload CSV
          </button>

          <button
            type="button"
            onClick={() => {
              navigate("/mywishlist/bulk-text-upload");
            }}
          >
            Bulk Text Upload
          </button>
        </div>
        <p>Or enter an individual item's details below.</p>

        <Form method="post" id="item-form">
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

          <p>Anything else that would help the gift giver?</p>
          <textarea
            name="details"
            aria-label="Add more details here."
            className="itemTextArea"
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
      </div>
    </>
  );
}
