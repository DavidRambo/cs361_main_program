import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";

import { changeDisplayName, getMe, nameIsUnique } from "../fetchers";

// Load current display name.
export async function loader() {
  const myself = await getMe();
  return myself.display_name;
}

export async function action({ request }) {
  const formData = await request.formData(); // formData.get("newName"); etc.

  // Turn the form data into an object and extract `newName` text input.
  const newName = Object.fromEntries(formData).newName;

  if (newName === "") {
    alert("Your display name cannot be empty.");
    return redirect(`/mywishlist/change-name`);
  } else if (!(await nameIsUnique(newName))) {
    alert("Your display name must be unique.");
    return redirect(`/mywishlist/change-name`);
  } else {
    await changeDisplayName(newName);
    return redirect(`/mywishlist`);
  }
}

export default function ChangeName() {
  const currentName = useLoaderData();
  const navigate = useNavigate();

  return (
    <div className="form-container">
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
