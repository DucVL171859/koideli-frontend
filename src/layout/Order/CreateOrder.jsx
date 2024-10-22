import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  CardMedia,
  Stack,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FileUploadIcon from "@mui/icons-material/UploadFile";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase functions
import { storage } from "api/firebase"; // Firebase config
import userServices from "services/userServices";
import branchServices from "services/branchServices"; // Branch API service
import distanceServices from "services/distanceServices"; // Distance API service
import getDistanceMatrixAPI from "services/distanceMatrix";
import koiFishServices from "services/koiFishServices";
import estimatePacking from "services/packingServices"; // Packing API
import orderServices from "services/orderServices"; // Order API
import orderDetailServices from "services/orderDetailServices"; // Order Detail API
import boxOptionServices from "services/boxOptionServices"; // Box Option API
import boxServices from "services/boxServices"; // Box Service
import { PriceFormat } from "utils/tools";

const CustomCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const CustomSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    minHeight: "36px",
    lineHeight: "36px",
    padding: theme.spacing(1),
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  textTransform: "none",
  fontSize: "1rem",
  padding: theme.spacing(1.2),
}));

const ResponsiveContainer = styled(Container)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    padding: theme.spacing(2),
  },
  [theme.breakpoints.up("lg")]: {
    padding: theme.spacing(3),
  },
}));

