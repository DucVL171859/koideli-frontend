import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { changePasswordAPI } from "../../components/services/userServices";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "pages/css/style.css";


const SettingTab = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Không được để trống các trường Mật khẩu.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Mật khẩu mới đã nhập không khớp!");
      return;
    }

    try {
      await changePasswordAPI(currentPassword, newPassword);
      toast.success("Mật khẩu đã thay đổi thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        navigate(window.location.reload());
      }, 2000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Mật khẩu hiện tại không đúng");
      } else {
        console.error("Error changing password:", error);
        toast.error("Failed to change password.");
      }
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div
      className="tab-pane fade show active"
      id="setting"
      role="tabpanel"
      aria-labelledby="setting-tab"
    >
      <div className="main-card mt-4 p-0">
        <Container component="main" maxWidth="sm">
          <Box mt={4}>
            <Typography component="h1" variant="h5" align="center">
              <strong>Cài đặt Mật khẩu</strong>
            </Typography>
            <Typography variant="body1" align="center" mt={2}>
              Bạn có thể đổi mật khẩu của mình từ đây. Nếu bạn không nhớ được
              mật khẩu hiện tại, chỉ cần Đăng xuất và bấm vào Quên mật khẩu.
            </Typography>
            <Box component="form" onSubmit={handleChangePassword} mt={4}>
              <TextField
                fullWidth
                variant="outlined"
                label="Mật khẩu hiện tại"
                type={passwordVisible.current ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("current")}
                        edge="end"
                      >
                        {passwordVisible.current ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                margin="normal"
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Mật khẩu mới"
                type={passwordVisible.new ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("new")}
                        edge="end"
                      >
                        {passwordVisible.new ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                margin="normal"
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Xác nhận Mật khẩu mới"
                type={passwordVisible.confirm ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("confirm")}
                        edge="end"
                      >
                        {passwordVisible.confirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                margin="normal"
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#450b00",
                  "&:hover": {
                    backgroundColor: "#ff7f50",
                  },
                }}
              >
                <strong>ĐỔI MẬT KHẨU</strong>
              </Button>
            </Box>
          </Box>
        </Container>
      </div>
    </div>
  );
};

export default SettingTab;
