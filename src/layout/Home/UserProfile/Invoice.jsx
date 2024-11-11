import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Divider,
  Grid,
  Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import walletServices from "services/walletServices";
import { toast } from "react-toastify";

const InvoicePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState({});
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const invoiceDetails = {
      amount: queryParams.get("vnp_Amount"),
      bankCode: queryParams.get("vnp_BankCode"),
      transactionNo: queryParams.get("vnp_TransactionNo"),
      transactionStatus: queryParams.get("vnp_TransactionStatus"),
      orderInfo: queryParams.get("vnp_OrderInfo"),
      payDate: queryParams.get("vnp_PayDate"),
      bankTranNo: queryParams.get("vnp_BankTranNo"),
      cardType: queryParams.get("vnp_CardType"),
      secureHash: queryParams.get("vnp_SecureHash"),
    };
    setInvoiceData(invoiceDetails);
  }, [location.search]);

  const updateWalletBalance = async () => {
    try {
      // Retrieve walletId and userId from session storage
      const walletId = sessionStorage.getItem("walletId");
      const userId = sessionStorage.getItem("userId");

      if (!walletId) {
        throw new Error("Wallet ID is required to update the balance");
      }

      // Step 1: Fetch the current wallet balance
      const walletResponse = await walletServices.getWalletById(walletId);
      console.log(walletResponse); // For debugging: check the structure of walletResponse

      // Access the balance from the nested data structure
      if (
        walletResponse.status === 200 &&
        walletResponse.data.success) {
        const currentBalance = walletResponse.data.data.balance;

        // Step 2: Calculate the new balance by adding the transaction amount
        const transactionAmount = parseInt(invoiceData.amount) / 100;
        const newBalance = currentBalance + transactionAmount;

        // Step 3: Prepare the data for updating the wallet
        const updateData = {
          userId, // Ensure userId is provided
          walletType: "default",
          balance: newBalance,
        };

        // Step 4: Update the wallet with the new balance
        await walletServices.updateWallet(walletId, updateData);
        toast.success("Số dư ví đã được cập nhật thành công");

        // Redirect to user profile
        navigate("/user-profile");
        setIsUpdated(true);
      } else {
        toast.error("Không tìm thấy số dư hiện tại của ví.");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật số dư ví:", error);
      toast.error("Lỗi khi cập nhật số dư ví");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)} ${dateString.slice(8, 10)}:${dateString.slice(10, 12)}:${dateString.slice(12)}`;
  };

  const getTransactionStatus = (statusCode) => {
    return statusCode === "00" ? "Thành công" : "Thất bại";
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Chi tiết hóa đơn
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Mã giao dịch:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                {invoiceData.transactionNo}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Số tiền:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                {(invoiceData.amount / 100).toFixed(2)} VND
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Mã ngân hàng:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{invoiceData.bankCode}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Số giao dịch ngân hàng:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{invoiceData.bankTranNo}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Loại thẻ:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{invoiceData.cardType}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Thông tin đơn hàng:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">{invoiceData.orderInfo}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Ngày thanh toán:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body1">
                {formatDate(invoiceData.payDate)}
              </Typography>
            </Grid>

            <Grid item xs={6}>
              <Typography variant="body1" color="textSecondary">
                Trạng thái giao dịch:
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="body1"
                color={
                  invoiceData.transactionStatus === "00"
                    ? "success.main"
                    : "error.main"
                }
              >
                {getTransactionStatus(invoiceData.transactionStatus)}
              </Typography>
            </Grid>
          </Grid>

          {invoiceData.transactionStatus === "00" && !isUpdated && (
            <Box mt={3} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={updateWalletBalance}
              >
                Cập nhật số dư ví
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default InvoicePage;
