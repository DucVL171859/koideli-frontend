import { AppBar, Toolbar, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { MenuOpen } from '@mui/icons-material'
import { useMemo } from "react";
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import { handlerDrawerOpen, useGetMenuMaster } from '../../../api/menu';

export default function Header() {
    const theme = useTheme();
    const downLG = useMediaQuery(theme.breakpoints.down('lg'));

    const { menuMaster } = useGetMenuMaster();
    const drawerOpen = menuMaster.isDashboardDrawerOpened;

    const headerContent = useMemo(() => <HeaderContent />, []);

    const iconBackColor = 'grey.100';
    const iconBackColorOpen = 'grey.200';

    const mainHeader = (
        <Toolbar>
            <IconButton
                disableRipple
                aria-label="open drawer"
                onClick={() => handlerDrawerOpen(!drawerOpen)}
                edge="start"
                color="secondary"
                variant="light"
                sx={{ color: 'text.primary', bgcolor: drawerOpen ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 } }}
            >
                {!drawerOpen ? <MenuOpen /> : <MenuOpen />}
            </IconButton>
            {headerContent}
        </Toolbar>
    );

    // app-bar params
    const appBar = {
        position: 'fixed',
        color: 'inherit',
        elevation: 0,
        sx: {
            borderBottom: `1px solid ${theme.palette.divider}`
        }
    };

    return (
        <>
            {!downLG ? (
                <AppBarStyled open={!!drawerOpen} {...appBar}>
                    {mainHeader}
                </AppBarStyled>
            ) : (
                <AppBar {...appBar}>{mainHeader}</AppBar>
            )}
        </>
    );
}