const CreateOrderPage = () => {
  // Phase 1: Receiver Info
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  // Distance and shipping cost
  const [calculatedDistance, setCalculatedDistance] = useState(0);
  const [distanceId, setDistanceId] = useState(null);
  const [distanceShippingCost, setDistanceShippingCost] = useState(0); // Shipping cost from distanceAPI
  const [packingShippingCost, setPackingShippingCost] = useState(0); // Shipping cost from packing estimation
  const [totalShippingCost, setTotalShippingCost] = useState(0); // Sum of both shipping costs
  const [distanceRanges, setDistanceRanges] = useState([]);

  // Branch data and selection
  const [branches, setBranches] = useState([]);
  const [BranchId, setBranchId] = useState("");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");

  // Phase 2: Fish and Packing Data
  const [fishList, setFishList] = useState([]);
  const [selectedFishId, setSelectedFishId] = useState(""); // Dropdown fish selection
  const [fishQuantity, setFishQuantity] = useState(1); // Quantity input
  const [selectedFishList, setSelectedFishList] = useState([]); // List of added fish
  const [packingResult, setPackingResult] = useState([]);
  const [boxList, setBoxList] = useState([]); // Store box data fetched from API
  const [orderDetails, setOrderDetails] = useState({
    totalShippingFee: 0,
    distanceId: null,
    isComplete: "Pending",
  });

  // Additional state variables to store box option data after estimation
  const [boxOptions, setBoxOptions] = useState([]);
  const [selectedBoxOption, setSelectedBoxOption] = useState(null);

  const [distanceData, setDistanceData] = useState([]);
  const [shippingType, setShippingType] = useState("Vietnam"); // New state for shipping type

  // Fetch sender information from getProfile API
  useEffect(() => {
    const fetchSenderInfo = async () => {
      try {
        const profileResponse = await userServices.getProfileAPI();
        if (profileResponse.success) {
          const profileData = profileResponse.data;
          setSenderName(profileData.name);
          setSenderAddress(profileData.address);
        } else {
          console.error(
            "Error fetching profile data:",
            profileResponse.message
          );
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
      }
    };

    fetchSenderInfo();
  }, []);

  useEffect(() => {
    const fetchDistanceData = async () => {
      try {
        const response = await distanceServices.getDistance();
        if (response.success) {
          setDistanceData(response.data); // Set the distance data from API response
        } else {
          console.error("Error fetching distance data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching distance data:", error.message);
      }
    };

    fetchDistanceData();
  }, []);

  // Phase 3: Certificate URLs (User can upload images to Firebase)
  const [certificates, setCertificates] = useState({
    urlCer1: "",
    urlCer2: "",
    urlCer3: "",
    urlCer4: "",
  });
  const [uploadingCert, setUploadingCert] = useState({
    cert1: false,
    cert2: false,
    cert3: false,
    cert4: false,
  });
  const [certificateCount, setCertificateCount] = useState(1);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await branchServices.getBranch();
        console.log("API Response:", response); // Check the full response

        // Kiểm tra phản hồi từ API
        if (response.data && response.data.success) {
          const branchData = response.data.data;

          // Lọc các điểm bắt đầu duy nhất
          const uniqueStartPoints = [
            ...new Set(branchData.map((branch) => branch.startPoint)),
          ];

          // Lọc các điểm kết thúc duy nhất
          const uniqueEndPoints = [
            ...new Set(branchData.map((branch) => branch.endPoint)),
          ];

          // Tạo một đối tượng chứa các chi nhánh đã lọc
          const filteredBranches = branchData.filter(
            (branch) =>
              uniqueStartPoints.includes(branch.startPoint) &&
              uniqueEndPoints.includes(branch.endPoint)
          );

          setBranches(filteredBranches); // Lưu vào state
        } else {
          console.error("Failed to fetch branches:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching branches:", error.message); // Log any errors
      }
    };

    fetchBranches();
  }, []);

  // Fetch distance ranges from the internal distance service
  useEffect(() => {
    const loadDistanceData = async () => {
      try {
        const response = await distanceServices.getDistance();
        if (response.success) {
          setDistanceRanges(response.data);
        } else {
          console.error("Error fetching distance data:", response.message);
        }
      } catch (error) {
        console.error("Error fetching distance data:", error.message);
      }
    };

    loadDistanceData();
  }, []);

  // Fetch fish size data from the koiFishServices API
  useEffect(() => {
    const fetchFishData = async () => {
      try {
        const fishResponse = await koiFishServices.getKoiFish();
        if (fishResponse.success) {
          setFishList(fishResponse.data);
        } else {
          console.error("Error fetching fish data:", fishResponse.message);
        }
      } catch (error) {
        console.error("Error fetching fish data:", error);
      }
    };

    fetchFishData();
  }, []);

  // Fetch box data from the boxServices API
  useEffect(() => {
    const fetchBoxData = async () => {
      try {
        const boxResponse = await boxServices.getBox();
        if (boxResponse.success) {
          setBoxList(boxResponse.data); // Populate the boxList from API
        } else {
          console.error("Error fetching box data:", boxResponse.message);
        }
      } catch (error) {
        console.error("Error fetching box data:", error.message);
      }
    };

    fetchBoxData();
  }, []);

  // Add fish to the selected fish list
  const handleAddFish = () => {
    const selectedFish = fishList.find(
      (fish) => fish.id === parseInt(selectedFishId)
    );
    if (selectedFish && fishQuantity > 0) {
      setSelectedFishList([
        ...selectedFishList,
        { ...selectedFish, quantity: fishQuantity },
      ]);
      setSelectedFishId(""); // Reset the dropdown selection
      setFishQuantity(1); // Reset the quantity
    }
  };

  // Remove fish from the selected fish list
  const handleRemoveFish = (fishId) => {
    setSelectedFishList(selectedFishList.filter((fish) => fish.id !== fishId));
  };

  const handleBranchSelection = async () => {
    if (startPoint && endPoint) {
      try {
        // Bước 1: Tính toán khoảng cách giữa startPoint và endPoint
        const distanceMatrixResponse = await getDistanceMatrixAPI(
          startPoint,
          endPoint
        );

        console.log("Distance Matrix API Response:", distanceMatrixResponse); // Log the response

        if (distanceMatrixResponse.success) {
          const calculatedDistance = distanceMatrixResponse.distance;
          setCalculatedDistance(calculatedDistance); // Lưu khoảng cách đã tính toán

          // Bước 2: Lấy giá tương ứng dựa trên khoảng cách đã tính toán
          const distanceAPIResponse = await distanceServices.getDistance();

          if (distanceAPIResponse.success) {
            const matchingDistance = distanceAPIResponse.data.find(
              (distance) => calculatedDistance <= distance.rangeDistance
            );

            if (matchingDistance) {
              setDistanceShippingCost(matchingDistance.price);
              setDistanceId(matchingDistance.id); // Lưu ID của khoảng cách phù hợp
              return matchingDistance.price; // Trả về chi phí vận chuyển
            } else {
              console.error(
                "No matching distance found for the calculated range."
              );
              return 0; // Trả về 0 nếu không tìm thấy khoảng cách phù hợp
            }
          } else {
            console.error("Error fetching distance data");
            return 0; // Trả về 0 nếu API khoảng cách không thành công
          }
        } else {
          console.error("Distance Matrix API returned an error");
          return 0; // Trả về 0 nếu API tính khoảng cách không thành công
        }
      } catch (error) {
        console.error("Error calculating distance:", error.message);
        return 0; // Trả về 0 trong trường hợp có lỗi
      }
    } else {
      console.error("No startPoint or endPoint selected.");
      return 0; // Trả về 0 nếu không có startPoint hoặc endPoint được chọn
    }
  };

  // Calculate packing cost and return packing shipping cost
  const handleEstimatePacking = async () => {
    try {
      const fishListForAPI = selectedFishList.map((fish) => ({
        id: fish.id,
        size: fish.size,
        volume: fish.volume,
        description: fish.description,
        quantity: fish.quantity,
      }));

      // Filter boxes based on the selected shipping type
      const filteredBoxList = boxList.filter((box) =>
        shippingType === "Japan"
          ? box.name.endsWith("- JP")
          : box.name.endsWith("- VN")
      );

      const boxListForAPI = filteredBoxList.map((box) => ({
        id: box.id,
        name: box.name,
        maxVolume: box.maxVolume,
        price: box.price,
        remainingVolume: box.maxVolume,
      }));

      const requestBody = {
        fishList: fishListForAPI,
        boxList: boxListForAPI,
      };

      const boxResponse = await estimatePacking(requestBody);

      // Check if the response contains the boxes
      if (boxResponse && boxResponse.boxes) {
        setPackingResult(boxResponse.boxes); // Update the packing result state
        setPackingShippingCost(boxResponse.boxes.totalPrice); // Set the packing shipping cost

        // Store the box options and select a default (optional)
        const boxOptionsData = boxResponse.boxes.map((box) => ({
          boxId: box.boxId,
          fishes: box.fishes.map((fish) => ({
            fishId: fish.fishId,
            quantity: fish.quantity,
          })),
        }));

        setBoxOptions(boxOptionsData); // Store the box options in the state
        setSelectedBoxOption(boxOptionsData[0]); // Optionally select the first box option by default

        console.log("Box options stored:", boxOptionsData);
        setPackingShippingCost(boxResponse.totalPrice);
        return boxResponse.totalPrice; // Return packing shipping cost
      } else {
        console.error("Error in response structure:", boxResponse);
        return 0;
      }
    } catch (error) {
      console.error("Error estimating packing:", error.message);
      return 0;
    }
  };

  // New function to calculate total shipping cost
  const calculateTotalShippingCostWrapper = async () => {
    try {
      // Step 1: Calculate the distance and get the distance shipping cost
      const distanceCost = await handleBranchSelection();
      console.log("distance", distanceCost);

      // Step 2: Calculate the packing cost
      const packingCost = await handleEstimatePacking();
      console.log("packing", packingCost);

      let additionalBoxCost = 0;

      // Iterate over packing results to add box-specific costs
      packingResult.forEach((box) => {
        if (box.boxName.includes("Medium")) {
          additionalBoxCost += 150000;
        } else if (box.boxName.includes("Large")) {
          additionalBoxCost += 350000;
        }
      });

      const boxShippingCost = distanceCost + additionalBoxCost;

      // Step 3: Once both costs are available, calculate the total shipping cost
      calculateTotalShippingCost(boxShippingCost, packingCost);
    } catch (error) {
      console.error("Error calculating total shipping cost:", error);
    }
  };

  // Function to calculate the total cost
  const calculateTotalShippingCost = (boxShippingCost, packingCost) => {
    const totalCost =
      shippingType === "Japan"
        ? boxShippingCost + packingCost
        : boxShippingCost; // Adjust total cost based on shipping type
    setTotalShippingCost(totalCost);
  };

  // Upload certificate images to Firebase
  const handleImageUpload = (e, certKey) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingCert((prevState) => ({ ...prevState, [certKey]: true }));

    const storageRef = ref(storage, `documents/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Upload failed:", error);
        setUploadingCert((prevState) => ({ ...prevState, [certKey]: false }));
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setCertificates((prevCerts) => ({
            ...prevCerts,
            [certKey]: downloadURL,
          }));
          setUploadingCert((prevState) => ({ ...prevState, [certKey]: false }));
        });
      }
    );
  };

  // Add new certificate upload input
  const handleAddCertificate = () => {
    if (certificateCount < 4) {
      setCertificateCount(certificateCount + 1);
    }
  };

  // Submit Order
  const handleSubmitOrder = async () => {
    const { urlCer1, urlCer2, urlCer3, urlCer4 } = certificates;

    if (
      !receiverName ||
      !receiverAddress ||
      !receiverPhone ||
      (!urlCer1 && !urlCer2 && !urlCer3 && !urlCer4)
    ) {
      alert(
        "Please fill in all required fields and upload at least one certificate."
      );
      return;
    }

    try {
      const orderPayload = {
        receiverName,
        receiverAddress,
        receiverPhone,
        isShipping: "Pending",
        urlCer1,
        urlCer2,
        urlCer3,
        urlCer4,
      };

      // Tạo đơn hàng và lấy orderId
      const orderResponse = await orderServices.createOrder(orderPayload);
      const orderId = orderResponse.data.data.id;

      let hasFailed = false;

      // Kiểm tra nếu distanceId chưa có giá trị
      if (!distanceId) {
        alert(
          "Distance ID is missing. Please calculate the distance before submitting."
        );
        return;
      }

      // Tạo BoxOption
      for (const boxOption of boxOptions) {
        const boxOptionPayload = {
          boxes: [
            {
              boxId: boxOption.boxId,
              fishes: boxOption.fishes.map((fish) => ({
                fishId: fish.fishId,
                quantity: fish.quantity,
              })),
            },
          ],
        };

        console.log(
          "Sending BoxOption Payload:",
          JSON.stringify(boxOptionPayload)
        );

        const boxOptionResponse =
          await boxOptionServices.createBoxOption(boxOptionPayload);
        console.log("BoxOption Response:", boxOptionResponse);

        if (
          boxOptionResponse?.status === 200 &&
          boxOptionResponse.data?.success &&
          Array.isArray(boxOptionResponse.data.data) &&
          boxOptionResponse.data.data.length > 0
        ) {
          const createdBoxOptionId = boxOptionResponse.data.data[0].id;

          if (createdBoxOptionId) {
            const orderDetailPayload = {
              totalShippingFee: totalShippingCost,
              boxOptionId: createdBoxOptionId,
              orderId,
              distanceId,
              isComplete: "0",
            };

            console.log(
              "Sending Order Detail Payload:",
              JSON.stringify(orderDetailPayload)
            );
            await orderDetailServices.createOrderDetail(orderDetailPayload);
            console.log("Order detail created successfully.");
          } else {
            console.error("No valid boxOptionId returned from the response.");
            hasFailed = true;
          }
        } else {
          console.error(
            "Failed to create box option. Full response:",
            boxOptionResponse
          );
          hasFailed = true;
        }

        if (!boxOptionResponse) {
          console.error("No response received from BoxOption API.");
          hasFailed = true;
          break;
        }
      }

      // Thông báo thành công hoặc thất bại
      if (!hasFailed) {
        alert("Order created successfully!");
      } else {
        alert("Failed to create some box options. Please check the logs.");
      }
    } catch (error) {
      console.error("Error creating order:", error.message, error);
      alert("An error occurred while creating the order. Please try again.");
    }
  };

  return (
    <Box py={6} className="container">
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
        color="primary"
      >
        Tạo Đơn Hàng Mới
      </Typography>

      <Grid container spacing={4}>
        {/* Shipping Type Selection */}
        <Grid item xs={12} md={6} mt={5}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Chọn Loại Vận Chuyển
              </Typography>
              <Divider />
              <FormControl fullWidth margin="normal">
                <InputLabel id="shipping-type-label">
                  Loại Vận Chuyển
                </InputLabel>
                <Select
                  labelId="shipping-type-label"
                  value={shippingType}
                  onChange={(e) => setShippingType(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="Vietnam">Vận Chuyển Nội Địa</MenuItem>
                  <MenuItem value="Japan">Vận Chuyển Từ Nhật</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Sender Info */}
        <Grid item xs={12} md={6} lg={4}>
          <Card variant="outlined" sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Thông Tin Người Gửi
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <TextField
                  label="Tên Người Gửi"
                  fullWidth
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={senderName}
                />
                <TextField
                  label="Địa Chỉ Người Gửi"
                  fullWidth
                  value={senderAddress}
                  onChange={(e) => setSenderAddress(e.target.value)}
                  placeholder={senderAddress}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Branch Selection */}
        <Grid item xs={12} md={6} lg={4}>
          <Card variant="outlined" sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Chọn Kho Gửi và Nhận
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="start-point-label">Kho Gửi</InputLabel>
                  <Select
                    labelId="start-point-label"
                    value={startPoint}
                    onChange={(e) => setStartPoint(e.target.value)}
                    fullWidth
                  >
                    {branches.length > 0 ? (
                      branches.map((branch) => (
                        <MenuItem key={branch.id} value={branch.startPoint}>
                          {branch.startPoint}
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No branches available</MenuItem>
                    )}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel id="end-point-label">Kho Nhận</InputLabel>
                  <Select
                    labelId="end-point-label"
                    value={endPoint}
                    onChange={(e) => setEndPoint(e.target.value)}
                    fullWidth
                  >
                    {branches.length > 0 ? (
                      branches
                        .filter((branch) => branch.endPoint !== startPoint)
                        .map((branch) => (
                          <MenuItem key={branch.id} value={branch.endPoint}>
                            {branch.endPoint}
                          </MenuItem>
                        ))
                    ) : (
                      <MenuItem disabled>No branches available</MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Receiver Info */}
        <Grid item xs={12} md={6} mt={5}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Thông Tin Người Nhận
              </Typography>
              <Divider />
              <TextField
                label="Tên Người Nhận"
                fullWidth
                margin="normal"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
              />
              <TextField
                label="Địa Chỉ Người Nhận"
                fullWidth
                margin="normal"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
              />
              <TextField
                label="Số Điện Thoại Người Nhận"
                fullWidth
                margin="normal"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Fish Selection */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Thông Tin Cá
              </Typography>
              <Divider />
              <FormControl fullWidth margin="normal">
                <InputLabel id="fish-select-label">Chọn Cá</InputLabel>
                <Select
                  labelId="fish-select-label"
                  value={selectedFishId}
                  onChange={(e) => setSelectedFishId(e.target.value)}
                  fullWidth
                >
                  {fishList.map((fish) => (
                    <MenuItem key={fish.id} value={fish.id}>
                      {`${fish.size} cm (${fish.description})`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Số Lượng"
                type="number"
                fullWidth
                margin="normal"
                value={fishQuantity}
                onChange={(e) => setFishQuantity(parseInt(e.target.value))}
                inputProps={{ min: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddFish}
                sx={{ marginTop: "20px", width: "100%" }}
              >
                Thêm Cá
              </Button>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Cá</TableCell>
                      <TableCell align="right">Số Lượng</TableCell>
                      <TableCell align="right">Hành Động</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedFishList.map((fish) => (
                      <TableRow key={fish.id}>
                        <TableCell>{`${fish.size} cm (${fish.description})`}</TableCell>
                        <TableCell align="right">{fish.quantity}</TableCell>
                        <TableCell align="right">
                          <IconButton onClick={() => handleRemoveFish(fish.id)}>
                            <DeleteIcon color="error" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {packingResult.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Thông Tin Hộp Đóng Gói
                </Typography>
                <Divider />
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Loại Hộp</TableCell>
                        <TableCell align="right">
                          Giá Vận chuyển nước ngoài
                        </TableCell>
                        <TableCell align="right">
                          Giá Vân chuyển trong nước
                        </TableCell>
                        <TableCell align="right">
                          Loại Cá Được Đóng Gói
                        </TableCell>
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
                            {distanceShippingCost > 0 ? (
                              <PriceFormat price={distanceShippingCost} />
                            ) : (
                              "Chưa tính toán"
                            )}
                          </TableCell>
                          <TableCell align="right">
                            {box.fishes.map((fish) => (
                              <Box key={fish.fishId}>
                                {fish.quantity}x {fish.fishDescription} (
                                {fish.fishSize} cm)
                              </Box>
                            ))}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Add Distance and Packing Cost Information */}
                <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
                  Chi Phí Di chuyển trong nước:{" "}
                  {distanceShippingCost > 0 ? (
                    <PriceFormat price={distanceShippingCost} />
                  ) : (
                    "Chưa tính toán"
                  )}
                </Typography>
                <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
                  Chi Phí Hộp - Đóng gói:{" "}
                  {packingShippingCost > 0 ? (
                    <PriceFormat price={packingShippingCost} />
                  ) : (
                    "Chưa tính toán"
                  )}
                </Typography>
                <Typography variant="h5" fontWeight="bold" mt={4} ml={2} mb={2}>
                  Tổng Chi Phí Vận Chuyển:{" "}
                  {totalShippingCost > 0 ? (
                    <PriceFormat price={totalShippingCost} />
                  ) : (
                    "Chưa tính toán"
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Calculate Total Shipping Cost Button */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Button
                variant="contained"
                color="primary"
                onClick={calculateTotalShippingCostWrapper}
                fullWidth
                sx={{ marginTop: "20px" }}
              >
                Tính Tổng Chi Phí Vận Chuyển
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Certificate Upload Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Upload Giấy Chứng Nhận
              </Typography>
              <Divider />
              <Grid container spacing={2}>
                {Array.from({ length: certificateCount }, (_, index) => (
                  <Grid item xs={12} sm={6} key={`urlCer${index + 1}`}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<FileUploadIcon />}
                      disabled={uploadingCert[`cert${index + 1}`]}
                    >
                      {`Chọn Giấy Chứng Nhận ${index + 1}`}
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          handleImageUpload(e, `urlCer${index + 1}`)
                        }
                      />
                    </Button>
                    {certificates[`urlCer${index + 1}`] && (
                      <Card sx={{ mt: 2 }}>
                        <CardMedia
                          component="img"
                          height="140"
                          image={certificates[`urlCer${index + 1}`]}
                          alt={`Certificate ${index + 1}`}
                        />
                      </Card>
                    )}
                  </Grid>
                ))}
                {certificateCount < 4 && (
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={handleAddCertificate}
                    >
                      Thêm Giấy Chứng Nhận
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Submit Order Button */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitOrder}
                sx={{ marginTop: "20px", width: "100%" }}
              >
                Tạo Đơn Hàng
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateOrderPage;
