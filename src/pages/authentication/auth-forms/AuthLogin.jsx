import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Grid,
  InputAdornment,
  IconButton,
  OutlinedInput,
  FormHelperText,
  Stack,
  InputLabel,
} from "@mui/material";
import { VisibilityOutlined, VisibilityOffOutlined } from "@mui/icons-material";
import authServices from "services/authServices"; // Your login service
import userService from "services/userServices"; // Import the default export object

import { toast } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const AuthLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
    errors: {},
    touched: {},
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      touched: { ...prevData.touched, [name]: true },
    }));
  };

  const handleClickShowPassword = () => {
    setFormData((prevData) => ({
      ...prevData,
      showPassword: !prevData.showPassword,
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { email, password } = formData;

    if (!email || !password) {
      setFormData((prevData) => ({
        ...prevData,
        errors: {
          email: !email ? "Email is required" : "",
          password: !password ? "Password is required" : "",
          submit: "Please fill in both fields.",
        },
      }));
      return;
    }

    try {
      // Call login API and get the response data
      const resOfLogin = await authServices.loginAPI(email, password);

      if (resOfLogin && resOfLogin.token) {
        const token = resOfLogin.token;
        sessionStorage.setItem("token", token);

        // Now fetch the user profile using getProfileAPI
        try {
          const profileResponse = await userService.getProfileAPI();

          if (profileResponse.success) {
            const profileData = profileResponse.data;

            // Extract relevant data like userId, role, etc.
            const id = profileData.id;
            const role = profileData.role.roleName; // Assuming 'roleName' holds the user's role

            // Store user data and role in sessionStorage
            sessionStorage.setItem("userId", id);
            sessionStorage.setItem("role", role);

            // Show success toast
            toast.success("Login successful!");

            // Redirect based on the user's role
            switch (role) {
              case "User":
                navigate("/");
                break;
              case "Sales Staff":
                navigate("/sale/welcome");
                break;
              case "Delivery Staff":
                navigate("/delivery");
                break;
              case "Manager":
                navigate("/manager/welcome");
                break;
              case "Admin":
                navigate("/admin/dashboard");
                break;
              default:
                console.log("Role not recognized");
                break;
            }
          } else {
            toast.error("Failed to retrieve user profile.");
          }
        } catch (error) {
          console.error("Error fetching profile data:", error);
          toast.error("Failed to retrieve user profile.");
        }
      } else {
        setFormData((prevData) => ({
          ...prevData,
          errors: {
            submit:
              "Login failed. Please check your credentials and try again.",
          },
        }));
        // Show error toast
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFormData((prevData) => ({
        ...prevData,
        errors: {
          submit: "Login failed. Please check your credentials and try again.",
        },
      }));
      // Show error toast
      toast.error("Login failed due to a server error.");
    }
  };

  const { email, password, showPassword, errors, touched } = formData;

  return (
    <>
      <form noValidate onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email-login">Email</InputLabel>
              <OutlinedInput
                id="email-login"
                type="text"
                value={email}
                name="email"
                onChange={handleChange}
                placeholder="Nhập Email của bạn"
                fullWidth
                error={Boolean(touched.email && errors.email)}
              />
              {touched.email && errors.email && (
                <FormHelperText error>{errors.email}</FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-login">Mật Khẩu</InputLabel>
              <OutlinedInput
                fullWidth
                id="password-login"
                type={showPassword ? "text" : "password"}
                value={password}
                name="password"
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOutlined />
                      ) : (
                        <VisibilityOffOutlined />
                      )}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder="Nhập Mật Khẩu"
                error={Boolean(touched.password && errors.password)}
              />
              {touched.password && errors.password && (
                <FormHelperText error>{errors.password}</FormHelperText>
              )}
            </Stack>
          </Grid>

          {errors.submit && (
            <Grid item xs={12}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              ĐĂNG NHẬP
            </Button>
          </Grid>
        </Grid>
      </form>

      
    </>
  );
};

export default AuthLogin;
