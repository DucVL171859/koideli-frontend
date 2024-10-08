import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import Logo from "components/logo/LogoMain"; // Assuming this is your logo component
import { useNavigate } from "react-router-dom";
import authServices from "services/authServices";

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
  const [user, setUser] = useState(null); // Store user data, including avatar
  const [anchorEl, setAnchorEl] = useState(null); // Anchor element for the dropdown menu
  const navigate = useNavigate();

  // Check if user is logged in by looking for a token (or other flag) in sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Check for the token
    const userRole = sessionStorage.getItem("role"); // Retrieve stored user data
    if (token && userRole) {
      setIsLoggedIn(true);
      setUser(userRole); // Parse and set user data from session storage
    }
  }, []);

  const handleLogout = () => {
    authServices.logout();
    setIsLoggedIn(false); // Update the login state
    setAnchorEl(null); // Close the menu
    navigate("/"); // Optionally redirect to home or login page
  };

  // Handle opening the dropdown menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the dropdown menu
  const handleClose = () => {
    setAnchorEl(null);
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
              {user && (
                <>
                  <Avatar
                    // alt={user.name} // Display user name as alt text
                    src={
                      user.avatarUrl ||
                      "https://firebasestorage.googleapis.com/v0/b/koideli.appspot.com/o/user-avt%2F819RNP-RSJL._SL1500_.jpg?alt=media&token=caedd232-d225-488a-bb75-9e3378b7af0d"
                    }
                    sx={{
                      bgcolor: "#7d6e48",
                      marginLeft: 2,
                      cursor: "pointer",
                    }}
                    onClick={handleMenu} // Open the menu on click
                  >
                    {!user.avatarUrl && user.name
                      ? user.name[0].toUpperCase()
                      : null}
                    {/* Show the first initial of the name if no avatar is available */}
                  </Avatar>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <MenuItem onClick={() => navigate("/profile")}>
                      Hồ sơ cá nhân
                    </MenuItem>
                    <MenuItem onClick={() => navigate("/orders")}>
                      Đơn hàng của tôi
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                  </Menu>
                </>
              )}
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
