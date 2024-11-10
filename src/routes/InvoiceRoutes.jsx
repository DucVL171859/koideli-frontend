import Loadable from 'components/Loadable';
import { lazy } from 'react';

const TransactionVNP = Loadable(lazy(() => import('../layout/Home/UserProfile/Invoice')));

const LoginRoutes = {
    path: '/transactionInfor',
    element: <TransactionVNP />
}

export default LoginRoutes;