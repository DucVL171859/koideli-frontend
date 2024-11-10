import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import RechargeModal from "./rechargeModal";
import userService from "services/userServices";
import walletServices from "services/walletServices";
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { PriceFormat } from "utils/tools";
import "pages/css/style.css";
import transactionServices from "services/transactionServices";

const HomeTab = ({ initialProfile }) => {
  const [profile, setProfile] = useState(initialProfile || {});
  const [loading, setLoading] = useState(!initialProfile);
  const [showModal, setShowModal] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("wallet");

  const walletId = sessionStorage.getItem("walletId"); // Retrieve walletId from session storage

  useEffect(() => {
    const fetchWalletAndProfile = async () => {
      try {
        const walletData = await walletServices.getWallet();
        if (walletData.data && walletData.data.data.length > 0) {
          setWallet(walletData.data.data[0]);
          setProfile((prevProfile) => ({
            ...prevProfile,
            id: walletData.data.data[0].userId,
          }));
        } else {
          const profileData = await userService.getProfileAPI();
          setProfile(profileData.data);

          if (profileData.data.id) {
            const updatedWalletData = await walletServices.getWallet();
            setWallet(
              updatedWalletData.data.data.length > 0
                ? updatedWalletData.data.data[0]
                : null
            );
          }
        }
      } catch (error) {
        console.error("Error fetching wallet or profile:", error);
        toast.error("Error fetching wallet or profile");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletAndProfile();
  }, []);

  useEffect(() => {
    if (activeTab === "transactions") {
      fetchTransactions();
    }
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      const transactionData = await transactionServices.getTransaction();
      // Filter transactions based on walletId from sessionStorage
      const filteredTransactions = transactionData.data.data.filter(
        (transaction) => transaction.walletId === parseInt(walletId)
      );
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Error fetching transactions");
    }
  };

  const handleCreateWallet = async () => {
    try {
      const newWallet = await userService.createWalletAPI({
        userId: profile.id,
        walletType: "default",
      });
      setWallet(newWallet.data);
      toast.success("Tạo Ví thành công!");
    } catch (error) {
      console.error("Error creating wallet:", error);
      toast.error("Error creating wallet");
    }
  };

  const handleRecharge = async (amount) => {
    if (!amount) {
      toast.error("Vui lòng nhập số tiền");
      return;
    }

    try {
      // Step 1: Create the transaction
      const transactionResponse = await transactionServices.createTransaction({
        totalAmount: amount,
        paymentType: "IN",
        walletId: parseInt(walletId),
      });

      if (transactionResponse.data && transactionResponse.data.success) {
        const transactionId = transactionResponse.data.data.id;

        // Step 2: Use transactionId in the recharge API call
        const rechargeResponse = await walletServices.rechargeAPI({
          amount,
          transactionId,
        });

        if (
          rechargeResponse.isSuccess &&
          rechargeResponse.data &&
          rechargeResponse.data.payUrl
        ) {
          window.location.href = rechargeResponse.data.payUrl;
          // window.open(rechargeResponse.data.payUrl, "_blank");
          toast.success("Redirecting to payment...");

          // Handle payment status as needed
        } else {
          toast.error("Unexpected response from the server");
        }
      } else {
        toast.error("Failed to create transaction");
      }
    } catch (error) {
      console.error("Error during recharge:", error);
      toast.error("Error during recharge");
    } finally {
      handleClose();
    }
  };

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <div className="tab-content" id="myTabContent">
      <div className="nav my-event-tabs mt-4" role="tablist">
        <button
          className={`event-link ${activeTab === "wallet" ? "active" : ""}`}
          onClick={() => setActiveTab("wallet")}
          type="button"
        >
          Ví của tôi
        </button>
        <button
          className={`event-link ${activeTab === "transactions" ? "active" : ""}`}
          onClick={() => setActiveTab("transactions")}
          type="button"
        >
          Giao Dịch
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "wallet" && (
          <div
            className="tab-pane fade show active"
            id="wallet"
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-12">
                <div className="main-card mt-4">
                  <div className="card-top p-4">
                    <div className="card-event-dt">
                      <div className="event-btn-group">
                        {loading ? (
                          <CircularProgress />
                        ) : wallet ? (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="start"
                          >
                            <Typography variant="h6" gutterBottom>
                              Số dư ví: <PriceFormat price={wallet.balance} />
                            </Typography>
                            <Button
                              className="esv-btn me-2"
                              startIcon={<AccountBalanceWalletIcon />}
                              onClick={handleShow}
                              sx={{
                                backgroundColor: "#007bff",
                                color: "white",
                                "&:hover": { backgroundColor: "#0056b3" },
                                fontWeight: "bold",
                              }}
                            >
                              Nạp Tiền vào Ví
                            </Button>
                          </Box>
                        ) : (
                          <Button
                            className="esv-btn me-2"
                            startIcon={<AccountBalanceWalletIcon />}
                            onClick={handleCreateWallet}
                            sx={{
                              backgroundColor: "#28a745",
                              color: "white",
                              "&:hover": { backgroundColor: "#218838" },
                              fontWeight: "bold",
                            }}
                          >
                            Tạo Ví
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div
            className="tab-pane fade show active"
            id="transactions"
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-12">
                <div className="main-card mt-4">
                  <div className="card-top p-4">
                    <div className="card-event-dt">
                      <h5>TẤT CẢ GIAO DỊCH</h5>
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 800 }}
                          aria-label="transactions table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>ID Giao Dịch</TableCell>
                              <TableCell>Số Tiền</TableCell>
                              <TableCell>Loại Giao Dịch</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {transactions.length > 0 ? (
                              transactions.map((transaction) => (
                                <TableRow key={transaction.id}>
                                  <TableCell>{transaction.id}</TableCell>
                                  <TableCell>
                                    <Typography
                                      style={{
                                        color:
                                          transaction.paymentType === "IN"
                                            ? "green"
                                            : "red",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {transaction.paymentType === "IN"
                                        ? "+"
                                        : "-"}{" "}
                                      <PriceFormat
                                        price={transaction.totalAmount}
                                      />
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      style={{
                                        color:
                                          transaction.paymentType === "IN"
                                            ? "green"
                                            : "red",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {transaction.paymentType === "IN"
                                        ? "Nạp tiền"
                                        : "Thanh Toán"}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={3} align="center">
                                  Không có giao dịch nào.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <RechargeModal
        show={showModal}
        handleClose={handleClose}
        handleRecharge={handleRecharge}
      />
    </div>
  );
};

export default HomeTab;
