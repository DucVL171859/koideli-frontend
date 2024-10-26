import { lazy } from "react";
import Loadable from './../components/Loadable';

const CreateOrder = Loadable(lazy(() => import('../pages/order/CreateOrderPage')));

const CreateOrderRoutes = {
    path: '/create-order',
    element: <CreateOrder />,
};

export default CreateOrderRoutes;