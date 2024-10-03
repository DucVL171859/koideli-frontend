import Loadable from 'components/Loadable';
import { lazy } from 'react';

const Login = Loadable(lazy(() => import('pages/authentication/Login')));

const LoginRoutes = {
    path: '/login',
    element: <Login />
}

export default LoginRoutes;