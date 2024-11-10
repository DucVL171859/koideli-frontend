import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import vehicleServices from "services/vehicleServices";
import branchServices from "services/branchServices";
import deliveryServices from "services/deliveryServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDateTime } from "utils/tools";

const getStatusLabel = (status) => {
  switch (status) {
    case "Pending":
      return "Chưa hoạt động";
    case "Delivering":
      return "Đang hoạt động";
    case "Completed":
      return "Hoàn thành";
    default:
      return "Không xác định";
  }
};

const StatusCircle = ({ status }) => {
  const colorMap = {
    Pending: "#b3b37e",
    Delivering: "#66cbec",
    Completed: "#66ec9e",
  };

  return (
    <Box
      sx={{
        display: "inline-block",
        width: 12,
        height: 12,
        borderRadius: "50%",
        backgroundColor: colorMap[status] || "gray",
        marginRight: 1,
      }}
    />
  );
};

const Timeline = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [existingTimelines, setExistingTimelines] = useState([]);
  const [filteredTimelines, setFilteredTimelines] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedTimelineId, setSelectedTimelineId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await getBranches();
      await getExistingTimelines();
      await getVehicles();
    };
    fetchData();
  }, []);

  const getExistingTimelines = async () => {
    const res = await timelineDeliveryServices.getTimelineDeliveryEnable();
    if (res.data.data) {
      setExistingTimelines(res.data.data);
      setFilteredTimelines(res.data.data);
    }
  };

  const getVehicles = async () => {
    const res = await vehicleServices.getVehicle();
    if (res.data.data) {
      setVehicles(res.data.data);
    }
  };

  const getBranches = async () => {
    const res = await branchServices.getBranch();
    if (res.data.data) {
      setBranches(res.data.data);
    }
  };

  const handleBranchChange = (event) => {
    const selectedBranchId = event.target.value;
    setSelectedBranch(selectedBranchId);

    if (selectedBranchId) {
      const filtered = existingTimelines.filter(
        (timeline) => timeline.branchId === selectedBranchId
      );
      setFilteredTimelines(filtered);
    } else {
      setFilteredTimelines(existingTimelines);
    }
  };

  const handleViewDetail = (slug) => {
    navigate(`/manager/timeline/${slug}/create-order-timeline`);
  };

  const handleOpenUpdateDialog = (timelineId) => {
    setSelectedTimelineId(timelineId);
    setConfirmDialogOpen(true);
  };

  const handleUpdateTimelineStatus = async () => {
    try {
      const res =
        await deliveryServices.updateTimelineStatus(selectedTimelineId);
      if (res) {
        toast.success("Lịch Trình cập nhật thành công!");
        setConfirmDialogOpen(false);
        getExistingTimelines();
      } else {
        toast.error("Failed to update timeline status.");
      }
    } catch (error) {
      console.error("Error updating timeline status:", error);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        Quản lý Lịch trình Vận chuyển
      </Typography>

      <FormControl margin="normal" fullWidth sx={{ maxWidth: 400 }}>
        <InputLabel>Chọn Chuyến Nhỏ</InputLabel>
        <Select value={selectedBranch} onChange={handleBranchChange}>
          <MenuItem value="">Tất cả</MenuItem>
          {branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.startPoint} - {branch.endPoint}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ bgcolor: "#e0f7fa" }}>
            <TableRow>
              <TableCell>Chuyến nhỏ</TableCell>
              <TableCell>Xe</TableCell>
              <TableCell>Dự kiến bắt đầu - kết thúc</TableCell>
              <TableCell>Thời điểm kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTimelines.map((timeline) => {
              const branch =
                branches.find((b) => b.id === timeline.branchId) || {};
              const branchName = `${branch.startPoint} - ${branch.endPoint}`;

              const vehicle =
                vehicles.find((v) => v.id === timeline.vehicleId) || {};
              const vehicleName = vehicle.name || "Không xác định";

              return (
                <TableRow key={timeline.id}>
                  <TableCell>
                    <Typography variant="body1" fontWeight="bold" color="textSecondary">
                      {branchName}
                    </Typography>
                  </TableCell>
                  <TableCell>{vehicleName}</TableCell>
                  <TableCell>
                    {formatDateTime(timeline.startDay)} - {formatDateTime(timeline.endDay)}
                  </TableCell>
                  <TableCell>
                    {timeline.timeCompleted
                      ? formatDateTime(timeline.timeCompleted)
                      : "Chưa hoàn thành"}
                  </TableCell>
                  <TableCell>
                    <StatusCircle status={timeline.isCompleted} />
                    {getStatusLabel(timeline.isCompleted)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleViewDetail(timeline.id)}
                      >
                        Xem Chi Tiết
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleOpenUpdateDialog(timeline.id)}
                      >
                        Cập nhật
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Xác nhận cập nhật</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn cập nhật trạng thái của lịch trình này?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleUpdateTimelineStatus}
            color="error"
            variant="contained"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Timeline;
