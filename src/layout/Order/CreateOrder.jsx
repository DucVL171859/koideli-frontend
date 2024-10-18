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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FileUploadIcon from "@mui/icons-material/UploadFile";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase functions
import { storage } from "api/firebase"; // Firebase config
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

const CreateOrderPage = () => {
  // Phase 1: Receiver Info
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

        // Correct access to response.data.data
        if (response.data && response.data.success) {
          setBranches(response.data.data); // Access the correct array of branches
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
    if (BranchId) {
      const selectedBranch = branches.find(
        (branch) => branch.id === parseInt(BranchId)
      );

      if (selectedBranch) {
        try {
          // Step 1: Calculate distance between startPoint and endPoint
          const distanceMatrixResponse = await getDistanceMatrixAPI(
            selectedBranch.startPoint,
            selectedBranch.endPoint
          );

          console.log("Distance Matrix API Response:", distanceMatrixResponse); // Log the response

          if (distanceMatrixResponse.success) {
            const calculatedDistance = distanceMatrixResponse.distance;
            setCalculatedDistance(calculatedDistance); // Save the calculated distance

            // Step 2: Fetch the corresponding price based on the calculated distance
            const distanceAPIResponse = await distanceServices.getDistance();

            if (distanceAPIResponse.success) {
              const matchingDistance = distanceAPIResponse.data.find(
                (distance) => calculatedDistance <= distance.rangeDistance
              );

              if (matchingDistance) {
                setDistanceId(matchingDistance.id); // Save the matched distance ID
                return matchingDistance.price; // Return the distance shipping cost
              } else {
                console.error(
                  "No matching distance found for the calculated range."
                );
                return 0; // Return 0 if no matching distance is found
              }
            } else {
              console.error("Error fetching distance data");
              return 0; // Return 0 if the distance API fails
            }
          } else {
            console.error("Distance Matrix API returned an error");
            return 0; // Return 0 if the Distance Matrix API fails
          }
        } catch (error) {
          console.error("Error calculating distance:", error.message);
          return 0; // Return 0 in case of an error
        }
      } else {
        console.error("Branch not found.");
        return 0; // Return 0 if no branch is selected
      }
    } else {
      console.error("No BranchId selected.");
      return 0; // Return 0 if no BranchId is selected
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

      const boxListForAPI = boxList.map((box) => ({
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

      // Step 3: Once both costs are available, calculate the total shipping cost
      calculateTotalShippingCost(distanceCost, packingCost);
    } catch (error) {
      console.error("Error calculating total shipping cost:", error);
    }
  };

  // Function to calculate the total cost
  const calculateTotalShippingCost = (distanceCost, packingCost) => {
    const totalCost = distanceCost + packingCost;
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
      // Step 1: Create the order payload
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

      // Step 2: Create the order and get the order ID
      const orderResponse = await orderServices.createOrder(orderPayload);
      const orderId = orderResponse.data.data.id;

      let hasFailed = false;

      // Step 3: Use the boxOptions stored in the state for the box option payload
      for (const boxOption of boxOptions) {
        const boxOptionPayload = {
          boxes: [
            {
              boxId: boxOption.boxId, // Use the stored boxId from boxOptions
              fishes: boxOption.fishes.map((fish) => ({
                fishId: fish.fishId, // Use the stored fishId from boxOptions
                quantity: fish.quantity, // Use the stored quantity from boxOptions
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

        if (boxOptionResponse && boxOptionResponse.success && Array.isArray(boxOptionResponse.data) && boxOptionResponse.data.length > 0) {
          const createdBoxOptionId = boxOptionResponse.data[0].id;
        
          if (!createdBoxOptionId) {
            console.error("No valid boxOptionId returned from the response.");
          } else {
            const orderDetailPayload = {
              totalShippingFee: totalShippingCost,
              boxOptionId: createdBoxOptionId,
              orderId,
              distanceId,
              isComplete: "0",
            };
        
            console.log("Sending Order Detail Payload:", JSON.stringify(orderDetailPayload));
            await orderDetailServices.createOrderDetail(orderDetailPayload);
            console.log("Order detail created successfully.");
          }
        } else {
          console.error("Failed to create box option. Full response:", boxOptionResponse);
        }
        
      }

      // If any box option creation failed, alert the user and stop
      if (hasFailed) {
        alert(
          "Failed to create box option. Please check the logs for more information."
        );
        return;
      }

      // Success message on order creation
      alert("Order created successfully!");
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
        {/* Receiver Info */}
        <Grid item xs={12} md={6}>
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

        {/* Branch Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Chọn Kho Nhận
              </Typography>
              <Divider />
              <FormControl fullWidth margin="normal">
                <InputLabel id="end-branch-label">Kho Nhận</InputLabel>
                <Select
                  labelId="end-branch-label"
                  value={BranchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  fullWidth
                >
                  {branches.length > 0 ? (
                    branches.map((branch) => (
                      <MenuItem key={branch.id} value={branch.id}>
                        {branch.name} (Điểm Nhận: {branch.endPoint})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No branches available</MenuItem>
                  )}
                </Select>
              </FormControl>
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

        {/* Packing Result */}
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
                        <TableCell align="right">Giá hộp</TableCell>
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
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    mt={4}
                    ml={2}
                    mb={2}
                  >
                    Tổng Chi Phí Vận Chuyển:{" "}
                    {totalShippingCost > 0 ? (
                      <PriceFormat price={totalShippingCost} />
                    ) : (
                      "Chưa tính toán"
                    )}
                  </Typography>
                </TableContainer>
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
