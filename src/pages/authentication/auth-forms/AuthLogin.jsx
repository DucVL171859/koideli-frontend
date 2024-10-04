import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import SocialLogin from './SocialLogin';

import { Button, Checkbox, Divider, FormControlLabel, FormHelperText, Grid, Link, InputAdornment, IconButton, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { loginAction } from 'redux/auth/actions';
import authServices from 'services/authServices';

const AuthLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        checked: false,
        showPassword: false,
        errors: {
            email: '',
            password: ''
        },
        touched: {
            email: false,
            password: false
        }
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleClickShowPassword = () => {
        setFormData({
            ...formData,
            showPassword: !formData.showPassword
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleCheckboxChange = (event) => {
        setFormData({
            ...formData,
            checked: event.target.checked
        });
    };

    const handleBlur = (event) => {
        const { name } = event.target;
        setFormData({
            ...formData,
            touched: {
                ...formData.touched,
                [name]: true
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const loginUser = { ...formData };

        if (loginUser.email.includes('customer')) {
            navigate('/');
        }
        else if (loginUser.email.includes('sale')) {
            navigate('/sale/welcome');
        }
        else if (loginUser.email.includes('delivery')) {
            navigate('/register');
        }
    }

    const checkCredentials = async (loginData) => {
        try {
            let resOfAuth = await authServices.login(loginData);
            if (resOfAuth) return resOfAuth;
            else TurnLeft;
        } catch (error) {
            return error;
        }
    }

    const { email, password, checked, showPassword, errors, touched } = formData;

    return (
        <>
            <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="email-login">Tài khoản</InputLabel>
                            <OutlinedInput
                                id="email-login"
                                type="text"
                                value={email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Nhập tên tài khoản"
                                fullWidth
                                error={Boolean(touched.email && errors.email)}
                            />
                            {touched.email && errors.email && (
                                <FormHelperText error id="standard-weight-helper-text-email-login">
                                    {errors.email}
                                </FormHelperText>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="password-login">Mật khẩu</InputLabel>
                            <OutlinedInput
                                fullWidth
                                error={Boolean(touched.password && errors.password)}
                                id="password-login"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                name="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                            color="secondary"
                                        >
                                            {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                placeholder="Nhập mật khẩu"
                            />
                            {touched.password && errors.password && (
                                <FormHelperText error id="standard-weight-helper-text-password-login">
                                    {errors.password}
                                </FormHelperText>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: -1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={handleCheckboxChange}
                                        name="checked"
                                        color="primary"
                                        size="small"
                                    />
                                }
                                label={<Typography variant="h6">Giữ tôi đăng nhập</Typography>}
                            />
                            <Link variant="h6" component={RouterLink} color="text.primary">
                                Quên mật khẩu?
                            </Link>
                        </Stack>
                    </Grid>
                    {errors.submit && (
                        <Grid item xs={12}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="primary">
                            Đăng nhập
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider>
                            <Typography variant="caption"> Đăng nhập với</Typography>
                        </Divider>
                    </Grid>
                    <Grid item xs={12}>
                        <SocialLogin />
                    </Grid>
                </Grid>
            </form>
        </>
    )
}

export default AuthLogin;