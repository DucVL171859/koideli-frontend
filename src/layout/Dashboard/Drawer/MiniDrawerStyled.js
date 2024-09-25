import { Drawer, styled } from "@mui/material";

const openedMixin = (theme) => ({
    width: 250,
    borderRight: '1px solid',
    borderRightColor: theme.palette.divider,

    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
    }),

    overflowX: 'hidden',
    boxShadow: 'none'
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),

    overflowX: 'hidden',
    width: 0,
    borderRight: 'none',
    boxShadow: '3px'
});

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: 250,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme)
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme)
    })
}));

export default MiniDrawerStyled;
