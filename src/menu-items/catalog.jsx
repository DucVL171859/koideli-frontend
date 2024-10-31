import {
    AccountBoxOutlined,
    PriceChangeOutlined,
    Inventory2Outlined,
    SetMealOutlined,
    LocalShippingOutlined
} from '@mui/icons-material';

const icons = {
    SetMealOutlined,
    PriceChangeOutlined,
    AccountBoxOutlined,
    Inventory2Outlined,
    LocalShippingOutlined
};

const catalog = {
    id: 'group-catalog',
    title: 'Danh mục',
    type: 'group',
    children: [
        {
            id: 'pricing',
            title: 'Bảng giá',
            type: 'item',
            url: '/admin/pricing',
            icon: icons.PriceChangeOutlined,
            breadcrumbs: false
        },
        {
            id: 'user-account',
            title: 'Tài khoản',
            type: 'item',
            url: '/admin/user-account',
            icon: icons.AccountBoxOutlined,
            breadcrumbs: false
        },
        {
            id: 'box',
            title: 'Hộp cá',
            type: 'item',
            url: '/admin/box',
            icon: icons.Inventory2Outlined,
            breadcrumbs: false
        },
        {
            id: 'koi-fish-size',
            title: 'Kích thước cá',
            type: 'item',
            url: '/admin/koi-fish-size',
            icon: icons.SetMealOutlined,
            breadcrumbs: false
        },
        {
            id: 'vehicle',
            title: 'Xe vận chuyển',
            type: 'item',
            url: '/admin/vehicle',
            icon: icons.LocalShippingOutlined,
            breadcrumbs: false
        }
    ]
};

export default catalog;