import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { Button, FormHelperText, Grid, Link, InputAdornment, IconButton, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import { strengthColor, strengthIndicator } from '../../../utils/password-strength';

const AuthRegister = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [formErrors, setFormErrors] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordLevel, setPasswordLevel] = useState();
    const [errors, setErrors] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        if (name === 'password') {
            changePassword(value);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const changePassword = (value) => {
        const temp = strengthIndicator(value);
        setPasswordLevel(strengthColor(temp));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="fullname">Họ và tên *</InputLabel>
                            <OutlinedInput
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={formData.fullname}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={Boolean(formErrors.fullname)}
                            />
                            {formErrors.fullname && (
                                <Typography variant="caption" color="error">
                                    {formErrors.fullname}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="username">Tên tài khoản *</InputLabel>
                            <OutlinedInput
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={Boolean(formErrors.username)}
                            />
                            {formErrors.username && (
                                <Typography variant="caption" color="error">
                                    {formErrors.username}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="email">Email *</InputLabel>
                            <OutlinedInput
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={Boolean(formErrors.email)}
                            />
                            {formErrors.email && (
                                <Typography variant="caption" color="error">
                                    {formErrors.email}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="password">Mật khẩu *</InputLabel>
                            <OutlinedInput
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={Boolean(formErrors.password)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {formErrors.password && (
                                <Typography variant="caption" color="error">
                                    {formErrors.password}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack spacing={1}>
                            <InputLabel htmlFor="confirmPassword">Xác nhận mật khẩu *</InputLabel>
                            <OutlinedInput
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                fullWidth
                                required
                                error={Boolean(formErrors.confirmPassword)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOutlined /> : <VisibilityOffOutlined />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {formErrors.confirmPassword && (
                                <Typography variant="caption" color="error">
                                    {formErrors.confirmPassword}
                                </Typography>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2">
                            Bằng cách Đăng ký, bạn đồng ý với{' '}
                            <Link component={RouterLink} to="#">
                                các điều khoản dịch vụ
                            </Link>{' '}
                            và{' '}
                            <Link component={RouterLink} to="#">
                                bảo mật thông tin
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="primary">
                            Tạo tài khoản
                        </Button>
                    </Grid>
                    {
                        errors &&
                        <Grid item xs={12}>
                            <FormHelperText error>{errors}</FormHelperText>
                        </Grid>
                    }
                </Grid>
            </form>
        </>
    );
}

export default AuthRegister;