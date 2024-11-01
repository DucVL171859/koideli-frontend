import { lazy } from "react";
import Loadable from 'components/Loadable';

import Dashboard from "layout/Dashboard";

const AdminPage = Loadable(lazy(() => import('pages/AdminPage')));
const PricingTable = Loadable(lazy(() => import('pages/admin-catalog/PricingTable')));
const UserAccount = Loadable(lazy(() => import('pages/admin-catalog/UserAccount')));
const Box = Loadable(lazy(() => import('pages/admin-catalog/Box')));
const KoiFishSize = Loadable(lazy(() => import('pages/admin-catalog/KoiFishSize')));
const Vehicle = Loadable(lazy(() => import('pages/admin-catalog/Vehicle')));

const AdminRoutes = {
    path: '/admin',
    element: <Dashboard />,
    children: [
        {
            path: 'dashboard',
            element: <AdminPage />
        },
        {
            path: 'pricing',
            element: <PricingTable />
        },
        {
            path: 'user-account',
            element: <UserAccount />
        },
        {
            path: 'box',
            element: <Box />
        },
        {
            path: 'koi-fish-size',
            element: <KoiFishSize />
        },
        {
            path: 'vehicle',
            element: <Vehicle />
        },
    ]
};

export default AdminRoutes;