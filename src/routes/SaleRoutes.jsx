import Loadable from "components/Loadable";
import { lazy } from "react";
import SaleSection from "layout/Sale";

const SalePage = Loadable(lazy(() => import('pages/sale/SalePage')));
const NewOrders = Loadable(lazy(() => import('pages/sale/NewOrders')));
const OrderChecking = Loadable(lazy(() => import('pages/sale/OrderChecking')));
const OrderUpdate = Loadable(lazy(() => import('pages/sale/OrderUpdate')));
const CompleteOrders = Loadable(lazy(() => import('pages/sale/CompleteOrders')));
const Blogs = Loadable(lazy(() => import('pages/sale/Blogs')));
const Tasks = Loadable(lazy(() => import('pages/sale/Tasks')));
const Information = Loadable(lazy(() => import('pages/sale/Information')));

const SaleRoutes = {
    path: '/sale',
    element: <SaleSection />,
    children: [
        {
            path: 'welcome',
            element: <SalePage />
        },
        {
            path: 'new-orders',
            element: <NewOrders />
        },
        {
            path: 'order-checking',
            element: <OrderChecking />
        },
        {
            path: 'order-update',
            element: <OrderUpdate />
        },
        {
            path: 'complete-orders',
            element: <CompleteOrders />
        },
        {
            path: 'blogs',
            element: <Blogs />
        },
        {
            path: 'tasks',
            element: <Tasks />
        },
        {
            path: 'information',
            element: <Information />
        }
    ]
}

export default SaleRoutes;