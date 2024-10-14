import { useState, useEffect } from "react";
// import {
//   getAllProfileTicketAPI,
//   getAllStallBuyAPI,
// } from "../../components/services/userServices"; // Import the API service
import { toast } from "react-toastify";
import { Pagination, Stack, Button } from "@mui/material";
// import { formatDateTime, PriceFormat } from "utils/tools";
import { useNavigate } from "react-router-dom";
import { formatDateTime, PriceFormat } from "utils/tools";
import "pages/css/style.css";


const OrdersTab = () => {
  const [tickets, setTickets] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tabIndex, setTabIndex] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { tickets, pagination } = await getAllProfileTicketAPI(page, 5);
        setTickets(tickets || []); // Update to directly set the response data
        setTotalPages(pagination.TotalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setLoading(false);
        toast.error("Error fetching tickets");
      }
    };

    const fetchStalls = async () => {
      try {
        const { stalls, pagination } = await getAllStallBuyAPI(page, 5);
        setStalls(stalls || []);
        setTotalPages(pagination.TotalPages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stalls:", error);
        setLoading(false);
        toast.error("Error fetching stalls");
      }
    };

    if (tabIndex === 0) {
      fetchTickets();
    } else {
      fetchStalls();
    }
  }, [page, token, tabIndex]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleTabChange = (event) => {
    const newTabIndex =
      event.target.getAttribute("data-bs-target") === "#Orders" ? 0 : 1;
    setTabIndex(newTabIndex);
    setPage(1); // Reset to first page on tab change
  };

  const handleViewInvoice = (ticketId) => {
    navigate(`/invoice/${ticketId}`);
  };

  const groupByEvent = (items) => {
    const grouped = items.reduce((acc, item) => {
      const event = item.event;
      if (!acc[event.id]) {
        acc[event.id] = { ...event, details: [] };
      }
      acc[event.id].details.push(item);
      return acc;
    }, {});
    return Object.values(grouped);
  };

  const renderEventDetails = (details, isStall = false) => {
    return details.map((detail) => (
      <div className="card-bottom" key={detail.id}>
        <div className="card-bottom-item">
          <div className="card-icon">
            <i className="fa-solid fa-calendar-days" />
          </div>
          <div className="card-dt-text">
            <h6>Sự kiện bắt đầu</h6>
            <span>{formatDateTime(detail.eventDetail.startDate)}</span>
          </div>
        </div>
        <div className="card-bottom-item">
          <div className="card-icon">
            <i className="fa-solid fa-clock" />
          </div>
          <div className="card-dt-text">
            <h6>Sự kiện kết thúc</h6>
            <span>{formatDateTime(detail.eventDetail.endDate)}</span>
          </div>
        </div>
        <div className="card-bottom-item">
          <div className="card-icon">
            <i className="fa-solid fa-money-bill" />
          </div>
          <div className="card-dt-text">
            <h6>Số tiền</h6>
            <span>
              <PriceFormat price={detail.transaction.amount} />
            </span>
          </div>
        </div>
        {!isStall && (
          <div className="card-bottom-item">
            <Button
              className="btn btn-primary"
              onClick={() => handleViewInvoice(detail.id)}
              sx={{
                color: "white",
                backgroundColor: "#450b00",
                "&:hover": {
                  backgroundColor: "#ff7f50",
                },
              }}
            >
              Xem hóa đơn
            </Button>
          </div>
        )}
        {isStall && (
          <div className="card-bottom-item">
            <div className="card-icon">
              <i className="fa-solid fa-shop" />
            </div>
            <div className="card-dt-text">
              <h6>Mã Gian hàng</h6>
              <span>{detail.stallNumber}</span>
            </div>
          </div>
        )}
      </div>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const groupedTickets = groupByEvent(tickets);
  const groupedStalls = groupByEvent(stalls);

  return (
    <div
      className="tab-pane fade active show"
      id="feed"
      role="tabpanel"
      aria-labelledby="feed-tab"
    >
      <div className="nav my-event-tabs mt-4" role="tablist">
        <button
          className={`event-link ${tabIndex === 0 ? "active" : ""}`}
          data-bs-toggle="tab"
          data-bs-target="#Orders"
          type="button"
          role="tab"
          aria-controls="Orders"
          aria-selected={tabIndex === 0}
          onClick={handleTabChange}
        >
          <span>Vé đã mua</span>
        </button>
        <button
          className={`event-link ${tabIndex === 1 ? "active" : ""}`}
          data-bs-toggle="tab"
          data-bs-target="#Stall"
          type="button"
          role="tab"
          aria-controls="Stall"
          aria-selected={tabIndex === 1}
          onClick={handleTabChange}
        >
          <span>Gian hàng đã mua</span>
        </button>
      </div>

      <div className="tab-content mt-4">
        <div
          className={`tab-pane fade ${tabIndex === 0 ? "show active" : ""}`}
          id="Orders"
          role="tabpanel"
          aria-labelledby="orders-tab"
        >
          {groupedTickets.length > 0 ? (
            <>
              {groupedTickets.map((event) => (
                <div className="main-card mt-4" key={event.id}>
                  <div className="card-top p-4">
                    <div className="card-event-img">
                      <img src={event.banner} alt={event.eventName} />
                    </div>
                    <div className="card-event-dt">
                      <h5>{event.eventName}</h5>
                    </div>
                  </div>
                  {renderEventDetails(event.details)}
                </div>
              ))}
              <Stack
                spacing={2}
                sx={{ mt: 2 }}
                className="pagination-controls mt-3 mb-2"
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  variant="outlined"
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                      backgroundColor: "#450b00",
                      "&.Mui-selected": {
                        backgroundColor: "#ff7f50",
                      },
                      "&:hover": {
                        backgroundColor: "#450b00",
                      },
                    },
                  }}
                />
              </Stack>
            </>
          ) : (
            <div>Không có vé đã mua</div>
          )}
        </div>

        <div
          className={`tab-pane fade ${tabIndex === 1 ? "show active" : ""}`}
          id="Stall"
          role="tabpanel"
          aria-labelledby="stall-tab"
        >
          {groupedStalls.length > 0 ? (
            <>
              {groupedStalls.map((event) => (
                <div className="main-card mt-4" key={event.id}>
                  <div className="card-top p-4">
                    <div className="card-event-img">
                      <img src={event.banner} alt={event.eventName} />
                    </div>
                    <div className="card-event-dt">
                      <h5>{event.eventName}</h5>
                    </div>
                  </div>
                  {renderEventDetails(event.details, true)}
                </div>
              ))}
              <Stack
                spacing={2}
                sx={{ mt: 2 }}
                className="pagination-controls mt-3 mb-2"
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handleChangePage}
                  variant="outlined"
                  shape="rounded"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                      backgroundColor: "#450b00",
                      "&.Mui-selected": {
                        backgroundColor: "#ff7f50",
                      },
                      "&:hover": {
                        backgroundColor: "#450b00",
                      },
                    },
                  }}
                />
              </Stack>
            </>
          ) : (
            <div>Không có quầy đã mua</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersTab;
