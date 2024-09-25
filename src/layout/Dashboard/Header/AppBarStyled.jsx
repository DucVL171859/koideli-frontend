import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { AppBar } from '@mui/material';

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    left: 0,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
    }),
    ...(!open && {
        width: `calc(100% - 0px)`
    }),
    ...(open && {
        marginLeft: 250,
        width: `calc(100% - 250px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen
        })
    })
}));

AppBarStyled.propTypes = {
    open: PropTypes.bool
};

export default AppBarStyled;