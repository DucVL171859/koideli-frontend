import Logo from "components/logo/LogoMain"; // Assuming this is your logo component
import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import authServices from "services/authServices";
import userService from "services/userServices"; // Assuming getProfileAPI exists

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

  // Fetch user profile if a token exists in sessionStorage
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      // Fetch user profile if token exists
      const fetchUserProfile = async () => {
        try {
          const profileData = await userService.getProfileAPI(token);
          if (profileData.success) {
            const userProfile = profileData.data;
            setUser(userProfile); // Set user data
            setIsLoggedIn(true);  // Mark user as logged in
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setIsLoggedIn(false); // Set logged-out state if fetching fails
        }
      };
      fetchUserProfile();
    }
  }, []);

  const handleLogout = () => {
    authServices.logout(); // Clear session data
    sessionStorage.clear(); // Clear sessionStorage (token and user data)
    setIsLoggedIn(false); // Reset logged-in state
    setUser(null); // Clear user data
    setAnchorEl(null); // Close the menu
    navigate("/login"); // Redirect to login page
  };

  const handleClickLogo = () => {
    navigate("/");
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
        <Logo onClick={handleClickLogo} />

        <RightSection>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }} onClick={() => navigate("/services")}>
            DỊCH VỤ
          </NavButton>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }} onClick={() => navigate("/blog")}>
            BLOG
          </NavButton>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }} onClick={() => navigate("/pricing")}>
            BẢNG GIÁ
          </NavButton>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }} onClick={() => navigate("/about-us")}>
            VỀ CHÚNG TÔI
          </NavButton>
          <NavButton sx={{ color: "#7d6e48", fontWeight: 600 }} onClick={() => navigate("/contact")}>
            LIÊN HỆ
          </NavButton>

          {isLoggedIn && user ? (
            <>
              <Avatar
                alt={user.name || "User Avatar"}
                src={
                  user.urlAvatar || "https://firebasestorage.googleapis.com/v0/b/koideli.appspot.com/o/user-avt%2Fdefault_avatar.jpg?alt=media"
                }
                sx={{
                  bgcolor: "#7d6e48",
                  marginLeft: 2,
                  cursor: "pointer",
                }}
                onClick={handleMenu} // Open the menu on click
              >
                {!user.urlAvatar && user.name ? user.name[0].toUpperCase() : null}
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
                <MenuItem onClick={() => navigate("/user-profile")}>
                  Hồ sơ cá nhân
                </MenuItem>
                <MenuItem onClick={() => navigate("/orders")}>
                  Đơn hàng của tôi
                </MenuItem>
                <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <NavButton
              variant="contained"
              onClick={() => navigate("/login")}
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
