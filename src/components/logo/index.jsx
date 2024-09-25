import { ButtonBase, Stack } from "@mui/material";
import Logo from './LogoMain';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const LogoSection = ({ sx, to }) => {
    return (
        <ButtonBase disableRipple component={Link} to={'/admin/dashboard'} sx={sx}>
            <Stack direction="row" spacing={1} alignItems="center">
                <Logo />
            </Stack>
        </ButtonBase>
    );
};

LogoSection.propTypes = {
    sx: PropTypes.object,
    to: PropTypes.string
};

export default LogoSection;