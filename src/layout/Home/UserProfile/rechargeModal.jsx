import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import "pages/css/style.css";


const RechargeModal = ({ show, handleClose, handleRecharge }) => {
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRecharge(amount);
    setAmount(""); // Reset amount after submission
  };

  return (
    <Dialog open={show} onClose={handleClose}>
      <DialogTitle>Nạp tiền vào ví</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Số tiền"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <DialogActions>
            <Button variant="contained" color="primary" type="submit">
              Nạp tiền
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Đóng
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RechargeModal;
