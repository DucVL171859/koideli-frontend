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
  let color;
  switch (status) {
    case "Pending":
      color = "#b3b37e";
      break;
    case "Delivering":
      color = "#66cbec";
      break;
    case "Completed":
      color = "#66ec9e";
      break;
    default:
      color = "gray";
  }

  return (
    <span
      style={{
        display: "inline-block",
        width: "12px",
        height: "12px",
        borderRadius: "50%",
        backgroundColor: color,
        marginRight: "5px",
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
    let res = await timelineDeliveryServices.getTimelineDeliveryEnable();
    if (res.data.data) {
      setExistingTimelines(res.data.data);
      setFilteredTimelines(res.data.data);
    }
  };

  const getVehicles = async () => {
    let res = await vehicleServices.getVehicle();
    if (res.data.data) {
      setVehicles(res.data.data);
    }
  };

  const getBranches = async () => {
    let res = await branchServices.getBranch();
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
      const res = await deliveryServices.updateTimelineStatus(selectedTimelineId);
      if (res) {
        toast.success("Timeline status updated successfully!");
        setConfirmDialogOpen(false);
        getExistingTimelines(); // Refresh timelines after updating
      } else {
        toast.error("Failed to update timeline status.");
      }
    } catch (error) {
      console.error("Error updating timeline status:", error);
    }
  };

  return (
    <div>
      <Typography variant="h3" alignItems-center gutterBottom>
        Quản lý Lịch trình Vận chuyển
      </Typography>
      
      <FormControl margin="normal" sx={{ width: "300px" }}>
        <InputLabel id="branch-select-label">Chọn Chuyến Nhỏ</InputLabel>
        <Select
          labelId="branch-select-label"
          value={selectedBranch}
          onChange={handleBranchChange}
        >
          <MenuItem value="">Tất cả</MenuItem>
          {branches.map((branch) => (
            <MenuItem key={branch.id} value={branch.id}>
              {branch.startPoint} - {branch.endPoint}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Xe</TableCell>
              <TableCell>Các chuyến nhỏ</TableCell>
              <TableCell>Dự kiến bắt đầu - kết thúc</TableCell>
              <TableCell>Thời điểm kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTimelines.map((timeline, index) => {
              const vehicle = vehicles.find((v) => v.id === timeline.vehicleId) || {};
              const vehicleName = vehicle.name || "Không xác định";

              // Count how many times the vehicle appears
              const vehicleOccurrences = filteredTimelines.filter(
                (t) => t.vehicleId === timeline.vehicleId
              ).length;

              // Determine if this is the first occurrence of the vehicle
              const isFirstOccurrence =
                filteredTimelines.findIndex(
                  (t) => t.vehicleId === timeline.vehicleId
                ) === index;

              return (
                <TableRow key={timeline.id}>
                  {/* Render Vehicle name with rowspan on the first occurrence */}
                  {isFirstOccurrence ? (
                    <TableCell rowSpan={vehicleOccurrences}>
                      {vehicleName}
                    </TableCell>
                  ) : null}
                  <TableCell>
                    {
                      branches.find(
                        (branch) => branch.id === timeline.branchId
                      )?.name
                    }
                  </TableCell>
                  <TableCell>
                    {formatDateTime(timeline.startDay)} -{" "}
                    {formatDateTime(timeline.endDay)}
                  </TableCell>
                  <TableCell>
                    {timeline.timeCompleted ? formatDateTime(timeline.timeCompleted) : "Chưa hoàn thành"}
                  </TableCell>

                  <TableCell>
                    <StatusCircle status={timeline.isCompleted} />
                    {getStatusLabel(timeline.isCompleted)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewDetail(timeline.id)}
                      sx={{ mr: 1 }}
                    >
                      Xem Chi Tiết
                    </Button>
                    <Button
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
                      onClick={() => handleOpenUpdateDialog(timeline.id)}
                    >
                      Cập nhật Trạng thái
                    </Button>
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
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Hủy
          </Button>
          <Button
            sx={{
              color: "#ffffff",
              fontWeight: 700,
              bgcolor: "#f54242",
              "&:hover": {
                bgcolor: "#f57842",
                color: "#ffffff",
              },
            }}
            onClick={handleUpdateTimelineStatus}
            color="primary"
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Timeline;
