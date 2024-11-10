import { lazy } from "react";
import Loadable from '../components/Loadable';


const Price = Loadable(lazy(() => import('../pages/Price')));

const PriceRoutes = {
    path: '/pricing',
    element: <Price/>,
    // children: [
    //     {
    //       path: "/pricing",
    //       element: <Price />,
    //     },
    // ]
}

export default PriceRoutes;