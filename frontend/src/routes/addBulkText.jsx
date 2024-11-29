import { Form, redirect, useNavigate } from "react-router-dom";

import { text_api } from "../api";

export async function action({ request }) {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData);

  try {
    const res = await text_api.post("parse-text", entries);
    console.log(res.data.data);
  } catch (err) {
    console.log("Error requesting text parser: ", err);
    return redirect("/mywishlist/bulk-text-upload");
  }
  return redirect("/mywishlist");
}

export default function AddBulkText() {
  const navigate = useNavigate();

  const exampleTextRaw = String.raw`
        What the item is.
        https://example.com
        Some more details.
        On multiple lines.

        Another item
        No URL this time. Only details.

        A third item on its own
`;

  return (
    <div className="item-entry">
      <h2>Add Multiple Gift Ideas</h2>
      <p>
        To add several gift ideas at once, enter them with at least a blank line
        between them. The second line can be a URL starting with{" "}
        <code>https://</code>. Enter as many lines of additional details as you
        like. Here's an example:
      </p>
      <pre className="example-text">{exampleTextRaw}</pre>

      <br />

      <Form method="post" encType="multipart/form-data">
        <textarea name="text" className="itemTextArea" />

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
