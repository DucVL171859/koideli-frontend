import {
    AppBar,
    Toolbar,
    Button,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItemText,
    Divider,
    useMediaQuery,
    useTheme,
    Typography,
    ListItemButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';
import { useEffect, useState } from 'react';

const Logo = styled('img')({
    height: 40,
    marginRight: 16,
});

const NavigationBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isScrolledUp, setIsScrolledUp] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        const handleScroll = () => {
            const newScrollPosition = window.scrollY;
            if (newScrollPosition < scrollPosition) {
                // Scrolling up
                setIsScrolledUp(true);
            } else {
                // Scrolling down
                setIsScrolledUp(false);
            }
            setScrollPosition(newScrollPosition);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollPosition]);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleUserMenuClick = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUserMenuClose = () => {
        setAnchorElUser(null);
    };

    const drawer = (
        <div>
            <List>
                <ListItemButton href='/' onClick={handleMenuClose}>
                    <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton href='/about-us' onClick={handleMenuClose}>
                    <ListItemText primary="About Us" />
                </ListItemButton>
                <ListItemButton href='/store' onClick={handleMenuClose} >
                    <ListItemText primary="Store" />
                </ListItemButton>
                <ListItemButton href='/contact' onClick={handleMenuClose}>
                    <ListItemText primary="Contact" />
                </ListItemButton>
            </List>
            <Divider />
            <List>
                <ListItemButton onClick={handleMenuClick}>
                    <ListItemText primary="Notifications" />
                </ListItemButton>
                <ListItemButton onClick={handleUserMenuClick}>
                    <ListItemText primary="User Account" />
                </ListItemButton>
            </List>
        </div>
    );

    return (
        <>
            <AppBar sx={{
                backgroundColor: '#FFF',
                color: '#000',
                m: 0,
                p: 0,
                boxShadow: 0,
                position: 'fixed',
                left: 0,
                width: '100%',
                transition: 'top 0.5s',
                top: isScrolledUp ? 0 : '-64px',
            }}
                position="relative">
                <Toolbar>
                    {/* Logo */}
                    <Logo src="https://via.placeholder.com/150x40?text=Logo" alt="Logo" />

                    {/* Navigation Buttons for Desktop */}
                    {!isMobile && (
                        <>
                            <Button href='/' color="inherit">Home</Button>
                            <Button href='/about-us' color="inherit">About Us</Button>
                            <Button href='/store' color="inherit">Store</Button>
                            <Button href='/contact' color="inherit">Contact</Button>
                        </>
                    )}
                    <div style={{ flexGrow: 1 }} />
                    <IconButton
                        color="inherit"
                        onClick={handleMenuClick}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                    >
                        <NotificationsIcon />
                        <Typography>Notification</Typography>
                    </IconButton>

                    {/* User Account Icon */}
                    <IconButton
                        color="inherit"
                        onClick={handleUserMenuClick}
                        sx={{ display: { xs: 'none', md: 'block' } }}
                    >
                        <AccountCircle />
                        <Typography>User</Typography>
                    </IconButton>

                    {/* Mobile Menu Icon */}
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            onClick={handleDrawerOpen}
                            sx={{ ml: 'auto' }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                </Toolbar>
            </AppBar>

            {/* Mobile Drawer */}
            <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={handleDrawerClose}
            >
                {drawer}
            </Drawer>

            {/* Notifications Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>Notification 1</MenuItem>
                <MenuItem onClick={handleMenuClose}>Notification 2</MenuItem>
                <MenuItem onClick={handleMenuClose}>Notification 3</MenuItem>
            </Menu>

            {/* User Account Menu */}
            <Menu
                anchorEl={anchorElUser}
                open={Boolean(anchorElUser)}
                onClose={handleUserMenuClose}
            >
                <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
                <MenuItem onClick={handleUserMenuClose}>Orders</MenuItem>
                <MenuItem onClick={handleUserMenuClose}>Logout</MenuItem>
            </Menu>
        </>
    );
};

export default NavigationBar;