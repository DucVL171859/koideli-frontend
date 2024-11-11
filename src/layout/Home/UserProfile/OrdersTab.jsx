import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Pagination,
  Button,
  Modal,
  Chip,
  TextField,
} from "@mui/material";
import orderServices from "services/orderServices";
import orderDetailServices from "services/orderDetailServices";
import boxOptionServices from "services/boxOptionServices";
import koiFishServices from "services/koiFishServices";
import distanceServices from "services/distanceServices";
import feedbackServices from "services/feedbackServices";
import { toast } from "react-toastify";

import {
  getStatusColor,
  translateStatusToVietnamese,
  PriceFormat,
} from "utils/tools";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

// Modal styling
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [existingFeedback, setExistingFeedback] = useState(null); // New state to store existing feedback
  const [feedbackOrderIds, setFeedbackOrderIds] = useState(new Set());
  const [fetchedFeedback, setFetchedFeedback] = useState([]);
  const [feedbackId, setFeedbackId] = useState(null);

  const [orderDetails, setOrderDetails] = useState([]);
  const [boxOptions, setBoxOptions] = useState([]);
  const [koiFish, setKoiFish] = useState([]);
  const [distance, setDistance] = useState({});

  const statusMessages = {
    Pending: "Đơn hàng mới",
    Approved: "Đã xác nhận",
    Packed: "Chờ sắp xếp chuyến",
    Delivering: "Đang vận chuyển",
    Completed: "Đã giao thành công",
    Cancelled: "Giao không thành công",
  };

  const statusColors = {
    Pending: "#fff3e6",
    Approved: "#e6f7ff",
    Packed: "#fff7e6",
    Delivering: "#e6fffa",
    Completed: "#d9f7be",
    Cancelled: "#ffccc7",
  };

  const PColors = {
    Pending: "#fff3e6",
    Approved: "#e6f7ff",
    Packed: "#fff7e6",
    Delivering: "#e6fffa",
    Completed: "#d9f7be",
    Cancelled: "#ffccc7",
  };

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderServices.getOrder();
        if (response?.data?.data) {
          // Sort orders by orderId in descending order
          const sortedOrders = response.data.data.sort((a, b) => b.id - a.id);

          // Set sorted orders to state
          setOrders(sortedOrders);
          setTotalPages(Math.ceil(sortedOrders.length / itemsPerPage));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, [itemsPerPage]);

  // Fetch orders and feedback data for specific user
  useEffect(() => {
    const fetchOrdersAndFeedback = async () => {
      setLoading(true);
      const userId = sessionStorage.getItem("userId"); // Retrieve userId from session storage

      try {
        const ordersResponse = await orderServices.getOrder();
        const feedbackResponse = await feedbackServices.getFeedback();
        console.log(ordersResponse);

        const fetchedOrders = ordersResponse?.data?.data || [];
        console.log(fetchedOrders);

        const feedbackData = feedbackResponse?.data || [];
        setFetchedFeedback(feedbackData);

        // Filter orders by userId
        const userOrders = fetchedOrders.filter(
          (order) => order.userId === parseInt(userId)
        );

        console.log(userOrders);

        // Extract feedback information for the user's orders
        const feedbackOrderDetails = feedbackData
          .filter(
            (feedback) =>
              feedback.desciption &&
              feedback.desciption.trim() !== "" &&
              userOrders.some((order) => order.id === feedback.orderId)
          )
          .map((feedback) => ({
            orderId: feedback.orderId,
            desciption: feedback.desciption,
          }));

        const feedbackOrderIdsSet = new Set(
          feedbackOrderDetails.map((feedback) => feedback.orderId)
        );

        setOrders(userOrders);
        setTotalPages(Math.ceil(userOrders.length / itemsPerPage));
        setFeedbackOrderIds(feedbackOrderIdsSet);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndFeedback();
  }, [itemsPerPage]);

  // Paginate displayed orders in descending order
  useEffect(() => {
    const sortedOrders = [...orders].sort((a, b) => b.id - a.id); // Sort orders in descending order by id
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedOrders(sortedOrders.slice(startIndex, endIndex)); // Set paginated and sorted orders
  }, [page, orders, itemsPerPage]);

  // Fetch order details for modal
  const handleViewOrderDetail = async (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
    await fetchOrderDetails(order.id);
  };

  // Fetch details for a specific order
  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await orderDetailServices.getOrderDetail();
      if (response?.data?.data) {
        const matchedDetails = response.data.data.filter(
          (detail) => detail.orderId === orderId
        );
        setOrderDetails(matchedDetails);

        // Fetch Box Options
        for (const detail of matchedDetails) {
          await fetchBoxOption(detail.boxOptionId);
        }

        // Fetch Distance Info
        if (matchedDetails[0]?.distanceId) {
          await fetchDistance(matchedDetails[0].distanceId);
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const fetchBoxOption = async (boxOptionId) => {
    try {
      const response = await boxOptionServices.getBoxOption();
      if (response?.data?.data) {
        const matchedBoxOption = response.data.data.find(
          (option) => option.boxOptionId === boxOptionId
        );
        if (matchedBoxOption) {
          setBoxOptions((prev) => [...prev, matchedBoxOption]);

          // Fetch related Koi Fish
          if (matchedBoxOption.fishes) {
            for (const fish of matchedBoxOption.fishes) {
              await fetchKoiFish(fish.fishId);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching box options:", error);
    }
  };

  const fetchKoiFish = async (fishId) => {
    try {
      const response = await koiFishServices.getKoiFishById(fishId);
      if (response?.data?.data) {
        setKoiFish((prev) => [...prev, response.data.data]);
      }
    } catch (error) {
      console.error("Error fetching koi fish:", error);
    }
  };

  const fetchDistance = async (distanceId) => {
    try {
      const response = await distanceServices.getDistanceById(distanceId);
      if (response?.data?.data) {
        setDistance(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching distance:", error);
    }
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Close the modal and reset states
  const handleCloseModal = () => {
    setOpenModal(false);
    setOrderDetails([]);
    setBoxOptions([]);
    setKoiFish([]);
  };

  // Calculate total quantity of Koi fish
  const totalQuantity = boxOptions.reduce((total, option) => {
    return total + option.fishes.reduce((sum, fish) => sum + fish.quantity, 0);
  }, 0);

  const renderOrderDetails = (order) => (
    <div className="card-bottom" key={order.id}>
      <div className="card-bottom-item">
        <div className="card-icon">
          <i className="fa-solid fa-calendar-days" />
        </div>
        <div className="card-dt-text">
          <h6>Người Nhận</h6>
          <span>{order.receiverName}</span>
        </div>
      </div>
      <div className="card-bottom-item">
        <div className="card-icon">
          <i className="fa-solid fa-map-marker-alt" />
        </div>
        <div className="card-dt-text">
          <h6>Địa chỉ người nhận</h6>
          <span>{order.receiverAddress}</span>
        </div>
      </div>
      <div className="card-bottom-item">
        <div className="card-icon">
          <i className="fa-solid fa-phone" />
        </div>
        <div className="card-dt-text">
          <h6>SĐT người nhận</h6>
          <span>{order.receiverPhone}</span>
        </div>
      </div>
      <div className="card-bottom-item">
        <div className="card-icon">
          <i className="fa-solid fa-money-bill" />
        </div>
        <div className="card-dt-text">
          <h6>Tổng chi phí Đơn hàng</h6>
          <span>
            <PriceFormat price={order.totalFee} />
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  // Open feedback modal, setting up for create or update
  const handleFeedbackButtonClick = (orderId) => {
    setSelectedOrder(orderId);

    const existingFeedback = fetchedFeedback.find(
      (feedback) => feedback.orderId === orderId
    );

    if (existingFeedback) {
      setFeedbackText(existingFeedback.desciption || ""); // Set existing feedback text
      setFeedbackId(existingFeedback.id); // Store feedbackId for updating
    } else {
      setFeedbackText(""); // Clear if creating new feedback
      setFeedbackId(null); // Reset feedbackId for new feedback creation
    }

    setOpenFeedbackModal(true);
  };

  // Submit feedback (create or update based on existence of feedbackId)
  const handleSubmitFeedback = async () => {
    if (!feedbackText) {
      toast.error("Vui lòng không để trống.");
      return;
    }

    try {
      if (feedbackId) {
        // Update feedback using feedbackId
        await feedbackServices.updateFeedback(feedbackId, {
          desciption: feedbackText,
        });
        toast.success("Phản hồi đã được cập nhật thành công.");
      } else {
        // Create new feedback
        await feedbackServices.createFeedback({
          desciption: feedbackText,
          orderId: selectedOrder,
        });
        toast.success("Phản hồi đã được tạo thành công.");
        setFeedbackOrderIds((prev) => new Set(prev).add(selectedOrder)); // Update feedbackOrderIds with the new order ID
      }

      setOpenFeedbackModal(false);
      setFeedbackText("");
      setFeedbackId(null); // Clear feedbackId after submission
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback.");
    }
  };

  // Close modal
  const handleCloseFeedbackModal = () => {
    setOpenFeedbackModal(false);
    setFeedbackText("");
    setFeedbackId(null);
  };
  return (
    <div
      className="tab-pane fade active show"
      id="feed"
      role="tabpanel"
      aria-labelledby="feed-tab"
    >
      <div className="tab-content mt-4">
        <div
          className="tab-pane fade show active"
          id="Orders"
          role="tabpanel"
          aria-labelledby="orders-tab"
        >
          {displayedOrders.length > 0 ? (
            displayedOrders.map((order) => (
              <div className="main-card mt-4" key={order.id}>
                <div
                  className="card-top p-4"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #e0e0e0",
                    borderRadius: 8,
                  }}
                >
                  {/* Order ID and Status */}
                  <div
                    style={{
                      flex: 1,
                      padding: 16,
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Mã đơn hàng: {order.id}
                    </Typography>

                    <Box display="flex" alignItems="center" mt={1}>
                      <LocalShippingIcon
                        fontSize="small"
                        style={{
                          marginRight: 8,
                          color: getStatusColor(order.isShipping),
                        }}
                      />
                      <Typography
                        variant="body1"
                        style={{
                          color: getStatusColor(order.isShipping),
                          fontWeight: "bold",
                        }}
                      >
                        {translateStatusToVietnamese(order.isShipping)}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mt={1}>
                      {order.isPayment ? (
                        <Chip
                          icon={<CheckCircleIcon style={{ color: "green" }} />}
                          label="Đã thanh toán"
                          style={{
                            backgroundColor: "#e0f7e0", // Light green background
                            color: "green",
                            fontWeight: "bold",
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<CancelIcon style={{ color: "red" }} />}
                          label="Chưa thanh toán"
                          style={{
                            backgroundColor: "#fdecea", // Light red background
                            color: "red",
                            fontWeight: "bold",
                          }}
                        />
                      )}
                    </Box>
                  </div>

                  {/* Button for viewing details */}
                  <Button
                    variant="contained"
                    onClick={() => handleViewOrderDetail(order)}
                    sx={{
                      backgroundColor: "#450b00",
                      color: "white",
                      "&:hover": { backgroundColor: "#ff7f50" },
                    }}
                  >
                    Xem chi tiết
                  </Button>

                  {order.isShipping === "Completed" && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleFeedbackButtonClick(order.id)}
                      sx={{ marginLeft: 2 }}
                    >
                      {feedbackOrderIds.has(order.id)
                        ? "Cập nhật Phản hồi"
                        : "Tạo Phản hồi"}
                    </Button>
                  )}
                </div>

                {/* Order Details Section */}
                <div
                  className="card-bottom p-4"
                  style={{ borderTop: "1px solid #ddd" }}
                >
                  {renderOrderDetails(order)}
                </div>
              </div>
            ))
          ) : (
            <Typography>Chưa có lịch sử đơn hàng.</Typography>
          )}

          <Stack spacing={2} className="pagination-controls mt-3 mb-2">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChangePage}
              variant="outlined"
              shape="rounded"
              className="custom-pagination"
            />
          </Stack>
        </div>
        {/* Modal for Order Details */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={modalStyle} className="modal-content">
            {selectedOrder ? (
              <>
                <Typography variant="h4" gutterBottom>
                  Trạng thái đơn hàng:{" "}
                  {statusMessages[selectedOrder.isShipping] || "Không xác định"}
                </Typography>

                <Box
                  className="order-info-box"
                  sx={{
                    backgroundColor: statusColors[selectedOrder.isShipping],
                    padding: 2,
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h6">Thông tin gửi nhận</Typography>
                  <Paper sx={{ padding: 2, marginTop: 2 }}>
                    <Typography>
                      Người gửi: {selectedOrder.senderName}
                    </Typography>
                    <Typography>
                      Địa chỉ gửi: {selectedOrder.senderAddress}
                    </Typography>
                    <Typography>
                      Người nhận: {selectedOrder.receiverName} /{" "}
                      {selectedOrder.receiverPhone}
                    </Typography>
                    <Typography>
                      Địa chỉ nhận: {selectedOrder.receiverAddress}
                    </Typography>
                  </Paper>
                </Box>

                <Divider sx={{ marginBottom: 2 }} />

                {/* Koi Fish Information */}
                <Box
                  className="koi-info-box"
                  sx={{
                    backgroundColor: statusColors[selectedOrder.isShipping],
                    padding: 2,
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h6">Thông tin cá Koi</Typography>
                  <Typography>Tổng số lượng cá: {totalQuantity}</Typography>

                  {boxOptions.map((option, index) => (
                    <Paper
                      key={index}
                      className="box-option"
                      sx={{
                        padding: 2,
                        marginTop: 2,
                        marginBottom: 2,
                        border: "1px solid #ccc",
                        borderRadius: 1,
                      }}
                    >
                      {/* Box Option Details */}
                      <Box
                        className="box-option-header"
                        sx={{ marginBottom: 2 }}
                      >
                        <Typography variant="h6">
                          Box: {option.boxName}
                        </Typography>
                        <Typography>
                          Thể tích tối đa: {option.maxVolume} lít
                        </Typography>
                        <Typography>
                          Thể tích hiện tại: {option.totalVolume} lít
                        </Typography>
                      </Box>

                      {/* Fish Details */}
                      {option.fishes.map((fish, fishIndex) => {
                        const koi = koiFish.find((k) => k.id === fish.fishId);
                        return (
                          koi && (
                            <Box
                              key={fishIndex}
                              className="fish-item"
                              sx={{
                                marginTop: 2,
                                padding: 2,
                                border: "1px dashed #ddd",
                                borderRadius: 1,
                              }}
                            >
                              <Typography>
                                Cá: {koi.fishDescription} - Kích thước:{" "}
                                {koi.size} cm
                              </Typography>
                              <Typography>Số lượng: {fish.quantity}</Typography>
                            </Box>
                          )
                        );
                      })}
                    </Paper>
                  ))}
                </Box>

                <Divider sx={{ marginBottom: 2 }} />

                {/* Box Option Information */}
                <Box
                  className="box-info-box"
                  sx={{
                    backgroundColor: statusColors[selectedOrder.isShipping],
                    padding: 2,
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h6">Thông tin đóng gói</Typography>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Loại Hộp</TableCell>
                          <TableCell align="right">Chi phí từ Nhật</TableCell>
                          <TableCell align="right">
                            Chi phí trong nước
                          </TableCell>
                          <TableCell align="right">
                            Tổng thể tích cá/hộp
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {boxOptions.map((boxOption) => (
                          <TableRow key={boxOption.boxOptionId}>
                            <TableCell>{boxOption.boxName}</TableCell>
                            <TableCell align="right">
                              {boxOption.price.toLocaleString()} VND
                            </TableCell>
                            <TableCell align="right">
                              {(() => {
                                let localCost = 0;
                                if (boxOption.boxName.includes("Medium")) {
                                  localCost = distance.price + 150000;
                                } else if (
                                  boxOption.boxName.includes("Large")
                                ) {
                                  localCost = distance.price + 350000;
                                }
                                return localCost.toLocaleString();
                              })()}{" "}
                              VND
                            </TableCell>
                            <TableCell align="right">
                              {boxOption.totalVolume}/{boxOption.maxVolume} lít
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>

                <Divider sx={{ marginBottom: 2 }} />

                {/* Cost Information */}
                <Box
                  className="cost-info-box"
                  sx={{
                    backgroundColor: statusColors[selectedOrder.isShipping],
                    padding: 2,
                    borderRadius: 1,
                    marginBottom: 2,
                  }}
                >
                  <Typography variant="h6">Thông tin chi phí</Typography>
                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Loại Chi Phí</TableCell>
                          <TableCell align="right">Giá</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>Tổng chi phí</TableCell>
                          <TableCell align="right">
                            {selectedOrder.totalFee?.toLocaleString()} VND
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            ) : (
              <Typography>No order selected</Typography>
            )}
          </Box>
        </Modal>
        {/* Feedback Modal */}
        <Modal open={openFeedbackModal} onClose={handleCloseFeedbackModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" gutterBottom>
              {feedbackOrderIds.has(selectedOrder)
                ? "Cập nhật Phản hồi"
                : "Tạo Phản hồi"}
            </Typography>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={existingFeedback || "Nhập phản hồi"} // Set placeholder to existing feedback or default
              rows={4}
              style={{ width: "100%", marginTop: "10px" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitFeedback}
              sx={{ mt: 2 }}
            >
              Xác nhận
            </Button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default OrdersPage;
