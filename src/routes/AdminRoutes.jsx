import { lazy } from "react";
import Loadable from './../components/Loadable';

import Dashboard from "../layout/Dashboard";

const AdminPage = Loadable(lazy(() => import('./../pages/AdminPage')));

const AdminRoutes = {
    path: '/admin',
    element: <Dashboard />,
    children: [
        {
            path: 'dashboard',
            element: <AdminPage />
        },
    ]
};

export default AdminRoutes;