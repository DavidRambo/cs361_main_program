import { Form } from "react-router-dom";

export async function action({ request }) {
  const formData = await request.formData();
}

// TODO: Make input text fields grow/resize, especially the details one.
export default function AddItem() {
  return (
    <>
      <h2>Add Gift Idea</h2>
      <Form>
        <p>What is it?</p>
        <input type="text" name="what" aria-label="What is it?" />
        <p>Anything else to know?</p>
        <input type="text" name="details" aria-label="Add more details here." />
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
    </>
  );
}
