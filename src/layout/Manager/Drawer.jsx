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
    { title: 'Chuyến vận chuyển', route: '/manager/delivery-management' },
    { title: 'Đơn hàng mới', route: '/manager/new-orders' },
    { title: 'Đơn hàng hoàn tất', route: '/manager/complete-orders' },
    { title: 'Bài viết', route: '/manager/blogs' },
    { title: 'Đầu việc', route: '/manager/tasks' },
    { title: 'Thông tin', route: '/manager/information' }
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