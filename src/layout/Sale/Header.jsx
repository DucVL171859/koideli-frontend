import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import logo from "assets/images/koideli-logo.png";
import { ArrowDropDownOutlined } from "@mui/icons-material";
import authServices from "services/authServices";
import { useNavigate } from "react-router-dom";

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const Header = ({ onToggleDrawer }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    authServices.logout();
    navigate('/');
  };

  return (
    <AppBarStyled position="fixed" sx={{ bgcolor: "#FFF", boxShadow: "unset" }}>
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          onClick={onToggleDrawer}
          edge="start"
          sx={{ color: "#000" }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          <a href="/sale/welcome">
            <img
              src={logo}
              alt="koideli"
              style={{ width: "60px", height: "60px" }}
            />
          </a>
        </Typography>
        <Button
          aria-controls="account-menu"
          aria-haspopup="true"
          onClick={handleMenuClick}
          sx={{ color: "#000" }}
        >
          Người dùng <ArrowDropDownOutlined />
        </Button>
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Đăng xuất</MenuItem>
        </Menu>
      </Toolbar>
    </AppBarStyled>
  );
};

export default Header;
