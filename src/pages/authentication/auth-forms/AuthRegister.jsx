import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Button,
  FormHelperText,
  Grid,
  Link,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  MenuItem,
  Select,
} from '@mui/material';
import { VisibilityOutlined, VisibilityOffOutlined } from '@mui/icons-material';
import authServices from 'services/authServices'; // Your register service

const AuthRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    gender: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation (add as needed)

    // Ensure passwords match
    if (formData.password !== formData.confirmPassword) {
      setFormErrors({ confirmPassword: 'Mật khẩu không khớp' });
      return;
    }

    // Prepare request body
    const registerData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
    };

    try {
      // Call register API
      await authServices.register(registerData);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      console.error('Registration error:', error);
      setErrors('Registration failed. Please try again.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Full Name */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="name">Họ và tên *</InputLabel>
              <OutlinedInput
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(formErrors.name)}
              />
              {formErrors.name && (
                <Typography variant="caption" color="error">
                  {formErrors.name}
                </Typography>
              )}
            </Stack>
          </Grid>

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          {/* Phone Number */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="phoneNumber">Số điện thoại *</InputLabel>
              <OutlinedInput
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(formErrors.phoneNumber)}
              />
              {formErrors.phoneNumber && (
                <Typography variant="caption" color="error">
                  {formErrors.phoneNumber}
                </Typography>
              )}
            </Stack>
          </Grid>

          {/* Gender */}
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="gender">Giới tính *</InputLabel>
              <Select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                fullWidth
                required
                error={Boolean(formErrors.gender)}
              >
                <MenuItem value="">Chọn giới tính</MenuItem>
                <MenuItem value="male">Nam</MenuItem>
                <MenuItem value="female">Nữ</MenuItem>
                <MenuItem value="other">Khác</MenuItem>
              </Select>
              {formErrors.gender && (
                <Typography variant="caption" color="error">
                  {formErrors.gender}
                </Typography>
              )}
            </Stack>
          </Grid>

          {/* Terms and conditions */}
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

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button disableElevation fullWidth size="large" type="submit" variant="contained" color="primary">
              Tạo tài khoản
            </Button>
          </Grid>

          {/* Error messages */}
          {errors && (
            <Grid item xs={12}>
              <FormHelperText error>{errors}</FormHelperText>
            </Grid>
          )}
        </Grid>
      </form>
    </>
  );
};

export default AuthRegister;
