import { createBrowserRouter } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import HomeRoutes from './HomeRoutes';
import LoginRoutes from './LoginRoutes';
import RegisterRoutes from './RegisterRoutes';
import SaleRoutes from './SaleRoutes';
import ManagerRoutes from './ManagerRoutes';
import ProfileRoutes from './ProfileRoutes';
import CreateOrderRoutes from './CreateOrder';

const router = createBrowserRouter([
    AdminRoutes,
    HomeRoutes,
    LoginRoutes,
    RegisterRoutes,
    SaleRoutes,
    ManagerRoutes,
    ProfileRoutes,
    CreateOrderRoutes
], {
    basename: '/'
});

export default router;