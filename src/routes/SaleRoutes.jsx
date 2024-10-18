import Loadable from "components/Loadable";
import { lazy } from "react";
import SaleSection from "layout/Sale";

const SalePage = Loadable(lazy(() => import('pages/sale/SalePage')));
const Order = Loadable(lazy(() => import('pages/sale/Order')));
const OrderChecking = Loadable(lazy(() => import('pages/sale/OrderChecking')));
const Timeline = Loadable(lazy(() => import('pages/sale/OrderChecking')));
const Branch = Loadable(lazy(() => import('pages/sale/Branch')));
const Blogs = Loadable(lazy(() => import('pages/sale/Blogs')));
const Tasks = Loadable(lazy(() => import('pages/sale/Tasks')));

const SaleRoutes = {
    path: '/sale',
    element: <SaleSection />,
    children: [
        {
            path: 'welcome',
            element: <SalePage />
        },
        {
            path: 'order',
            element: <Order />
        },
        {
            path: 'order-checking/:slug',
            element: <OrderChecking />
        },
        {
            path: 'timeline',
            element: <Timeline />
        },
        {
            path: 'branch',
            element: <Branch />
        },
        {
            path: 'blogs',
            element: <Blogs />
        },
        {
            path: 'tasks',
            element: <Tasks />
        }
    ]
}

export default SaleRoutes;