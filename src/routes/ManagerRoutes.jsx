import Loadable from "components/Loadable";
import { lazy } from "react";
import ManagerSection from "layout/Manager";

const ManagerPage = Loadable(lazy(() => import('pages/manager/ManagerPage')));
const Timeline = Loadable(lazy(() => import('pages/manager/Timeline')));
const CreateOrderTimeline = Loadable(lazy(() => import('pages/manager/CreateOrderTimeline')));
const Order = Loadable(lazy(() => import('pages/manager/Order')));
const OrderChecking = Loadable(lazy(() => import('pages/manager/OrderChecking')));
const OrderUpdate = Loadable(lazy(() => import('pages/manager/OrderUpdate')));
const OrderDetail = Loadable(lazy(() => import('pages/manager/OrderDetail')));
const PricingTable = Loadable(lazy(() => import('pages/manager/PricingTable')));
const Blogs = Loadable(lazy(() => import('pages/manager/Blogs')));

const ManagerRoutes = {
    path: '/manager',
    element: <ManagerSection />,
    children: [
        {
            path: 'welcome',
            element: <ManagerPage />
        },
        {
            path: 'timeline',
            children: [
                {
                    path: '',
                    element: <Timeline />
                },
                {
                    path: ':slug/create-order-timeline',
                    element: <CreateOrderTimeline />
                },
            ]

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
            path: 'pricing',
            element: <PricingTable />
        },
        {
            path: 'blogs',
            element: <Blogs />
        }
    ]
}

export default ManagerRoutes;