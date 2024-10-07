import { useState } from "react";
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
import { jwtDecode } from "jwt-decode";
import authServices from "services/authServices"; // Your login service

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

    try {
      // Call login API and get the response data
      const resOfLogin = await authServices.loginAPI(email, password);

      if (resOfLogin && resOfLogin.token) {
        const token = resOfLogin.token;
        sessionStorage.setItem("sessionToken", token);

        // Decode the JWT token
        if (typeof token === "string") {
          const decodedToken = jwtDecode(token);
          console.log("Decoded JWT:", decodedToken);

          // Optionally store decoded token in sessionStorage
          sessionStorage.setItem("user", JSON.stringify(decodedToken));

          // Redirect to the homepage after login
          navigate("/");
        } else {
          console.log("Token is not a valid string");
          setFormData((prevData) => ({
            ...prevData,
            errors: { submit: "Invalid token format received from server." },
          }));
        }
      } else {
        console.log("Login failed, no token received");
        setFormData((prevData) => ({
          ...prevData,
          errors: {
            submit:
              "Login failed. Please check your credentials and try again.",
          },
        }));
      }
    } catch (error) {
      console.log("Login error:", error);
      setFormData((prevData) => ({
        ...prevData,
        errors: {
          submit: "Login failed. Please check your credentials and try again.",
        },
      }));
    }
  };

  const { email, password, showPassword, errors, touched } = formData;

  return (
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
  );
};

export default AuthLogin;
