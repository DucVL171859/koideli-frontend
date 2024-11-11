import React from "react";
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import MainCard from "components/MainCard";
import { useNavigate } from "react-router-dom";

const DeliveryPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 3 }}>
      <MainCard title="Trang Tổng Quan Nhân Viên Giao Hàng">
        <Typography variant="body2" sx={{ mb: 2 }}>
          Chào mừng bạn đến với Dịch Vụ Giao Cá Koi. Tại đây, bạn có thể quản lý
          các đơn hàng giao và theo dõi tiến độ của mình.
        </Typography>

        <Grid container spacing={3}>
          {/* Đơn Hàng Đang Giao */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Đơn Hàng Đang Giao
                </Typography>
                <Typography variant="body2">
                  Bạn có <strong>3</strong> lịch trình. Nhấn vào bên dưới để xem
                  chi tiết.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/delivery/delivery-update")}
                >
                  Xem Lịch trình
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Đơn Hàng Đã Hoàn Thành */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Đơn Hàng Đã Hoàn Thành
                </Typography>
                <Typography variant="body2">
                  Làm tốt lắm! Bạn đã hoàn thành <strong>12</strong> đơn hàng
                  trong tuần này.
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/delivery/delivery-update-order")}
                >
                  Xem Lịch Sử
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Hồ Sơ & Cài Đặt */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Hồ Sơ & Cài Đặt
                </Typography>
                <Typography variant="body2">
                  Cập nhật thông tin hồ sơ, chi tiết liên lạc hoặc quản lý cài
                  đặt thông báo của bạn.
                </Typography>
                <Button variant="outlined" color="primary" sx={{ mt: 2 }}>
                  Đến Hồ Sơ
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Trợ Giúp & Hỗ Trợ */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Trợ Giúp & Hỗ Trợ
                </Typography>
                <Typography variant="body2">
                  Cần hỗ trợ? Liên hệ với đội ngũ hỗ trợ để được giúp đỡ về giao
                  hàng hoặc các vấn đề ứng dụng.
                </Typography>
                <Button variant="outlined" color="secondary" sx={{ mt: 2 }}>
                  Liên Hệ Hỗ Trợ
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </MainCard>
    </Box>
  );
};

export default DeliveryPage;
