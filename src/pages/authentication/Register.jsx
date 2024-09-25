import { Grid, Stack, Typography } from "@mui/material";
import AuthWrapper from './AuthWrapper';
import AuthRegister from './auth-forms/AuthRegister';
import { Link } from 'react-router-dom';

export default function Register() {
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
                        <Typography variant="h3">Đăng ký</Typography>
                        <Typography component={Link} to="/login" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
                            Đã có tài khoản?
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <AuthRegister />
                </Grid>
            </Grid>
        </AuthWrapper>
    );
}  