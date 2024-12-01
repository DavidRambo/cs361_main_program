import { Form, Link, redirect } from "react-router-dom";

import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export async function action({ request }) {
  const formData = await request.formData();

  const oauthData = new URLSearchParams();
  oauthData.append("username", formData.get("email"));
  oauthData.append("password", formData.get("password"));

  try {
    const res = await api.post("/login/access-token", oauthData);

    localStorage.setItem(ACCESS_TOKEN, res.data.access_token);
    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
  } catch (err) {
    alert("Login failed.");
  }

  return redirect("/");
}

export default function Login() {
  return (
    <div className="auth-page">
      <h1>Login</h1>

      <Form method="post" className="auth-form">
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

        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>

      <div id="regButton">
        <p>Or click here to register:</p>
        <Link className="buttonLink" to={`/register`}>
          Register
        </Link>
      </div>
    </div>
  );
}
