import { lazy } from "react";
import Loadable from './../components/Loadable';

const HomePage = Loadable(lazy(() => import('./../pages/HomePage')));

const HomeRoutes = {
    path: '/',
    element: <HomePage />
}

export default HomeRoutes;