import { lazy } from "react";
import Loadable from './../components/Loadable';

const HomePage = Loadable(lazy(() => import('./../pages/HomePage')));
const Price = Loadable(lazy(() => import('../layout/Home/Price')));

const HomeRoutes = {
    path: '/',
    element: <HomePage />,
    // children: [
    //     {
    //       path: "/pricing",
    //       element: <Price />,
    //     },
    // ]
}

export default HomeRoutes;