import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Divider,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
} from "@mui/material";
import MainCard from "components/MainCard";
import { useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const navigate = useNavigate();
  const [shippingOptions, setShippingOptions] = useState({
    japan: false,
    domestic: false,
  });
  const [domesticShippingData, setDomesticShippingData] = useState([
    {
      id: 1,
      startPoint: "TP.HCM",
      endPoint: "Binh Thuan",
      startDateTime: "2024-10-01T10:00",
      endDateTime: "2024-10-01T12:00",
      totalHours: 2,
      selected: false,
    },
    {
      id: 2,
      startPoint: "Da Nang",
      endPoint: "Hue",
      startDateTime: "2024-10-02T14:00",
      endDateTime: "2024-10-02T16:30",
      totalHours: 2.5,
      selected: false,
    },
    {
      id: 3,
      startPoint: "TP.Ha Noi",
      endPoint: "TP.HCM",
      startDateTime: "2024-10-03T08:00",
      endDateTime: "2024-10-03T11:00",
      totalHours: 3,
      selected: false,
    },
  ]);

  const order = {
    status: "Delivered",
    sender: {
      name: "Alice Smith",
      phone: "123-456-7890",
      address: "123 Pond Lane, Fishville",
      createdDate: "2023-09-25 14:30",
    },
    receiver: {
      name: "Bob Johnson",
      phone: "098-765-4321",
      address: "456 Waterway Ave, Aquatown",
    },
    koiFish: {
      totalQuantity: 10,
      sizeDistribution: {
        "<19cm": 3,
        "20-25cm": 4,
        "26-30cm": 3,
      },
      pictures: [
        "/path/to/picture1.jpg",
        "/path/to/picture2.jpg",
        "/path/to/picture3.jpg",
        "/path/to/picture4.jpg",
      ],
    },
    note: "Please handle with care!",
    fee: {
      wrapFee: "$10",
      deliveryFee: "$15",
      VAT: "$5",
      total: "$80",
    },
  };

  const handleAcceptOrder = () => {
    navigate("/delivery/new-delivery");
  };

  const handleRejectOrder = () => {
    console.log("Order rejected");
  };

  const handleCheckboxChange = (option) => {
    setShippingOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleShippingDataChange = (id, field, value) => {
    setDomesticShippingData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <MainCard>
      <Typography variant="h4" align="left" gutterBottom>
        Order Status: {order.status}
      </Typography>
      <Typography>
        Created Order Date & Time: {order.sender.createdDate}
      </Typography>

      <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
        <Typography variant="h6">Sender & Receiver Information</Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1">Sender:</Typography>
            <Typography>
              {order.sender.name} / {order.sender.phone}
            </Typography>
            <Typography>{order.sender.address}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ marginX: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1">Receiver:</Typography>
            <Typography>
              {order.receiver.name} / {order.receiver.phone}
            </Typography>
            <Typography>{order.receiver.address}</Typography>
          </Box>
        </Box>
      </Paper>

      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
        <Typography variant="h6">Koi Fish Information</Typography>
        <Typography>
          Total Quantity of Koi Fish: {order.koiFish.totalQuantity}
        </Typography>
        <Box display="flex" justifyContent="space-between" marginTop={2}>
          {Object.entries(order.koiFish.sizeDistribution).map(
            ([size, quantity]) => (
              <Paper
                key={size}
                sx={{ padding: 2, flex: 1, margin: 1, textAlign: "center" }}
              >
                <Typography variant="subtitle1">{size}</Typography>
                <Typography variant="h5">{quantity}</Typography>
              </Paper>
            )
          )}
        </Box>
        <Box display="flex" justifyContent="space-around" marginTop={2}>
          {order.koiFish.pictures.map((pic, index) => (
            <Paper
              key={index}
              sx={{
                width: "100px",
                height: "100px",
                padding: 1,
                textAlign: "center",
              }}
            >
              <img
                src={pic}
                alt={`Koi Fish ${index + 1}`}
                style={{ width: "100%", height: "auto" }}
              />
            </Paper>
          ))}
        </Box>
      </Paper>

      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
        <Typography variant="h6">Delivery Information</Typography>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={shippingOptions.japan}
                onChange={() => handleCheckboxChange("japan")}
              />
            }
            label="Shipping from Japan"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={shippingOptions.domestic}
                onChange={() => handleCheckboxChange("domestic")}
              />
            }
            label="Domestic Shipping"
          />
        </Box>

        {shippingOptions.japan && (
          <Box>
            <Typography>Destination: TP.HCM</Typography>
            <TextField
              type="datetime-local"
              sx={{ marginBottom: 2, width: "200px" }}
            />
            <TextField
              type="datetime-local"
              sx={{ marginBottom: 2, width: "200px" }}
            />
          </Box>
        )}

        {shippingOptions.domestic && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select</TableCell>
                  <TableCell>Start Point</TableCell>
                  <TableCell>End Point</TableCell>
                  <TableCell>Start Date & Time</TableCell>
                  <TableCell>End Date & Time</TableCell>
                  <TableCell>Total Hours</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domesticShippingData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Checkbox
                        checked={row.selected}
                        onChange={() => {
                          const newSelected = !row.selected;
                          handleShippingDataChange(
                            row.id,
                            "selected",
                            newSelected
                          );
                        }}
                      />
                    </TableCell>
                    <TableCell>{row.startPoint}</TableCell>
                    <TableCell>{row.endPoint}</TableCell>
                    <TableCell>
                      <TextField
                        type="datetime-local"
                        value={row.startDateTime}
                        onChange={(e) =>
                          handleShippingDataChange(
                            row.id,
                            "startDateTime",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="datetime-local"
                        value={row.endDateTime}
                        onChange={(e) =>
                          handleShippingDataChange(
                            row.id,
                            "endDateTime",
                            e.target.value
                          )
                        }
                      />
                    </TableCell>
                    <TableCell>{row.totalHours}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
        <Typography variant="h6">Note from Customer</Typography>
        <Typography>{order.note}</Typography>
      </Paper>

      <Divider sx={{ marginBottom: 2 }} />
      <Paper sx={{ padding: 2, marginBottom: 2, boxShadow: 0 }}>
        <Typography variant="h6">Fee Information</Typography>
        <Typography>Wrap Fee: {order.fee.wrapFee}</Typography>
        <Typography>Delivery Fee: {order.fee.deliveryFee}</Typography>
        <Typography>VAT: {order.fee.VAT}</Typography>
        <Typography>Total Fee: {order.fee.total}</Typography>
      </Paper>

      <Box display="flex" justifyContent="center" marginTop={2}>
        <Button
          variant="contained"
          color="error"
          onClick={handleRejectOrder}
          sx={{ marginRight: 4 }}
        >
          Reject
        </Button>
        <Button variant="contained" color="success" onClick={handleAcceptOrder}>
          Update
        </Button>
      </Box>
    </MainCard>
  );
};

export default OrderDetail;
