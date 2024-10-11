import { lazy } from "react";
import Loadable from './../components/Loadable';
import CreateOrder from "pages/order/createOrder";

const HomePage = Loadable(lazy(() => import('./../pages/HomePage')));

const HomeRoutes = {
    path: '/',
    element: <HomePage />,
    children: [
        {
          path: "create-order",
          element: <CreateOrder />,
        },
    ]
}

export default HomeRoutes;