import { createBrowserRouter } from 'react-router-dom';
import AdminRoutes from './AdminRoutes';
import HomeRoutes from './HomeRoutes';
import LoginRoutes from './LoginRoutes';
import RegisterRoutes from './RegisterRoutes';

const router = createBrowserRouter([
    AdminRoutes,
    HomeRoutes,
    LoginRoutes,
    RegisterRoutes
], {
    basename: '/'
});

export default router;