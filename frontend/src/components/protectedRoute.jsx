import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// TODO: Commented out until implementing refresh token logic.
// import api from "../api";
import {
  // REFRESH_TOKEN,
  ACCESS_TOKEN,
} from "../constants";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = React.useState(null);

  // As soon as a ProtectedRoute component loads, try to load an authentication token.
  React.useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  });

  // TODO:If there is time to add it to the backend:
  // const refreshToken = async () => {}

  // Checks whether token needs refresh.
  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000; // date in seconds

    if (tokenExpiration < now) {
      // await refreshToken();
      setIsAuthorized(false);
    } else {
      // Token is not yet expired, so user is authorized.
      setIsAuthorized(true);
    }
  };

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
