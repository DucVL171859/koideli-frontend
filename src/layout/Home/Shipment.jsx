import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import koiFishServices from "services/koiFishServices";
import boxServices from "services/boxServices";
import estimatePacking from "services/packingServices";
import { PriceChange } from "@mui/icons-material";
import { PriceFormat } from "utils/tools";

const ShipmentThree = () => {
  const [fishList, setFishList] = useState([]);
  const [packingResult, setPackingResult] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [boxList, setBoxList] = useState([]);

  // Fetch fish data on component mount
  useEffect(() => {
    const fetchFishData = async () => {
      try {
        const fishResponse = await koiFishServices.getKoiFish();
        if (fishResponse.success) {
          // Initialize fishList with quantity = 0
          setFishList(
            fishResponse.data.map((fish) => ({ ...fish, quantity: 0 }))
          );
        } else {
          console.error("Error fetching fish data:", fishResponse.message);
        }
      } catch (error) {
        console.error("Error fetching fish data:", error);
      }
    };

    fetchFishData();
  }, []);

  // Handle quantity change for fish
  const handleQuantityChange = (id, quantity) => {
    setFishList((prevFishList) =>
      prevFishList.map((fish) =>
        fish.id === id ? { ...fish, quantity: parseInt(quantity) } : fish
      )
    );
  };

  const handleEstimatePacking = async () => {
    try {
      // Fetch box data
      const boxResponse = await boxServices.getBox();
      if (boxResponse.success) {
        setBoxList(boxResponse.data);

        // Prepare request body for packing API
        const requestBody = {
          fishList: fishList
            .filter((fish) => fish.quantity > 0)
            .map((fish) => ({
              id: fish.id,
              size: fish.size,
              volume: fish.volume,
              description: fish.description,
              quantity: fish.quantity,
            })),
          boxList: boxResponse.data.map((box) => ({
            id: box.id,
            name: box.name,
            maxVolume: box.maxVolume,
            price: box.price,
            remainingVolume: box.maxVolume,
          })),
        };

        // Call packing API with the fish and box list
        const packingResponse = await estimatePacking(requestBody);

        // Check if response contains data and is successful
        if (packingResponse && packingResponse.boxes) {
          setPackingResult(packingResponse.boxes);
          setTotalCost(packingResponse.totalPrice);
        } else {
          console.error("Error in response structure:", packingResponse);
        }
      } else {
        console.error("Error fetching box data:", boxResponse.message);
      }
    } catch (error) {
      console.error("Error estimating packing:", error);
    }
  };

  // Function to calculate which fish can fit in the box's remaining volume
  const getFishThatFitInBox = (remainingVolume) => {
    return fishList
      .filter((fish) => {
        // Check if the fish can fit into the remaining volume
        return fish.volume > 0 && fish.volume <= remainingVolume;
      })
      .map((fish) => {
        // Calculate how many fish of this type can fit in the remaining volume
        const maxFit = Math.floor(remainingVolume / fish.volume);
        return `${Math.min(maxFit)} Cá Koi ${fish.size} cm`;
      })
      .filter((fishInfo) => fishInfo.includes("1") || fishInfo.includes(" ")); // Ensure we don't show "0x fish"
  };

  return (
    <Box className="shipment-area" py={4}>
      <Box className="container">
        <Grid container spacing={4}>
          {/* Left Section: Fish Table */}
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  align="center"
                  gutterBottom
                >
                  Ước tính chi phí
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  gutterBottom
                >
                  Nhập vào số lượng cá phù hợp với kích thước bên dưới. Hệ thống
                  sẽ tính toán sơ bộ chi phí.
                </Typography>

                {/* Fish Table */}
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Kích thước cá</TableCell>
                        <TableCell align="right">Số lượng cá</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fishList.map((fish) => (
                        <TableRow key={fish.id}>
                          <TableCell>{fish.size} cm</TableCell>
                          <TableCell>{fish.volume}</TableCell>
                          <TableCell>{fish.description}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={fish.quantity}
                              onChange={(e) =>
                                handleQuantityChange(fish.id, e.target.value)
                              }
                              inputProps={{ min: 0 }}
                              size="small"
                              sx={{ width: "60px" }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEstimatePacking}
                  sx={{
                    color: "#ffffff",
                    fontWeight: 700,
                    bgcolor: "#f54242",
                    "&:hover": {
                      bgcolor: "#f57842",
                      color: "#ffffff",
                    },
                    marginTop: "20px",
                    width: "100%",
                    fontSize: "16px",
                    padding: "10px",
                  }}
                >
                  TÍNH TOÁN CHI PHÍ
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Section: Box and Cost Summary */}
          <Grid item xs={12} md={5}>
            <Card sx={{ textAlign: "center", padding: "20px" }}>
              <LocalShippingIcon style={{ fontSize: 60, color: "#ff5722" }} />
              <Typography variant="h5" fontWeight="bold" mt={2} gutterBottom>
                Tổng tiền (Dự kiến): <PriceFormat price={totalCost} />
              </Typography>
            </Card>

            <Box mt={4}>
              <Card sx={{ textAlign: "center", padding: "20px" }}>
                <ShoppingCartIcon style={{ fontSize: 60, color: "#fa4318" }} />
                <Typography variant="h5" fontWeight="bold" mt={2}>
                  Loại Hộp:{" "}
                  {packingResult.length > 0
                    ? packingResult.map((box, index) => (
                        <span key={box.boxId}>
                          {box.boxName}
                          {index < packingResult.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : "Không có hộp"}
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  Số Lượng: {packingResult.length}
                </Typography>
              </Card>
            </Box>

            <Box mt={4}>
              <Card sx={{ textAlign: "center", padding: "20px" }}>
                <AttachMoneyIcon style={{ fontSize: 60, color: "#fa4318" }} />
                <Typography variant="h6" fontWeight="bold" mt={2}>
                  Số Cá có thể thêm vào
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Typography variant="h5" color="textSecondary">
                  {packingResult.map((box) =>
                    getFishThatFitInBox(box.remainingVolume).map(
                      (fish, index) => <div key={index}>{fish}</div>
                    )
                  )}
                </Typography>
              </Card>
            </Box>
          </Grid>
        </Grid>

        {/* Packing Result Section */}
        {packingResult.length > 0 && (
          <Box mt={4}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Chi tiết
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Loại Hộp</TableCell>
                    <TableCell align="right">Giá hộp</TableCell>
                    <TableCell align="right">Loại Cá Được Đóng Gói</TableCell>
                    <TableCell align="right">Cá có thể đóng thêm</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {packingResult.map((box) => (
                    <TableRow key={box.boxId}>
                      <TableCell>{box.boxName}</TableCell>
                      <TableCell align="right">
                        {box.price.toLocaleString()} VND
                      </TableCell>
                      <TableCell align="right">
                        {box.fishes.map((fish) => (
                          <Box key={fish.fishId}>
                            {fish.quantity} Con Cá size {fish.fishSize} cm
                          </Box>
                        ))}
                      </TableCell>
                      <TableCell align="right">
                        {getFishThatFitInBox(box.remainingVolume).map(
                          (fish, index) => (
                            <div key={index}>{fish}</div> // Display each fish on a new line
                          )
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Typography variant="h6" fontWeight="bold" mt={3}>
              Tổng tiền vận chuyển (Dự kiến): {totalCost.toLocaleString()} VND
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ShipmentThree;
