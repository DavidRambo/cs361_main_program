import { Form, redirect, useNavigate } from "react-router-dom";
import { createGiftsFromArray } from "../fetchers";
import { csv_api } from "../api";

export async function action({ request }) {
  const formData = await request.formData();

  if (formData.file === "") {
    alert("You need to upload a CSV file.");
    return redirect("/mywishlist/csv-upload");
  }

  const res = await csv_api.post("upload-csv", formData);

  const csv_data = await res.data;

  await createGiftsFromArray(csv_data);

  return redirect("/mywishlist");
}

export default function AddByCSV() {
  const navigate = useNavigate();

  return (
    <div className="item-entry">
      <Form method="post" encType="multipart/form-data">
        <p>
          <label htmlFor="file">Select a CSV file to upload:</label>
        </p>

        <input type="file" name="file" />

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
