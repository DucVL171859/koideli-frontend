import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from '../../../../components/logo';

export default function DrawerHeader({ open }) {
    const theme = useTheme();

    return (
        <DrawerHeaderStyled theme={theme} open={!!open}>
            <Logo isIcon={!open} sx={{ width: open ? 'auto' : 35, height: 35 }} />
        </DrawerHeaderStyled>
    );
}

DrawerHeader.propTypes = { open: PropTypes.bool };
