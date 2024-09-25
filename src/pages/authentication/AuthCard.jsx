import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import MainCard from '../../components/MainCard';

export default function AuthCard({ children, ...other }) {
    return (
        <MainCard
            sx={{ maxWidth: { xs: 400, lg: 475 }, margin: { xs: 2.5, md: 3 }, '& > *': { flexGrow: 1, flexBasis: '50%' } }}
            content={false}
            {...other}
            border={false}
            boxShadow
            shadow={1}
        >
            <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
        </MainCard>
    );
}

AuthCard.propTypes = { children: PropTypes.node, other: PropTypes.any };