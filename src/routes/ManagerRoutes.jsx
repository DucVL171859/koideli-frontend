import Loadable from "components/Loadable";
import { lazy } from "react";
import ManagerSection from "layout/Manager";

const ManagerPage = Loadable(lazy(() => import('pages/manager/ManagerPage')));
const Timeline = Loadable(lazy(() => import('pages/manager/Timeline')));
const Branch = Loadable(lazy(() => import('pages/manager/Branch')));
const Order = Loadable(lazy(() => import('pages/manager/Order')));
const OrderChecking = Loadable(lazy(() => import('pages/manager/OrderChecking')));
const Blogs = Loadable(lazy(() => import('pages/manager/Blogs')));
const Tasks = Loadable(lazy(() => import('pages/manager/Tasks')));

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
            element: <Timeline />
        },
        {
            path: 'branch',
            element: <Branch />
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
            path: 'blogs',
            element: <Blogs />
        },
        {
            path: 'tasks',
            element: <Tasks />
        }
    ]
}

export default ManagerRoutes;