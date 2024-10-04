import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
} from "@mui/material";
import MainCard from "components/MainCard";
import { useNavigate } from "react-router-dom";

const newDelivery = [
  {
    id: 1,
    senderName: "Delivery Staff",
    senderPhone: "123-456-7890",
    receiverName: "Mr A",
    receiverPhone: "098-765-4321",
    address: "123 Pond Lane, Fishville",
    quantity: 10,
    status: "Destination",
  },
  {
    id: 2,
    senderName: "Delivery Staff",
    senderPhone: "234-567-8901",
    receiverName: "Mr B",
    receiverPhone: "345-678-9012",
    address: "456 Waterway Ave, Aquatown",
    quantity: 5,
    status: "Destination",
  },
];

const ordersInProcess = [
  {
    id: 1,
    senderName: "Delivery Staff",
    senderPhone: "123-456-7890",
    receiverName: "Hoang Anh",
    receiverPhone: "098-765-4321",
    address: "Nha van hoa sinh vien, Binh Duong",
    quantity: 7,
    status: "Delivered",
  },
  {
    id: 2,
    senderName: "Delivery Staff",
    senderPhone: "234-567-8901",
    receiverName: "Tran Tam",
    receiverPhone: "345-678-9012",
    address: "Vinhome GrandPark Quan 9",
    quantity: 3,
    status: "Delivered",
  },
];

const NewDelivery = () => {
  const navigate = useNavigate();
  const handleExecuteOrder = () => {
    navigate("/delivery/delivery-tracking");
  };

  const handleUpdateOrder = () => {
    navigate("/delivery/delivery-update");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Received ":
        return "#00d8ff";
      case "Destination ":
        return "#bfbf2d";
      case "Delivered":
        return "#5ccb26";
      default:
        return "gray";
    }
  };

  return (
    <>
      <MainCard title="Delivery Destination">
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#272242" }}>
              <TableRow>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Sender
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Receiver
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Delivery Address
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {newDelivery.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{`${order.senderName} / ${order.senderPhone}`}</TableCell>
                  <TableCell>{`${order.receiverName} / ${order.receiverPhone}`}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          bgcolor: getStatusColor(order.status),
                          marginRight: "8px",
                        }}
                      />
                      {order.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleExecuteOrder(order.id)}
                      sx={{ bgcolor: "#272242", color: "#FFF" }}
                    >
                      Check
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
      <MainCard title="Delivered" sx={{ marginTop: "20px" }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: "#272242" }}>
              <TableRow>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Sender
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Receiver
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Delivery Address
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Quantity
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Status
                </TableCell>
                <TableCell sx={{ color: "#FFF", fontWeight: 600 }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordersInProcess.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{`${order.senderName} / ${order.senderPhone}`}</TableCell>
                  <TableCell>{`${order.receiverName} / ${order.receiverPhone}`}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Box
                        sx={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          bgcolor: getStatusColor(order.status),
                          marginRight: "8px",
                        }}
                      />
                      {order.status}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      // onClick={() => handleUpdateOrder(order.id)}
                      sx={{ bgcolor: "#272242", color: "#FFF" }}
                    >
                      Done
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </MainCard>
    </>
  );
};

export default NewDelivery;
