import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RechargeModal from "./rechargeModal";
import userService from "services/userServices";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
} from "@mui/material";
import { formatDateTime, PriceFormat } from "utils/tools";
import { Cancel, CheckCircle } from "@mui/icons-material";
import "pages/css/style.css";

const HomeTab = ({ initialProfile }) => {
  const [profile, setProfile] = useState(initialProfile || {});
  const [loading, setLoading] = useState(!initialProfile);
  const [showModal, setShowModal] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [events, setEvents] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ticketPage, setTicketPage] = useState(1);
  const [totalTicketPages, setTotalTicketPages] = useState(1);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [feedback, setFeedback] = useState({
    eventDetailID: "",
    accountID: "",
    rate: 5,
    description: "",
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!initialProfile) {
      const fetchProfile = async () => {
        try {
          const profileData = await userService.getProfileAPI();
          setProfile(profileData.data); // Adjust to use 'data' object
          setLoading(false);
        } catch (error) {
          console.error("Error fetching profile:", error);
          setLoading(false);
          toast.error("Error fetching profile");
        }
      };

      fetchProfile();
    }
  }, [initialProfile, token]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { transactions, pagination } = await getAllProfileTransactionAPI(
          page,
          10
        );
        setTransactions(transactions);
        setTotalPages(pagination.TotalPages);
        setLoadingTransactions(false);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoadingTransactions(false);
        toast.error("Error fetching transactions");
      }
    };

    fetchTransactions();
  }, [page]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { tickets, pagination } = await getAllEventCheckInAPI(
          ticketPage,
          5
        );
        const eventMap = new Map();
        tickets.forEach((ticket) => {
          if (!eventMap.has(ticket.event.id)) {
            eventMap.set(ticket.event.id, ticket);
          }
        });
        setEvents(Array.from(eventMap.values()));
        setTotalTicketPages(pagination.TotalPages);
        setLoadingTickets(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setLoadingTickets(false);
        toast.error("Error fetching tickets");
      }
    };

    fetchTickets();
  }, [ticketPage]);

  const handleWithdraw = () => {
    alert("Withdraw functionality to be implemented");
    toast.success("Withdraw request initiated");
  };

  const handleRecharge = async (amount) => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }

    try {
      const response = await rechargeAPI({ amount }, token);

      if (response.data) {
        window.location.href = response.data;
        toast.success("Redirecting to payment...");
      } else {
        toast.error("Unexpected response from the server");
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeTicketPage = (event, newPage) => {
    setTicketPage(newPage);
  };

  const handleFeedbackOpen = (event) => {
    const eventEndDate = new Date(event.eventDetail.endDate);
    const currentDate = new Date();
    if (currentDate < eventEndDate) {
      toast.warn("Sự kiện chưa kết thúc!!!");
      return;
    }
    setSelectedEvent(event);
    setFeedback({
      eventDetailID: event.eventDetail.id,
      accountID: event.transaction.accountID,
      rate: 5,
      description: "",
    });
    setFeedbackDialogOpen(true);
  };

  const handleViewFeedback = (event) => {
    const eventEndDate = new Date(event.eventDetail.endDate);
    const currentDate = new Date();
    if (currentDate < eventEndDate) {
      toast.warn("Sự kiện chưa kết thúc!!!");
      return;
    }
    navigate(`/feedback/${event.event.id}`);
  };

  const handleFeedbackClose = () => {
    setFeedbackDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (event, newValue) => {
    setFeedback((prev) => ({ ...prev, rate: newValue }));
  };

  const handleFeedbackSubmit = async () => {
    try {
      await postAddFeedbackAPI(feedback);
      toast.success("Feedback submitted successfully");
      handleFeedbackClose();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("Error submitting feedback");
    }
  };

  const isFeedbackAllowed = (event) => {
    const eventEndDate = new Date(event.eventDetail.endDate);
    const currentDate = new Date();
    const fiveDaysAfterEventEnd = new Date(
      eventEndDate.getTime() + 3 * 24 * 60 * 60 * 1000
    );
    return currentDate <= fiveDaysAfterEventEnd;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tab-content" id="myTabContent">
      <div className="tab-pane fade active show" id="feed" role="tabpanel">
        <div className="nav my-event-tabs mt-4" role="tablist">
          <button
            className="event-link active"
            data-bs-toggle="tab"
            data-bs-target="#wallet"
            type="button"
            role="tab"
            aria-controls="wallet"
            aria-selected="true"
          >
            <span>Ví của tôi</span>
          </button>
          <button
            className="event-link"
            data-bs-toggle="tab"
            data-bs-target="#allTransactions"
            type="button"
            role="tab"
            aria-controls="allTransactions"
            aria-selected="false"
          >
            <span>Xem tất cả Giao dịch</span>
          </button>
          <button
            className="event-link"
            data-bs-toggle="tab"
            data-bs-target="#feedback"
            type="button"
            role="tab"
            aria-controls="feedback"
            aria-selected="false"
          >
            <span>Xem đánh giá sự kiện đã tham gia</span>
          </button>
        </div>

        <div className="tab-content">
          <div
            className="tab-pane fade show active"
            id="wallet"
            role="tabpanel"
          >
            <div className="row">
              <div className="col-md-12">
                <div className="main-card mt-4">
                  <div className="card-top p-4">
                    <div className="card-event-img">
                      <img
                        src={
                          profile.urlAvatar || "https://via.placeholder.com/150"
                        }
                        alt="Profile Avatar"
                      />
                    </div>
                    <div className="card-event-dt">
                      <h5>{profile.name || "User's Name"}</h5>
                      <div className="evnt-time">
                        Role: {profile.role.roleName}
                      </div>
                      <div className="evnt-time">Email: {profile.email}</div>
                      <div className="evnt-time">
                        Phone: {profile.phoneNumber}
                      </div>
                      <div className="evnt-time">Gender: {profile.gender}</div>
                      <div className="event-btn-group">
                        <button className="esv-btn me-2" onClick={handleShow}>
                          <i className="fa-solid fa-wallet me-2" />
                          Nạp Tiền vào Ví
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining tabs... */}
        </div>
      </div>

      <RechargeModal
        show={showModal}
        handleClose={handleClose}
        handleRecharge={handleRecharge}
      />

      <Dialog
        open={feedbackDialogOpen}
        onClose={handleFeedbackClose}
        aria-labelledby="feedback-dialog-title"
      >
        <DialogTitle id="feedback-dialog-title">Create Feedback</DialogTitle>
        <DialogContent>
          <Rating
            name="rate"
            value={feedback.rate}
            onChange={handleRatingChange}
          />
          <TextField
            autoFocus
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={feedback.description}
            onChange={handleFeedbackChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleFeedbackClose}
            sx={{
              color: "white",
              backgroundColor: "#450b00",
              "&:hover": { backgroundColor: "#ff7f50" },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleFeedbackSubmit}
            sx={{
              color: "white",
              backgroundColor: "#450b00",
              "&:hover": { backgroundColor: "#ff7f50" },
            }}
          >
            Gửi Đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HomeTab;
