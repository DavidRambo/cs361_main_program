import { Form, redirect, useNavigate } from "react-router-dom";

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

      <Form method="post">
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
