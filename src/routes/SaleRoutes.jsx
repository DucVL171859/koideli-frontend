import Loadable from "components/Loadable";
import { lazy } from "react";
import SaleSection from "layout/Sale";

const SalePage = Loadable(lazy(() => import('pages/sale/SalePage')));
const Order = Loadable(lazy(() => import('pages/sale/Order')));
const OrderChecking = Loadable(lazy(() => import('pages/sale/OrderChecking')));
const OrderUpdate = Loadable(lazy(() => import('pages/sale/OrderUpdate')));
const OrderDetail = Loadable(lazy(() => import('pages/sale/OrderDetail')));
const Timeline = Loadable(lazy(() => import('pages/sale/Timeline')));
const Blogs = Loadable(lazy(() => import('pages/sale/Blogs')));
// const Tasks = Loadable(lazy(() => import('pages/sale/Tasks')));

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
            path: 'order-update/:slug',
            element: <OrderUpdate />
        },
        {
            path: 'order-detail/:slug',
            element: <OrderDetail />
        },
        {
            path: 'timeline-delivery',
            element: <Timeline />
        },
        {
            path: 'blogs',
            element: <Blogs />
        }
    ]
}

export default SaleRoutes;