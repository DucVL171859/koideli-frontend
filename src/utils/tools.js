import { toast } from "react-toastify";

// Function to convert date to GMT+7 timezone
export const convertToGMT7 = (dateTimeString) => {
  const [datePart, timePart] = decodeURIComponent(dateTimeString).split(" ");
  const [month, day, year] = datePart.split("/");
  const [hours, minutes, seconds] = timePart.split(":");
  const date = new Date(
    Date.UTC(year, month - 1, day, hours, minutes, seconds)
  );
  date.setHours(date.getHours() + 7);
  const formattedDate = date.toISOString().replace("T", " ").substring(0, 19);
  return formattedDate;
};

// Function to format a date as DD/MM/YYYY
export const formatDate = (inputDate) => {
  const date = new Date(inputDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Component to format price with VND currency
export const PriceFormat = ({ price }) => {
  if (price === undefined || price === null || isNaN(price)) {
    return "N/A";
  }

  const formattedPrice = price.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return formattedPrice; // Return the string directly
};


// Function to format time from a date string
export const formatTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleTimeString();
};

// Function to format date and time as HH:MM DD/MM/YYYY
export const formatDateTime = (date) => {
  const formattedDate = new Date(date);
  const day = formattedDate.getDate().toString().padStart(2, "0");
  const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
  const year = formattedDate.getFullYear();
  const hours = formattedDate.getHours().toString().padStart(2, "0");
  const minutes = formattedDate.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes} ${day}/${month}/${year}`;
};

// Function to calculate time ago from a date
export const calculateTimeAgo = (datetime) => {
  const currentDate = new Date();
  const pastDate = new Date(datetime);
  const timeDifference = currentDate - pastDate;
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "vài giây trước";
  } else if (minutes < 60) {
    return `${minutes} phút trước`;
  } else if (hours < 24) {
    return `${hours} giờ trước`;
  } else {
    return `${days} ngày trước`;
  }
};

// Function to handle user logout
export const handleLogout = (navigate, clearCart) => {
  localStorage.removeItem("isLogged");
  localStorage.removeItem("username");
  localStorage.removeItem("phoneNumber");
  localStorage.removeItem("name");
  localStorage.removeItem("address");
  localStorage.removeItem("avatar");
  localStorage.removeItem("role");
  localStorage.removeItem("token");
  toast.success("Đăng xuất thành công!");
  navigate("/login"); // Redirect to the login page after logging out
  if (typeof clearCart === "function") {
    clearCart(); // Clear cart if a function is provided
  }
};
