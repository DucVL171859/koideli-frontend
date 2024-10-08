import Loadable from "components/Loadable";
import { lazy } from "react";
import ManagerSection from "layout/Manager";

const ManagerPage = Loadable(lazy(() => import('pages/manager/ManagerPage')));
const DeliveryManagement = Loadable(lazy(() => import('pages/manager/DeliveryManagement')));
const NewOrders = Loadable(lazy(() => import('pages/manager/NewOrders')));
const OrderChecking = Loadable(lazy(() => import('pages/manager/OrderChecking')));
const OrderUpdate = Loadable(lazy(() => import('pages/manager/OrderUpdate')));
const CompleteOrders = Loadable(lazy(() => import('pages/manager/CompleteOrders')));
const Blogs = Loadable(lazy(() => import('pages/manager/Blogs')));
const Tasks = Loadable(lazy(() => import('pages/manager/Tasks')));
const Information = Loadable(lazy(() => import('pages/manager/Information')));

const ManagerRoutes = {
    path: '/manager',
    element: <ManagerSection />,
    children: [
        {
            path: 'welcome',
            element: <ManagerPage />
        },
        {
            path: 'delivery-management',
            element: <DeliveryManagement />
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

export default ManagerRoutes;