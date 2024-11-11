import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  MenuItem,
} from "@mui/material";
import MainCard from "components/MainCard";
import orderServices from "services/orderServices";
import vehicleServices from "services/vehicleServices";
import { useParams } from "react-router-dom";
import orderDetailServices from "services/orderDetailServices";
import boxOptionServices from "services/boxOptionServices";
import deliveryServices from "services/deliveryServices";
import timelineDeliveryServices from "services/timelineDeliveryServices";
import { toast } from "react-toastify";
import branchServices from "services/branchServices";
import orderTimelineServices from "services/orderTimelineServices";
import { translateStatusToVietnamese } from "utils/tools";

const CreateTimeline = () => {
  const { slug } = useParams();

  const [allOrders, setAllOrders] = useState([]);
  const [allOrderDetails, setAllOrderDetails] = useState([]);

  const [packedOrders, setPackedOrders] = useState([]);
  const [selectedOrderToAdd, setSelectedOrderToAdd] = useState(null);
  const [selectedOrderDetailIds, setSelectedOrderDetailIds] = useState([]);
  const [currentOrder, setCurrentOrder] = useState({});
  const [orderDetail, setOrderDetail] = useState([]);
  const [orderDetailsMap, setOrderDetailsMap] = useState({});

  const [orderInTimeline, setOrderInTimeline] = useState([]);
  const [allInfoInOrderInTimeline, setAllInfoInOrderInTimeline] = useState({});
  const [detailIdToOrderInfoMap, setDetailIdToOrderInfoMap] = useState({});
  const [allOrderTimelines, setAllOrderTimelines] = useState([]);

  const [boxOptions, setBoxOptions] = useState([]);

  const [vehicle, setVehicle] = useState({});
  const [timelineDelivery, setTimelineDelivery] = useState({});

  const [branch, setBranch] = useState({});

  const [dialogDetailOpen, setDialogDetailOpen] = useState(false);
  const [dialogAddOpen, setDialogAddOpen] = useState(false);
  const [selectedOrderDetailId, setSelectedOrderDetailId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      await getTimelineDelivery();
      await getOrder();
      await getAllOrders();
      await getAllOrderDetails();
      await getAllOrderTimelines();
    };

    fetchData();
  }, [slug]);

  useEffect(() => {
    if (timelineDelivery.vehicleId) {
      getVehicle();
    }

    if (timelineDelivery.branchId) {
      getBranch();
    }
  }, [timelineDelivery]);

  useEffect(() => {
    if (
      timelineDelivery.id &&
      allOrders.length > 0 &&
      allOrderDetails.length > 0
    ) {
      getOrderInTimeline();
    }
  }, [timelineDelivery, allOrders, allOrderDetails]);

  const getTimelineDelivery = async () => {
    let resOfTimelineDelivery =
      await timelineDeliveryServices.getTimelineDeliveryById(slug);
    if (resOfTimelineDelivery.data.data) {
      setTimelineDelivery(resOfTimelineDelivery.data.data);
    }
  };

  const getOrder = async () => {
    let resOfOrders = await orderServices.getOrder();
    if (resOfOrders) {
      // Set all orders without filtering
      let allOrders = resOfOrders.data.data;
      setPackedOrders(allOrders); // Consider renaming `packedOrders` to `allOrders` if appropriate

      // Retrieve details for each order
      let detailsPromises = allOrders.map((order) => getOrderDetails(order.id));
      await Promise.all(detailsPromises);
    }
  };

  const getOrderDetails = async (orderId) => {
    let resOfOrderDetail = await orderDetailServices.getOrderDetail();
    if (resOfOrderDetail) {
      let orderDetailData = resOfOrderDetail.data.data;
      let matchedOrderDetail = orderDetailData.filter(
        (detail) => detail.orderId === orderId
      );
      setOrderDetail(matchedOrderDetail);
      setOrderDetailsMap((prevDetails) => ({
        ...prevDetails,
        [orderId]: matchedOrderDetail,
      }));

      await Promise.all(
        matchedOrderDetail.map(async (orderDetail) => {
          if (orderDetail.boxOptionId) {
            await getBoxOptions(orderDetail.boxOptionId);
          }
        })
      );
    }
  };

  const getOrderInTimeline = async () => {
    let resOfOrderInTimeline = await deliveryServices.getOrderDetailInTimeline(
      timelineDelivery.id
    );
    if (resOfOrderInTimeline.data.data) {
      setAllInfoInOrderInTimeline(resOfOrderInTimeline.data.data);
      if (resOfOrderInTimeline.data.data.orderDetails) {
        let orderDetailInTimeline = resOfOrderInTimeline.data.data.orderDetails;
        setOrderInTimeline(orderDetailInTimeline);

        let newMapping = {};
        for (let detail of orderDetailInTimeline) {
          let matchedOrderDetail = allOrderDetails.find(
            (orderDetail) => orderDetail.id === detail.detailID
          );
          if (matchedOrderDetail) {
            let matchedOrder = allOrders.find(
              (order) => order.id === matchedOrderDetail.orderId
            );
            if (matchedOrder) {
              newMapping[detail.detailID] = {
                orderId: matchedOrder.id,
                isShipping: matchedOrder.isShipping,
                boxOptionId: matchedOrderDetail.boxOptionId,
                boxOption: {
                  boxName: detail.boxName,
                  volume: detail.volume,
                },
              };
            }
          }
        }
        setDetailIdToOrderInfoMap((prevMap) => ({
          ...prevMap,
          ...newMapping,
        }));
      }
    }
  };

  const getBoxOptions = async (boxOptionId) => {
    let resOfBoxOptions = await boxOptionServices.getBoxOption();
    if (resOfBoxOptions) {
      let boxOptionsData = resOfBoxOptions.data.data;
      let matchedBoxOptions = boxOptionsData.filter(
        (boxOption) => boxOption.boxOptionId === boxOptionId
      );
      setBoxOptions((prevBoxOptions) => [
        ...prevBoxOptions,
        ...matchedBoxOptions,
      ]);
    }
  };

  const getVehicle = async () => {
    let resOfVehicles = await vehicleServices.getVehicle();
    if (resOfVehicles.data.data) {
      let listOfVehicle = resOfVehicles.data.data;
      let matchedVehicle = listOfVehicle.find(
        (vehicle) => vehicle.id === timelineDelivery.vehicleId
      );
      setVehicle(matchedVehicle);
    }
  };

  const getBranch = async () => {
    let resOfBranch = await branchServices.getBranch();
    if (resOfBranch.data.data) {
      let branchData = resOfBranch.data.data;
      let matchedBranch = branchData.find(
        (branch) => branch.id === timelineDelivery.branchId
      );
      setBranch(matchedBranch);
    }
  };

  const getAllOrders = async () => {
    let resOfOrders = await orderServices.getOrder();
    if (resOfOrders.data.data) {
      setAllOrders(resOfOrders.data.data);
    }
  };

  const getAllOrderDetails = async () => {
    let resOfOrderDetails = await orderDetailServices.getOrderDetail();
    if (resOfOrderDetails.data.data) {
      setAllOrderDetails(resOfOrderDetails.data.data);
    }
  };

  const getAllOrderTimelines = async () => {
    let resOfOrderTimeline = await orderTimelineServices.getOrderTimeline();
    if (resOfOrderTimeline.data.data) {
      setAllOrderTimelines(resOfOrderTimeline.data.data);
    }
  };

  const handledialogDetailOpen = (order) => {
    setCurrentOrder(order);
    setDialogDetailOpen(true);
  };

  const handleDialogDetailClose = () => {
    setDialogDetailOpen(false);
    setCurrentOrder(null);
  };

  const handleDialogAddOpen = () => {
    setDialogAddOpen(true);
  };

  const handleDialogAddClose = () => {
    setDialogAddOpen(false);
    setSelectedOrderDetailId(null);
  };

  const handleStatusChange = async (orderId) => {
    const matchedOrder = packedOrders.find((order) => order.id === orderId);
    console.log("Order ID:", orderId);
    console.log("Matched Order:", matchedOrder);

    if (matchedOrder) {
      try {
        await orderServices.updateOrder(orderId, {
          ...matchedOrder,
          isShipping: "Completed",
        });
        toast.success(`Đơn hàng đã được Giao hàng Thành công!!`);
        getOrderInTimeline(); // Refresh the timeline data
      } catch (error) {
        console.error("Failed to update order status:", error);
        toast.error("Failed to update order status.");
      }
    } else {
      console.warn("Order not found:", orderId);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <MainCard sx={{ mt: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Thông tin chuyến vận chuyển
        </Typography>
        {vehicle ? (
          <>
            <Typography>Xe: {vehicle.name}</Typography>
            <Typography>Sức chứa: {vehicle.vehicleVolume} lít</Typography>
          </>
        ) : (
          <Typography>Không tìm thấy thông tin xe</Typography>
        )}
        {timelineDelivery ? (
          <>
            <Typography>
              Thời gian bắt đầu: {timelineDelivery.startDay}
            </Typography>
            <Typography>{`Thời gian kết thúc (dự kiến): ${timelineDelivery.endDay}`}</Typography>
            <Typography>Chuyến: {branch.name}</Typography>
            <Typography>Sức chứa: </Typography>
            <Table sx={{ mt: 2, width: "auto" }}>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>{branch.startPoint}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Sức chứa dự kiến</TableCell>
                  <TableCell>
                    {allInfoInOrderInTimeline.currentVolume} /{" "}
                    {allInfoInOrderInTimeline.maxvolume} lít
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        ) : (
          <Typography>Không tìm thấy thông tin chuyến</Typography>
        )}

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã đơn hàng</TableCell>
                <TableCell>Mã vận đơn</TableCell>
                <TableCell>Mã hộp</TableCell>
                <TableCell>Thể tích hộp</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderInTimeline &&
                orderInTimeline.map((orderItem, index) => {
                  const orderInfo = detailIdToOrderInfoMap[orderItem.detailID];
                  const orderId = orderInfo ? orderInfo.orderId : "N/A";

                  // Determine if this is the first occurrence of the current Order ID
                  const isFirstOccurrence =
                    orderInTimeline.findIndex(
                      (item) =>
                        detailIdToOrderInfoMap[item.detailID]?.orderId ===
                        orderId
                    ) === index;

                  // Calculate row span for each unique order ID
                  const rowSpan = orderInTimeline.filter(
                    (item) =>
                      detailIdToOrderInfoMap[item.detailID]?.orderId === orderId
                  ).length;

                  return (
                    <TableRow key={orderItem.detailID}>
                      {/* Only render the Order ID cell on the first occurrence with rowSpan */}
                      {isFirstOccurrence ? (
                        <TableCell rowSpan={rowSpan}>{orderId}</TableCell>
                      ) : null}

                      <TableCell>{orderItem.detailID}</TableCell>
                      <TableCell>
                        {orderInfo ? orderInfo.boxOptionId : "N/A"}
                      </TableCell>
                      <TableCell>
                        {orderInfo
                          ? `${orderInfo.boxOption.volume} lít`
                          : "N/A"}
                      </TableCell>
                      {isFirstOccurrence ? (
                        <TableCell rowSpan={rowSpan}>
                          {translateStatusToVietnamese(orderInfo?.isShipping || "N/A")}
                        </TableCell>
                      ) : null}

                      {/* Only show the Update Order button on the first occurrence with rowSpan */}
                      {isFirstOccurrence ? (
                        <TableCell rowSpan={rowSpan}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleStatusChange(orderId)}
                            disabled={orderInfo?.isShipping === "Completed"}
                          >
                            Cập nhật Trạng Thái
                          </Button>
                        </TableCell>
                      ) : null}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </Box>
  );
};

export default CreateTimeline;
