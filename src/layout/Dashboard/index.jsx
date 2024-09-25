import { useEffect } from 'react';
import Drawer from './Drawer';
import Header from './Header';
import { handlerDrawerOpen, useGetMenuMaster } from '../../api/menu';
import Loader from '../../components/Loader';
import Breadcrumbs from '../../components/@extended/Breadcrumbs';
import navigation from '../../menu-items';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
    const theme = useTheme();
    const { menuMasterLoading } = useGetMenuMaster();
    const downXL = useMediaQuery(theme.breakpoints.down('xl'));

    useEffect(() => {
        handlerDrawerOpen(!downXL);
    }, [downXL]);

    if (menuMasterLoading) return <Loader />;

    return (
        <Box sx={{ display: 'flex', width: '100%' }}>
            <Header />
            <Drawer />
            <Box component="main" sx={{ width: 'calc(100% - 250px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Toolbar />
                <Breadcrumbs navigation={navigation} title />
                <Outlet />
            </Box>
        </Box>
    );
}