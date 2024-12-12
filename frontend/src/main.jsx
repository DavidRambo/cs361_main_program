import React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import "./index.css";

import ProtectedRoute from "./components/protectedRoute";
import Login, { action as loginAction } from "./routes/login";
import Register, { action as registerAction } from "./routes/register";
import Root, { loader as rootLoader } from "./routes/root";
import ErrorPage from "./error-page";
import MyWishlist, { loader as myWishlistLoader } from "./routes/myWishlist";
import Wishlist, { loader as wishlistLoader } from "./routes/wishlist";
import Index from "./routes";
import ChangeName, {
  loader as changeNameLoader,
  action as changeNameAction,
} from "./routes/changeName";
import AddItem, { action as addItemAction } from "./routes/addItem";
import EditItem, {
  action as editItemAction,
  loader as editItemLoader,
} from "./routes/editItem";
import { action as deleteAction } from "./routes/delete";
import AddBulkText, { action as bulkTextAction } from "./routes/addBulkText";

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

const router = createBrowserRouter([
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
    action: registerAction,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorPage />,
    action: loginAction,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Root />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    loader: rootLoader,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Index />,
          },
          {
            path: "/logout",
            element: <Logout />,
          },
          {
            path: "/mywishlist",
            element: <MyWishlist />,
            loader: myWishlistLoader,
          },
          {
            path: "/mywishlist/add",
            element: <AddItem />,
            action: addItemAction,
          },
          {
            path: "/mywishlist/bulk-text-upload",
            element: <AddBulkText />,
            action: bulkTextAction,
          },
          {
            path: "/mywishlist/edit/:itemId",
            element: <EditItem />,
            loader: editItemLoader,
            action: editItemAction,
          },
          {
            // The `delete` portion of the path is specified by the Form's `action`
            // property in EditItem.
            path: "/mywishlist/edit/:itemId/delete",
            action: deleteAction,
          },
          {
            path: "/mywishlist/change-name",
            element: <ChangeName />,
            loader: changeNameLoader,
            action: changeNameAction,
          },
          {
            path: "/wishlists/:userId",
            element: <Wishlist />,
            loader: wishlistLoader,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
