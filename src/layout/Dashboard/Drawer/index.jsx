import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import MiniDrawerStyled from './MiniDrawerStyled';
import { handlerDrawerOpen, useGetMenuMaster } from '../../../api/menu';

export default function MainDrawer({ window }) {
    const theme = useTheme();
    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;
    const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

    // responsive drawer container
    const container = window !== undefined ? () => window().document.body : undefined;

    // header content
    const drawerContent = useMemo(() => <DrawerContent />, []);
    const drawerHeader = useMemo(() => <DrawerHeader open={!!drawerOpen} />, [drawerOpen]);

    return (
        <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1200 }} aria-label="mailbox folders">
            {!matchDownMD ? (
                <MiniDrawerStyled variant="permanent" open={drawerOpen}>
                    {drawerHeader}
                    {drawerContent}
                </MiniDrawerStyled>
            ) : (
                <Drawer
                    container={container}
                    variant="temporary"
                    open={drawerOpen}
                    onClose={() => handlerDrawerOpen(!drawerOpen)}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', lg: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: 250,
                            borderRight: '1px solid',
                            borderRightColor: 'divider',
                            backgroundImage: 'none',
                            boxShadow: 'inherit'
                        }
                    }}
                >
                    {drawerHeader}
                    {drawerContent}
                </Drawer>
            )}
        </Box>
    );
}

MainDrawer.propTypes = { window: PropTypes.func };
