import React from 'react';
import { Button, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';

const DrawerStyled = styled(Drawer)(() => ({
    '& .MuiDrawer-paper': {
        width: 200,
        marginTop: '60px'
    },
}));

const DrawerNav = [
    { title: 'Lịch trình', route: '/manager/timeline' },
    { title: 'Đơn hàng', route: '/manager/order' },
    { title: 'Bảng giá', route: '/manager/pricing' },
    { title: 'Bài viết', route: '/manager/blogs' },
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