import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "api/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Avatar,
  Stack,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
  Grid,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { toast } from "react-toastify";
import "pages/css/style.css";
import userService from "services/userServices";

const AboutTab = ({ setProfile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", 
    phoneNumber: "",
    roleId: "",
    gender: "",
    confirmationToken: "",
    isConfirmed: true,
    orderId: 0,
    urlAvatar: "",
    address: "", // New address field
  });
  const [originalData, setOriginalData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingButton, setLoadingButton] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();

  const successToastId = "success-toast";
  const errorToastId = "error-toast";

  // Fetch user data from API on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfileAPI();
        const profileData = response.data;

        if (profileData) {
          setFormData({
            name: profileData.name,
            email: profileData.email,
            password: profileData.password,
            phoneNumber: profileData.phoneNumber,
            roleId: profileData.role.roleId,
            gender: profileData.gender,
            confirmationToken: profileData.confirmationToken,
            isConfirmed: profileData.isConfirmed,
            orderId: profileData.orderId,
            urlAvatar: profileData.urlAvatar || "",
            address: profileData.address || "", // Set initial address
          });
          setOriginalData(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Không thể tải thông tin tài khoản. Vui lòng thử lại sau.", {
          toastId: errorToastId,
        });
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
    setHasChanges(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          urlAvatar: e.target.result,
        }));
      };
      reader.readAsDataURL(file);
      setHasChanges(true);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoadingButton(true);

    try {
      let imageUrl = formData.urlAvatar;

      // If a new avatar image is selected, upload it
      if (selectedFile) {
        const storageRef = ref(storage, `user-avt/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      // Build the updated profile object, only sending modified fields
      const updatedProfile = {
        name: formData.name !== originalData.name ? formData.name : originalData.name,
        email: formData.email,
        password: formData.password, 
        phoneNumber: formData.phoneNumber !== originalData.phoneNumber ? formData.phoneNumber : originalData.phoneNumber,
        roleId: formData.roleId,
        gender: formData.gender !== originalData.gender ? formData.gender : originalData.gender,
        confirmationToken: formData.confirmationToken,
        isConfirmed: formData.isConfirmed,
        orderId: formData.orderId,
        urlAvatar: imageUrl !== originalData.urlAvatar ? imageUrl : originalData.urlAvatar,
        address: formData.address !== originalData.address ? formData.address : originalData.address, // Update address
      };

      // Retrieve the user id from sessionStorage
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        throw new Error("User ID not found in sessionStorage");
      }

      // Pass the id from sessionStorage along with the profile data
      await userService.updateUser(userId, updatedProfile);
      setProfile(updatedProfile);
      setHasChanges(false);
      toast.success("Tài khoản đã được cập nhật thành công!", {
        toastId: successToastId,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Cập nhật tài khoản thất bại. Vui lòng thử lại sau", {
        toastId: errorToastId,
      });
    } finally {
      setLoadingButton(false);
    }
  };

  return (
    <div className="tab-pane fade show active" id="about" role="tabpanel" aria-labelledby="about-tab">
      <div className="main-card mt-4">
        <Container component="main" maxWidth="sm">
          <Typography component="h1" variant="h5" align="center" marginTop={4}>
            <strong>THÔNG TIN TÀI KHOẢN</strong>
          </Typography>
          <form onSubmit={handleUpdateProfile}>
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Họ Tên"
              name="name"
              value={formData.name}
              placeholder="Nhập họ tên"
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Số Điện Thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              placeholder={formData.phoneNumber || "Nhập số điện thoại"}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Email"
              name="email"
              value={formData.email}
              disabled
              required
            />
            <TextField
              fullWidth
              margin="normal"
              variant="outlined"
              label="Địa chỉ"
              name="address"
              value={formData.address}
              placeholder="Nhập địa chỉ"
              onChange={handleChange}
            />
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
                >
                  <MenuItem value="">Chọn giới tính</MenuItem>
                  <MenuItem value="Male">Nam</MenuItem>
                  <MenuItem value="Female">Nữ</MenuItem>
                  <MenuItem value="Other">Khác</MenuItem>
                </Select>
              </Stack>
            </Grid>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button
                variant="contained"
                component="span"
                fullWidth
                style={{ height: "30px" }}
                sx={{
                  mt: 5,
                  backgroundColor: "#450b00",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#ff7f50",
                  },
                }}
              >
                CẬP NHẬT AVATAR
              </Button>
            </label>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              marginTop={2}
            >
              <Avatar
                alt="Avatar Preview"
                src={formData.urlAvatar}
                sx={{ width: 100, height: 100 }}
              />
            </Stack>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{
                marginTop: 3,
                marginBottom: 4,
                backgroundColor: "#450b00",
                color: "white",
                "&:hover": {
                  backgroundColor: "#ff7f50",
                },
              }}
              disabled={!hasChanges || loadingButton}
            >
              {loadingButton ? <CircularProgress size={24} /> : "CẬP NHẬT TÀI KHOẢN"}
            </Button>
          </form>
        </Container>
      </div>
    </div>
  );
};

export default AboutTab;
