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
    <>
      <Form method="post" id="change-name-form">
        <span>Enter your new display name:</span>
        <input type="text" name="newName" placeholder={currentName} />
        <button type="submit">Submit</button>
        <button>Cancel</button>
      </Form>
    </>
  );
}
