import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Root, { loader as rootLoader } from "./routes/root";
import ErrorPage from "./error-page";
import MyWishlist, { loader as myWishlistLoader } from "./routes/myWishlist";
import Wishlist, { loader as wishlistLoader } from "./routes/wishlist";
import Index from "./routes";

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
