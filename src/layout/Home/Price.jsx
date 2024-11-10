import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import { LocalShipping, AttachMoney } from "@mui/icons-material";
import distanceServices from "services/distanceServices";
import boxServices from "services/boxServices";
import { PriceFormat } from "utils/tools";

const DistancePrice = () => {
  const [distances, setDistances] = useState([]);
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistances = async () => {
      try {
        const response = await distanceServices.getDistance();
        const sortedDistances = (response?.data || []).sort(
          (a, b) => a.rangeDistance - b.rangeDistance
        );
        setDistances(sortedDistances);
      } catch (error) {
        console.error("Error fetching distance data:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchBoxes = async () => {
      try {
        const response = await boxServices.getBox();
        setBoxes(response?.data || []);
      } catch (error) {
        console.error("Error fetching box data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistances();
    fetchBoxes();
  }, []);

  return (
    <Box
      sx={{ width: "100%", padding: 4, bgcolor: "#f0f4f8", borderRadius: 2 }}
    >
      {/* Distance Pricing Section */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h3" gutterBottom>
              <strong>ĐƠN GIÁ KHOẢNG CÁCH VẬN CHUYỂN NỘI ĐỊA</strong>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Tham khảo bảng giá vận chuyển dựa trên khoảng cách để dự toán chi
              phí một cách minh bạch.
            </Typography>
          </Box>

          <Box display="flex" justifyContent="center" mb={3}>
            <LocalShipping fontSize="large" color="primary" />
            <Typography variant="h5" sx={{ ml: 1 }}>
              Bảng Giá Dịch Vụ Vận Chuyển
            </Typography>
          </Box>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ maxWidth: 800, mx: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#e3f2fd" }}>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Khoảng cách (km)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Giá tiền
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {distances.map((distance) => (
                    <TableRow
                      key={distance.id}
                      sx={{ "&:nth-of-type(odd)": { bgcolor: "#fafafa" } }}
                    >
                      <TableCell>Dưới {distance.rangeDistance} km</TableCell>
                      <TableCell>
                        <Typography display="flex" alignItems="center">
                          <PriceFormat price={distance.price} />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              * Giá trên chỉ áp dụng cho khoảng cách tiêu chuẩn. Vui lòng liên
              hệ để nhận báo giá cho hợp đồng dài hạn.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Divider variant="middle" sx={{ mb: 4 }} />

      {/* Box Pricing Section */}
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography variant="h3" gutterBottom>
              <strong>BẢNG GIÁ HỘP VẬN CHUYỂN CÁ KOI</strong>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Chọn lựa hộp vận chuyển phù hợp cho cá Koi của bạn với mức giá tối
              ưu nhất.
            </Typography>
          </Box>

          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              sx={{ maxWidth: 800, mx: "auto" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#e8f5e9" }}>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        ID
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Tên Hộp
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Thể Tích Tối Đa (Lít)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Đơn giá
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {boxes.map((box) => (
                    <TableRow
                      key={box.id}
                      sx={{ "&:nth-of-type(odd)": { bgcolor: "#f1f8e9" } }}
                    >
                      <TableCell>{box.id}</TableCell>
                      <TableCell>{box.name}</TableCell>
                      <TableCell>{box.maxVolume} L</TableCell>
                      <TableCell>
                        <Typography display="flex" alignItems="center">
                          <PriceFormat price={box.price} />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          <Box mt={3} textAlign="center">
          <Typography variant="body2" color="textSecondary">
              * Giá hộp từ Nhật Bản (JP) đã bao gồm Giá hộp Và Phí vận chuyển Hàng Không từ Nhật Bản về Việt Nam (Cảng Hàng Không Quốc Tế Tân Sơn Nhất - HCM)
            </Typography>
            <Typography variant="body2" color="textSecondary">
              * Giá hộp có thể thay đổi theo nhu cầu và số lượng đặt hàng. Vui
              lòng liên hệ để nhận tư vấn chi tiết.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DistancePrice;
