import Loadable from "components/Loadable";
import { lazy } from "react";
import DeliverySection from "layout/Delivery";

const DeliveryPage = Loadable(
  lazy(() => import("pages/delivery/DeliveryPage"))
);
const NewDelivery = Loadable(lazy(() => import("pages/delivery/NewDelivery")));
const CheckingDelivery = Loadable(
  lazy(() => import("pages/sale/OrderChecking"))
);
const DeliveryTracking = Loadable(
  lazy(() => import("pages/delivery/DeliveryTracking"))
);
const CompleteDelivery = Loadable(
  lazy(() => import("pages/sale/CompleteOrders"))
);
const DeliveryUpdate = Loadable(
  lazy(() => import("pages/delivery/DeliveryUpdate"))
);
const Blogs = Loadable(lazy(() => import("pages/delivery/Blogs")));
const Tasks = Loadable(lazy(() => import("pages/delivery/Tasks")));
const Information = Loadable(lazy(() => import("pages/delivery/Infromation")));

const DeliveryRoutes = {
  path: "/delivery",
  element: <DeliverySection />,
  children: [
    {
      path: "welcome",
      element: <DeliveryPage />,
    },
    {
      path: "new-delivery",
      element: <NewDelivery />,
    },
    {
      path: "delivery-update",
      element: <DeliveryUpdate />,
    },

    {
      path: "delivery-tracking",
      element: <DeliveryTracking />,
    },
    {
      path: "order-checking",
      element: <CheckingDelivery />,
    },
    {
      path: "complete-delivery",
      element: <CompleteDelivery />,
    },
    {
      path: "blogs",
      element: <Blogs />,
    },
    {
      path: "tasks",
      element: <Tasks />,
    },
    {
      path: "information",
      element: <Information />,
    },
  ],
};

export default DeliveryRoutes;
