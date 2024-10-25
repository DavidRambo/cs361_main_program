import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";

import {
  changeDisplayName,
  getDisplayName,
  getMyId,
  nameIsUnique,
} from "../fetchers";

// Load current display name.
export async function loader() {
  const myId = await getMyId();
  const displayName = await getDisplayName(myId);
  return displayName;
}

export async function action({ request }) {
  const formData = await request.formData(); // formData.get("newName"); etc.

  // Turn the form data into an object and extract `newName` text input.
  const newName = Object.fromEntries(formData).newName;

  if (newName === "") {
    alert("Your display name cannot be empty.");
    return redirect(`/mywishlist/change-name`);
  } else if ((await nameIsUnique(newName)) === false) {
    alert("Your display name must be unique.");
    return redirect(`/mywishlist/change-name`);
  } else {
    const myId = await getMyId();
    await changeDisplayName(myId, newName);
    return redirect(`/mywishlist`);
  }
}

export default function ChangeName() {
  const currentName = useLoaderData();
  const navigate = useNavigate();

  return (
    <div id="change-name-form">
      <Form method="post">
        <p>Enter your new display name:</p>

        <div>
          <input type="text" name="newName" placeholder={currentName} />
        </div>

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
  );
}
