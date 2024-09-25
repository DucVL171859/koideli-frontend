import { DashboardOutlined } from '@mui/icons-material';

const icons = {
    DashboardOutlined
};

const dashboard = {
    id: 'group-dashboard',
    title: 'Điều hướng',
    type: 'group',
    children: [
        {
            id: 'dashboard',
            title: 'Dashboard',
            type: 'item',
            url: '/admin/dashboard',
            icon: icons.DashboardOutlined,
            breadcrumbs: false
        }
    ]
};

export default dashboard;