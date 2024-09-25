import { Box, useMediaQuery, useTheme } from "@mui/material";
import Search from './Search';
import Profile from './Profile';
import Notification from './Notification';
import MobileSection from './MobileSection';

export default function HeaderContent() {
    const theme = useTheme();
    const downLG = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <>
            {!downLG && <Search />}
            {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
            <Notification />
            {!downLG && <Profile />}
            {downLG && <MobileSection />}
        </>
    );
}