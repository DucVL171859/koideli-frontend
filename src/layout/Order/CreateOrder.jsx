import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  CardContent,
  CardMedia,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUploadIcon from "@mui/icons-material/UploadFile";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import SetMealIcon from "@mui/icons-material/SetMeal";

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
import walletServices from "services/walletServices";
import transactionServices from "services/transactionServices";

import { formatDistance, PriceFormat } from "utils/tools";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateOrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Phase 1: Receiver Info
  const [senderName, setSenderName] = useState("");
  const [senderAddress, setSenderAddress] = useState("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");

  // Distance and shipping cost
  const [branchPoints, setBranchPoints] = useState([]);
  const [calculatedDistance, setCalculatedDistance] = useState(0);
  const [calculatedDistanceinText, setCalculatedDistanceinText] = useState("");
  const [distanceId, setDistanceId] = useState(null);
  const [distanceShippingCost, setDistanceShippingCost] = useState(0); // Shipping cost from distanceAPI
  const [packingShippingCost, setPackingShippingCost] = useState(0);
  const [boxOpShippingCost, setBoxOpShippingCost] = useState(0);
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
  const [totalFee, setTotalFee] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  // Additional state variables to store box option data after estimation
  const [boxOptions, setBoxOptions] = useState([]);
  const [selectedBoxOption, setSelectedBoxOption] = useState(null);

  const [distanceData, setDistanceData] = useState([]);
  const [shippingType, setShippingType] = useState("Vietnam"); // New state for shipping type

  const [isEstimateLoading, setIsEstimateLoading] = useState(false); // Estimate loading
  const [isAddFishLoading, setIsAddFishLoading] = useState(false); // Add fish loading
  const [isCreateOrderLoading, setIsCreateOrderLoading] = useState(false); // Create order loading
  // Dialog state variable for confirmation
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [userConfirmedBalance, setUserConfirmedBalance] = useState(false);

  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const walletId = sessionStorage.getItem("walletId");
        const walletResponse = await walletServices.getWallet(walletId);

        if (
          walletResponse.status === 200 &&
          walletResponse.data.success &&
          walletResponse.data.data.length > 0
        ) {
          const currentBalance = walletResponse.data.data[0].balance;
          setCurrentBalance(currentBalance); // Update the balance state
        } else {
          toast.error("Không tìm thấy số dư hiện tại của ví.");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy số dư ví.");
        console.error("Error fetching wallet balance:", error);
      }
    };

    fetchWalletBalance();
  }, []);

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
          toast.error("Failed to fetch profile data.");
        }
      } catch (error) {
        toast.error("Error fetching profile data.");
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
        console.log("API Response:", response); // Kiểm tra phản hồi API

        // Kiểm tra phản hồi từ API
        if (response.data && response.data.success) {
          const branchData = response.data.data;

          // Kết hợp tất cả điểm bắt đầu và kết thúc vào một mảng duy nhất
          const allPoints = [
            ...new Set([
              ...branchData.map((branch) => branch.startPoint),
              ...branchData.map((branch) => branch.endPoint),
            ]),
          ];

          setBranchPoints(allPoints); // Lưu vào state
        } else {
          console.error("Failed to fetch branches:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching branches:", error.message); // Log lỗi nếu có
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
    setIsAddFishLoading(true); // Start loading
    const selectedFish = fishList.find(
      (fish) => fish.id === parseInt(selectedFishId)
    );

    if (selectedFish && fishQuantity > 0) {
      setSelectedFishList([
        ...selectedFishList,
        { ...selectedFish, quantity: fishQuantity },
      ]);
      setSelectedFishId(""); // Reset dropdown selection
      setFishQuantity(1); // Reset quantity

      // Add delay to simulate processing time
      setTimeout(() => {
        toast.success("Cá đã được thêm thành công!");
        setIsAddFishLoading(false); // Stop loading
      }, 500);
    } else {
      toast.warn("Hãy chọn cá và nhập số lượng hợp lệ.");
      setIsAddFishLoading(false); // Stop loading
    }
  };

  // Remove fish from the selected fish list
  const handleRemoveFish = (fishId) => {
    setSelectedFishList(selectedFishList.filter((fish) => fish.id !== fishId));
  };

  const handleBranchSelection = async () => {
    if (startPoint && endPoint) {
      try {
        const distanceMatrixResponse = await getDistanceMatrixAPI(
          startPoint,
          endPoint
        );

        if (distanceMatrixResponse.success) {
          const calculatedDistance = distanceMatrixResponse.distance;
          console.log(calculatedDistance);
          setCalculatedDistance(calculatedDistance);

          const distanceAPIResponse = await distanceServices.getDistance();
          if (distanceAPIResponse.success) {
            const matchingDistance = distanceAPIResponse.data.find(
              (distance) => calculatedDistance <= distance.rangeDistance
            );

            if (matchingDistance) {
              setDistanceShippingCost(matchingDistance.price);
              setDistanceId(matchingDistance.id);
              return matchingDistance.price;
            } else {
              toast.warn("No matching distance found.");
              return 0;
            }
          } else {
            toast.error("Failed to fetch distance data.");
            return 0;
          }
        } else {
          toast.error("Distance Matrix API error.");
          return 0;
        }
      } catch (error) {
        toast.error("Error calculating distance.");
        return 0;
      }
    } else {
      toast.warn("Please select both start and end points.");
      return 0;
    }
  };
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

      if (boxResponse && boxResponse.boxes) {
        setPackingResult(boxResponse.boxes); // Update packing result

        // Include boxName in boxOptions for matching
        const boxOptionsData = boxResponse.boxes.map((box) => ({
          boxId: box.boxId,
          boxName: box.boxName, // Include boxName here
          fishes: box.fishes.map((fish) => ({
            fishId: fish.fishId,
            quantity: fish.quantity,
          })),
        }));

        setBoxOptions(boxOptionsData);
        console.log("Box options set:", boxOptionsData);

        return boxResponse.totalPrice; // Return packing shipping cost
      } else {
        toast.error("Error in response structure.");
        return 0;
      }
    } catch (error) {
      toast.error("Error estimating packing.");
      return 0;
    }
  };

  const calculateTotalShippingCostWrapper = async () => {
    setIsEstimateLoading(true); // Start loading

    try {
      // Calculate the distance cost
      const distanceCost = await handleBranchSelection();

      // Calculate the packing cost
      const packingCost = await handleEstimatePacking();

      let boxShippingCosts = [];
      let calculatedTotalFee = 0; // Temporary total fee

      // Calculate costs for each box
      packingResult.forEach((box) => {
        let additionalCost = 0;

        if (box.boxName.includes("Medium")) {
          additionalCost = 150000 * box.usageCount;
        } else if (box.boxName.includes("Large")) {
          additionalCost = 350000 * box.usageCount;
        }

        const totalBoxCost = distanceCost;

        boxShippingCosts.push({
          boxName: box.boxName,
          boxId: box.boxId,
          boxPrice: box.price,
          shippingCost: totalBoxCost, // Set total shipping cost for this box
        });
        console.log("Boxshipping cost", boxShippingCosts);
        console.log("distance",additionalCost)
        calculatedTotalFee += totalBoxCost;
      });

      setBoxOpShippingCost(boxShippingCosts);
      console.log(calculatedTotalFee)
      calculateTotalShippingCost(calculatedTotalFee, packingCost);

      toast.success("Tính tổng chi phí vận chuyển thành công!");
    } catch (error) {
      toast.error("Lỗi khi tính tổng chi phí vận chuyển.");
    }

    setIsEstimateLoading(false); // Stop loading
  };

  // Function to calculate the total cost
  const calculateTotalShippingCost = (boxShippingCost, packingCost) => {
    const totalCost = boxShippingCost + packingCost;
    console.log(packingCost)
    setTotalFee(totalCost);
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

  // Open confirmation dialog
  const handleOpenConfirmDialog = () => {
    if (
      !receiverName ||
      !receiverAddress ||
      !receiverPhone ||
      (!certificates.urlCer1 &&
        !certificates.urlCer2 &&
        !certificates.urlCer3 &&
        !certificates.urlCer4)
    ) {
      toast.warn("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  // Close confirmation dialog
  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false);
  };

  // Confirm and create order
  const handleConfirmCreateOrder = () => {
    setUserConfirmedBalance(true); // Mark as confirmed
    setIsConfirmDialogOpen(false); // Close the dialog
    handleSubmitOrder(); // Retry the order submission after confirmation
  };

  const handleSubmitOrder = async () => {
    setIsCreateOrderLoading(true);

    try {
      // Step 1: Fetch wallet balance
      const walletId = sessionStorage.getItem("walletId");
      const walletResponse = await walletServices.getWalletById(walletId);

      if (
        walletResponse.status === 200 &&
        walletResponse.data.success      ) {
        const currentBalance = walletResponse.data.data.balance;
        let isPayment = false;

        // Step 2: Check if the balance is sufficient
        if (currentBalance >= totalFee) {
          // Deduct the total fee from the current balance
          const updatedBalance = currentBalance - totalFee;

          // Step 3: Update wallet with the new balance
          await walletServices.updateWallet(walletId, {
            userId,
            balance: updatedBalance,
          });
          toast.success("Số dư ví đã được trừ thành công!");

          // Step 4: Create a transaction record
          await transactionServices.createTransaction({
            totalAmount: totalFee,
            paymentType: "OUT",
            walletId: parseInt(walletId),
          });
          toast.success("Giao dịch đã được tạo thành công!");

          isPayment = true; // Set isPayment to true if payment is successful
        } else if (!userConfirmedBalance) {
          // Open the dialog only once if the user hasn't confirmed
          setIsConfirmDialogOpen(true);
          setIsCreateOrderLoading(false);
          return; // Exit function to prevent order creation without confirmation
        }

        // Step 5: Proceed with order creation if balance is sufficient or confirmed
        const orderPayload = {
          userId,
          senderName,
          senderAddress,
          receiverName,
          receiverAddress,
          receiverPhone,
          totalFee,
          isShipping: "Pending",
          isPayment, // Set isPayment based on payment status
          ...certificates,
        };

        const orderResponse = await orderServices.createOrder(orderPayload);
        const orderId = orderResponse.data.data.id;

        if (!distanceId) {
          toast.warn("Distance ID is missing. Calculate distance first.");
          setIsCreateOrderLoading(false);
          return;
        }

        // Create order details for each box option
        for (const boxOption of boxOptions) {
          const matchingBoxCost = boxOpShippingCost.find(
            (boxCost) => boxCost.boxName === boxOption.boxName
          );

          if (!matchingBoxCost) {
            toast.error(
              `Shipping cost not found for box: ${boxOption.boxName}`
            );
            setIsCreateOrderLoading(false);
            return;
          }

          const totalBoxShippingFee =
            shippingType === "Japan"
              ? matchingBoxCost.shippingCost + matchingBoxCost.boxPrice
              : matchingBoxCost.shippingCost;

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

          const boxOptionResponse =
            await boxOptionServices.createBoxOption(boxOptionPayload);

          if (
            boxOptionResponse?.status === 200 &&
            boxOptionResponse.data?.success &&
            Array.isArray(boxOptionResponse.data.data) &&
            boxOptionResponse.data.data.length > 0
          ) {
            const createdBoxOptionId = boxOptionResponse.data.data[0].id;

            const orderDetailPayload = {
              totalShippingFee: totalBoxShippingFee,
              boxOptionId: createdBoxOptionId,
              orderId,
              distanceId,
              isComplete: "0",
            };

            const orderDetailResponse =
              await orderDetailServices.createOrderDetail(orderDetailPayload);

            if (
              orderDetailResponse?.status === 200 &&
              orderDetailResponse.data?.success
            ) {
              toast.success(`Đơn hàng được tạo thành công!`);
              navigate("/user-profile?activeTab=orders");
            } else {
              toast.error("Lỗi khi tạo Chi tiết Đơn hàng.");
              break;
            }
          } else {
            toast.error("Lỗi khi tạo Hộp cho Đơn hàng.");
            break;
          }
        }
      } else {
        toast.error("Không tìm thấy thông tin ví của bạn.");
      }
    } catch (error) {
      toast.error("Lỗi khi tạo đơn hàng.");
      console.error("Error creating order:", error);
    }

    setIsCreateOrderLoading(false);
  };

  return (
    <Box py={4} className="container">
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        textAlign="center"
        sx={{ color: "#86250e" }} // Primary color
      >
        Tạo Đơn Hàng Mới
      </Typography>

      <Grid container spacing={4}>
        {/* Section 1: Information */}
        <Grid item xs={12}>
          <Card
            sx={{
              marginBottom: 2,
              boxShadow: 3,
              borderRadius: 2,
              border: "2px solid #86250e",
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Thông Tin Đơn Hàng
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                {/* Shipping Type Selection */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="shipping-type-label">
                      Loại Vận Chuyển
                    </InputLabel>
                    <Select
                      labelId="shipping-type-label"
                      value={shippingType}
                      onChange={(e) => {
                        const selectedType = e.target.value;
                        setShippingType(selectedType);

                        // Nếu chọn 'Japan', thiết lập 'Kho Gửi' là 'Tp. Hồ Chí Minh'
                        if (selectedType === "Japan") {
                          setStartPoint("Tp. Hồ Chí Minh");
                        }
                      }}
                    >
                      <MenuItem value="Vietnam">Vận Chuyển Nội Địa</MenuItem>
                      <MenuItem value="Japan">Vận Chuyển Từ Nhật</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="start-point-label">Kho Gửi</InputLabel>
                    <Select
                      labelId="start-point-label"
                      value={startPoint}
                      onChange={(e) => setStartPoint(e.target.value)}
                    >
                      {branchPoints.map((point, index) => (
                        <MenuItem key={index} value={point}>
                          {point}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="end-point-label">Kho Nhận</InputLabel>
                    <Select
                      labelId="end-point-label"
                      value={endPoint}
                      onChange={(e) => setEndPoint(e.target.value)}
                    >
                      {branchPoints.map((point, index) => (
                        <MenuItem key={index} value={point}>
                          {point}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Sender Information */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      marginBottom: 2,
                      boxShadow: 3,
                      borderRadius: 2,
                      border: "2px solid #d35400", // Secondary color
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: "#d35400" }}
                      >
                        Thông Tin Người Gửi
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      <TextField
                        label="Tên Người Gửi"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Địa Chỉ Người Gửi"
                        value={senderAddress}
                        onChange={(e) => setSenderAddress(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </CardContent>
                  </Card>
                </Grid>

                {/* Receiver Information */}
                <Grid item xs={12} md={6}>
                  <Card
                    sx={{
                      marginBottom: 2,
                      boxShadow: 3,
                      borderRadius: 2,
                      border: "2px solid #239b56", // Accent color
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ color: "#239b56" }}
                      >
                        Thông Tin Người Nhận
                      </Typography>
                      <Divider sx={{ mb: 2 }} />

                      <TextField
                        label="Tên Người Nhận"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Địa Chỉ Người Nhận"
                        value={receiverAddress}
                        onChange={(e) => setReceiverAddress(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Số Điện Thoại Người Nhận"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section 2: Estimate */}
        <Grid item xs={12}>
          <Card
            sx={{
              marginBottom: 2,
              boxShadow: 3,
              borderRadius: 2,
              border: "2px solid #86250e",
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Ước Tính Chi Phí
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                {/* Fish Selection */}
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="fish-select-label">Chọn Cá</InputLabel>
                    <Select
                      labelId="fish-select-label"
                      value={selectedFishId}
                      onChange={(e) => setSelectedFishId(e.target.value)}
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
                    value={fishQuantity}
                    onChange={(e) => setFishQuantity(parseInt(e.target.value))}
                    fullWidth
                    margin="normal"
                    inputProps={{ min: 1 }}
                  />

                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#d35400",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#b34100" },
                      width: "100%",
                      mt: 2,
                    }}
                    onClick={handleAddFish}
                    disabled={isAddFishLoading} // Disable button when loading
                  >
                    {isAddFishLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <AddCircleOutlineIcon />
                        Thêm Cá
                      </>
                    )}
                  </Button>

                  <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                      <TableHead sx={{ backgroundColor: "#239b56" }}>
                        {" "}
                        {/* Green header */}
                        <TableRow>
                          <TableCell sx={{ color: "#fff" }}>Cá</TableCell>
                          <TableCell align="right" sx={{ color: "#fff" }}>
                            Số Lượng
                          </TableCell>
                          <TableCell align="right" sx={{ color: "#fff" }}>
                            Hành Động
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedFishList.map((fish) => (
                          <TableRow key={fish.id}>
                            <TableCell>{`${fish.size} cm (${fish.description})`}</TableCell>
                            <TableCell align="right">{fish.quantity}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                onClick={() => handleRemoveFish(fish.id)}
                              >
                                <DeleteIcon color="error" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                {/* Packing Results */}
                <Grid item xs={12} md={6}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#1b4f72",
                      color: "#fff",
                      "&:hover": { backgroundColor: "#163d59" },
                      width: "100%",
                      mt: 2,
                    }}
                    onClick={calculateTotalShippingCostWrapper}
                    disabled={isEstimateLoading} // Disable button when loading
                  >
                    {isEstimateLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Tính Tổng Chi Phí Vận Chuyển"
                    )}
                  </Button>

                  {packingResult.length > 0 && (
                    <Grid container spacing={3} sx={{ mt: 4 }}>
                      {packingResult.map((box, index) => {
                        const currentBoxShippingCost = boxOpShippingCost.find(
                          (b) => b.boxName === box.boxName
                        );
                        const totalShippingFee =
                          box.price +
                          (currentBoxShippingCost?.shippingCost || 0);

                        // Define colors for different boxes
                        const colors = [
                          "#86250e",
                          "#d35400",
                          "#1b4f72",
                          "#239b56",
                        ];
                        const boxColor = colors[index % colors.length];

                        return (
                          <Grid item xs={12} sm={6} key={box.boxId}>
                            <Card
                              sx={{
                                padding: 2,
                                border: `2px solid ${boxColor}`,
                                borderRadius: 2,
                                boxShadow: 3,
                                backgroundColor: `${boxColor}20`,
                              }}
                            >
                              <Typography
                                variant="h6"
                                fontWeight="bold"
                                textAlign="center"
                                gutterBottom
                                sx={{ color: boxColor }}
                              >
                                {box.boxName}
                              </Typography>

                              <Divider sx={{ mb: 2 }} />

                              {/* Total Shipping Fee */}
                              <Box display="flex" alignItems="center" mb={2}>
                                <MonetizationOnIcon sx={{ color: boxColor }} />
                                <Typography
                                  variant="h5"
                                  fontWeight="bold"
                                  ml={1}
                                  sx={{ color: boxColor }}
                                >
                                  Tổng Phí của hộp:{" "}
                                  <strong>
                                    <PriceFormat price={totalShippingFee} />
                                  </strong>
                                </Typography>
                              </Box>

                              {/* Cost Breakdown */}
                              <Box mb={2}>
                                <Box display="flex" alignItems="center" mb={1}>
                                  <LocalShippingIcon sx={{ color: boxColor }} />
                                  <Typography variant="body1" ml={1}>
                                    Phí Từ Nhật Bản:{" "}
                                    {shippingType === "Vietnam" ? (
                                      "0 đ"
                                    ) : (
                                      <strong>
                                        <PriceFormat price={box.price} />
                                      </strong>
                                    )}
                                  </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={1}>
                                  <LocalShippingIcon sx={{ color: boxColor }} />
                                  <Typography variant="body1" ml={1}>
                                    Phí Nội Địa:{" "}
                                    {currentBoxShippingCost ? (
                                      <strong>
                                        <PriceFormat
                                          price={
                                            currentBoxShippingCost.shippingCost
                                          }
                                        />
                                      </strong>
                                    ) : (
                                      "Chưa tính toán"
                                    )}
                                  </Typography>
                                </Box>

                                <Box display="flex" alignItems="center" mb={1}>
                                  <LocalShippingIcon sx={{ color: boxColor }} />
                                  <Typography variant="body1" ml={1}>
                                    Khoảng cách nội địa:{" "}
                                    {calculatedDistance ? (
                                      <strong>
                                        {formatDistance(calculatedDistance)}
                                      </strong>
                                    ) : (
                                      "Chưa tính toán"
                                    )}
                                  </Typography>
                                </Box>

                                {shippingType === "Vietnam" && (
                                  <Box
                                    display="flex"
                                    alignItems="center"
                                    mb={1}
                                  >
                                    <LocalShippingIcon
                                      sx={{ color: boxColor }}
                                    />
                                    <Typography variant="body1" ml={1}>
                                      Giá hộp (Nội địa):{" "}
                                      {currentBoxShippingCost ? (
                                        <strong>
                                          <PriceFormat
                                            price={
                                              currentBoxShippingCost.boxPrice
                                            }
                                          />
                                        </strong>
                                      ) : (
                                        "Chưa tính toán"
                                      )}
                                    </Typography>
                                  </Box>
                                )}
                              </Box>

                              {/* Fish Details */}
                              <Box>
                                <Typography
                                  variant="h6"
                                  fontWeight="bold"
                                  gutterBottom
                                >
                                  Cá Được Đóng Gói
                                </Typography>
                                <Paper
                                  variant="outlined"
                                  sx={{
                                    padding: 1,
                                    borderRadius: 1,
                                    mt: 1,
                                    backgroundColor: "#f5f5f5",
                                  }}
                                >
                                  {box.fishes.map((fish) => (
                                    <Box
                                      key={fish.fishId}
                                      display="flex"
                                      alignItems="center"
                                      mb={1}
                                    >
                                      <SetMealIcon color="action" />
                                      <Typography variant="body2" ml={1}>
                                        {fish.quantity} x Cá ({fish.fishSize} cm)
                                      </Typography>
                                    </Box>
                                  ))}
                                </Paper>
                              </Box>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Display Total Fee */}
        <Grid item xs={12}>
          <Box
            sx={{
              padding: 2,
              textAlign: "center",
              border: "2px solid #86250e",
              borderRadius: 2,
              boxShadow: 3,
              marginBottom: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: "#86250e" }}
            >
              Tổng Chi Phí Toàn Bộ Đơn Hàng: <PriceFormat price={totalFee} />
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              padding: 2,
              textAlign: "center",
              border: "2px solid #86250e",
              borderRadius: 2,
              boxShadow: 3,
              marginBottom: 2,
              backgroundColor: "#f5f5f5",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: "#86250e" }}
            >
              Số Dư Ví: <PriceFormat price={currentBalance} />
            </Typography>
          </Box>
        </Grid>

        {/* Section 3: Upload Certificate */}
        <Grid item xs={12}>
          <Card
            sx={{
              marginBottom: 2,
              boxShadow: 3,
              borderRadius: 2,
              border: "2px solid #1b4f72", // Navy Blue border
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ color: "#1b4f72" }}
              >
                Upload Giấy Chứng Nhận
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                {Array.from({ length: certificateCount }, (_, index) => (
                  <Grid item xs={12} sm={6} key={`urlCer${index + 1}`}>
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<FileUploadIcon />}
                      disabled={uploadingCert[`cert${index + 1}`]}
                      sx={{
                        borderColor: "#239b56",
                        color: "#239b56",
                        "&:hover": { borderColor: "#1e8449", color: "#1e8449" },
                      }}
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
                      <Card
                        sx={{
                          mt: 2,
                          border: "1px solid #86250e", // Deep Reddish-Brown border
                          borderRadius: 2,
                        }}
                      >
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
                      sx={{
                        backgroundColor: "#d35400",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#b34100" },
                      }}
                    >
                      Thêm Giấy Chứng Nhận
                    </Button>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Section 4: Create Order Button */}
        <Grid item xs={12}>
          <Card
            sx={{
              marginBottom: 2,
              boxShadow: 3,
              borderRadius: 2,
              border: "2px solid #239b56",
            }}
          >
            <CardContent>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#239b56",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#1e8449",
                  },
                  width: "100%",
                }}
                onClick={handleOpenConfirmDialog}
                disabled={isCreateOrderLoading} // Disable button when loading
              >
                {isCreateOrderLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Tạo Đơn Hàng"
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Confirmation Dialog */}
        <Dialog
          open={isConfirmDialogOpen}
          onClose={handleCloseConfirmDialog}
          aria-labelledby="confirm-dialog-title"
          aria-describedby="confirm-dialog-description"
        >
          <DialogTitle id="confirm-dialog-title">
            {currentBalance >= totalFee
              ? "Xác nhận tạo đơn hàng"
              : "Số dư không đủ"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="confirm-dialog-description">
              {currentBalance >= totalFee
                ? "Bạn có chắc chắn muốn tạo đơn hàng với các thông tin đã nhập không?"
                : "Số dư không đủ để thực hiện đơn hàng này. Bạn có muốn tiếp tục tạo đơn hàng không?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} color="secondary">
              Hủy
            </Button>
            <Button
              onClick={handleConfirmCreateOrder}
              color="primary"
              variant="contained"
              autoFocus
            >
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Box>
  );
};

export default CreateOrderPage;
