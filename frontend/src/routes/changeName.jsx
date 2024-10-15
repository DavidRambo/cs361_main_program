import { Form } from "react-router-dom";
import { changeDisplayName, getDisplayName, getMyId } from "../fetchers";
import { useLoaderData } from "react-router-dom";
import { redirect } from "react-router-dom";

// Load current display name.
export async function loader() {
  const myId = await getMyId();
  const displayName = await getDisplayName(myId);
  return displayName;
}

export async function action({ request }) {
  const myId = await getMyId();
  const formData = await request.formData(); // formData.get("newName"); etc.
  const newName = Object.fromEntries(formData).newName;

  if (newName === "") {
    alert("Your display name cannot be empty.");
    return redirect(`/mywishlist/change-name`);
  } else {
    await changeDisplayName(myId, newName);
    return redirect(`/mywishlist`);
  }
}

export default function ChangeName() {
  const currentName = useLoaderData();

  return (
    <div id="change-name-form">
      <Form method="post">
        <div>
          <p>Enter your new display name:</p>
        </div>

        <div>
          <input type="text" name="newName" placeholder={currentName} />
        </div>

        <div id="form-buttons">
          <button type="submit">Submit</button>

          <button
            onClick={(event) => {
              event.preventDefault();
              return redirect(`/mywishlist`);
            }}
          >
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}
