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
  } else if (intent === "delete") {
    // TODO: modal confirmation of delete.
    alert("TODO: modal confirmation of delete.");
    return redirect(`/mywishlist`);
  } else {
    await editItem(updates.hiddenUserId, updates.hiddenItemId, updates);
    return redirect(`/mywishlist`);
  }
}

export default function EditItem() {
  const { userId, item } = useLoaderData();

  return (
    <Form method="post" id="item-form">
      <h2>Edit Your Gift Idea</h2>

      <p>What is it?</p>
      <input
        name="what"
        type="text"
        className="itemText"
        defaultValue={item.what}
      />

      <p>Anything else to add?</p>
      <textarea
        name="details"
        className="itemTextArea"
        defaultValue={item.details}
      />

      <input name="hiddenUserId" type="number" readOnly hidden value={userId} />
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

      <div id="delete-button-container">
        <button type="submit" name="intent" value="delete" id="delete-button">
          Delete
        </button>
      </div>
    </Form>
  );
}
