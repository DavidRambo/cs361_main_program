import api from "../api";

import { Form, redirect } from "react-router-dom";

export async function action({ request }) {
  const formData = await request.formData();

  const displayName = formData.get("displayName");
  const email = formData.get("email");
  const password = formData.get("password");

  const regCode = formData.get("regCode");

  try {
    await api.post("/users/register", {
      display_name: displayName,
      email,
      password,
      reg_code: regCode,
    });
  } catch (err) {
    if (err.response.status === 400) {
      alert(err.response.data.detail);
      return redirect("/register");
    }
    alert("Something went wrong.");
    console.log("Error: ", err);
  }

  return redirect("/login");
}

export default function Register() {
  localStorage.clear();

  return (
    <div className="auth-page">
      <h1>Register</h1>
      <Form method="post" className="auth-form">
        <label htmlFor="displayName" className="form-input-label">
          Display Name:
        </label>
        <input name="displayName" type="text" className="form-input" required />

        <label htmlFor="email" className="form-input-label">
          Email:
        </label>
        <input name="email" type="email" className="form-input" required />

        <label htmlFor="password" className="form-input-label">
          Password:
        </label>
        <input
          name="password"
          type="password"
          className="form-input"
          required
        />

        <label htmlFor="regCode" className="form-input-label">
          Registration Code:
        </label>
        <input name="regCode" type="text" className="form-input" required />

        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
    </div>
  );
}
