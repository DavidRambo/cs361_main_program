import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Sorry about that...</h1>
      <p>An error occurred. Better check with your site organizer.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
