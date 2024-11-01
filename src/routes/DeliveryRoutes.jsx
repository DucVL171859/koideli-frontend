import Loadable from "components/Loadable";
import { lazy } from "react";
import DeliverySection from "layout/Delivery";

const DeliveryPage = Loadable(
  lazy(() => import("pages/delivery/DeliveryPage"))
);
const NewDelivery = Loadable(lazy(() => import("pages/delivery/NewDelivery")));
const DeliveryTracking = Loadable(
  lazy(() => import("pages/delivery/DeliveryDetails"))
);
const DeliveryUpdateOrder = Loadable(
  lazy(() => import("pages/delivery/DeliveryUpdateOrder"))
);
const DeliveryUpdate = Loadable(
  lazy(() => import("pages/delivery/DeliveryUpdate"))
);
const Blogs = Loadable(lazy(() => import("pages/delivery/Blogs")));
const Tasks = Loadable(lazy(() => import("pages/delivery/Tasks")));
const Information = Loadable(lazy(() => import("pages/delivery/Infromation")));
const UpdateOrderStatus = Loadable(
  lazy(() => import("pages/delivery/DeliveryDetails"))
);

const DeliveryRoutes = {
  path: "/delivery",
  element: <DeliverySection />,
  children: [
    {
      path: "welcome",
      element: <DeliveryPage />,
    },

    {
      path: "delivery-checking",
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
      path: "delivery-update-order",
      children: [
        {
          path: "",
          element: <DeliveryUpdateOrder />,
        },
        {
          path: ":slug/update-timeline",
          element: <UpdateOrderStatus />,
        },
      ],
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
