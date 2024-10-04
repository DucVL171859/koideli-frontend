import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from 'layout/Sale/Header';
import Drawer from 'layout/Sale/Drawer';
import { Outlet } from 'react-router-dom';

const SaleSection = () => {
    const [open, setOpen] = useState(false);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header onToggleDrawer={handleDrawerToggle} />
            <Drawer open={open} onClose={handleDrawerToggle} />
            <Box component="main" sx={{ width: 'calc(100% - 250px)', flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default SaleSection;