import { Grid, Stack, Typography } from "@mui/material";
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';
import { Link } from 'react-router-dom';

export default function Login() {
    return (
        <AuthWrapper>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid sx={{ marginBottom: 30 + 'px', textAlign: 'center', }}>
                        <Grid component={Link} to="/store"
                            sx={{
                                textDecoration: 'none',
                                '&:hover': {
                                    opacity: '70%'
                                }
                            }}
                        >
                        </Grid>
                    </Grid>
                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
                        <Typography variant="h3">Đăng nhập</Typography>
                        <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                            Chưa có tài khoản?
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <AuthLogin />
                </Grid>
            </Grid>
        </AuthWrapper>
    );
}