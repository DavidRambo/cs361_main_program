import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
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
            path: "/mywishlist/edit/:itemId",
            element: <EditItem />,
            loader: editItemLoader,
            action: editItemAction,
          },
          {
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
            path: "/wishlists/:personId",
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
