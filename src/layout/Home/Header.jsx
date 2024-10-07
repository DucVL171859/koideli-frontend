import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Logo from "components/logo/LogoMain"; // Assuming this is your logo component

const RightSection = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
}));

const NavButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in by looking for a token (or other flag) in localStorage
  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Replace with your auth logic
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Remove the auth token
    setIsLoggedIn(false); // Update the login state
    // Optionally redirect to home or login page
  };

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "#FFF",
        boxShadow: "unset",
        p: 0,
        m: 0,
        boxSizing: "unset",
      }}
    >
      <Toolbar>
        <Logo />
        <RightSection>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }}>
            DỊCH VỤ
          </NavButton>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }}>BLOG</NavButton>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }}>
            BẢNG GIÁ
          </NavButton>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }}>
            VỀ CHÚNG TÔI
          </NavButton>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }}>
            LIÊN HỆ
          </NavButton>

          {isLoggedIn ? (
            <>
              <NavButton
                sx={{ color: "#7d6e48", fontWeight: 700 }}
                href="/profile"
              >
                PROFILE
              </NavButton>
              <NavButton
                variant="contained"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  bgcolor: "#f54242",
                  "&:hover": {
                    bgcolor: "#f57842",
                    color: "#ffffff",
                  },
                }}
                onClick={handleLogout}
              >
                LOGOUT
              </NavButton>
            </>
          ) : (
            <NavButton
              variant="contained"
              href="/login"
              sx={{
                color: "#ffffff",
                fontWeight: 700,
                bgcolor: "#f54242",
                "&:hover": {
                  bgcolor: "#f57842",
                  color: "#ffffff",
                },
              }}
            >
              ĐĂNG NHẬP
            </NavButton>
          )}
        </RightSection>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
