import React from 'react';
import { Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const DrawerStyled = styled(Drawer)(() => ({
    '& .MuiDrawer-paper': {
        width: 200,
        top: '69px',
    },
}));

const DrawerNav = [
    { title: 'New Orders', route: '/sale/new-orders' },
    { title: 'Complete Orders', route: '/sale/complete-orders' },
    { title: 'Blogs', route: '/sale/blogs' },
    { title: 'Tasks', route: '/sale/tasks' },
    { title: 'Information', route: '/sale/information' },
];

const DrawerComponent = ({ open, onClose }) => {
    return (
        <DrawerStyled variant="temporary" open={open} onClose={onClose}>
            <List>
                {DrawerNav.map(({ title, route }) => (
                    <ListItem key={route}>
                        <Button component="a" href={route} fullWidth>
                            <ListItemText primary={title} sx={{ color: '#000' }} />
                        </Button>
                    </ListItem>
                ))}
            </List>
        </DrawerStyled>
    );
};

export default DrawerComponent;