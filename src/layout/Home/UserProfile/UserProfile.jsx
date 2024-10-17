import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation, useNavigate } from "react-router-dom";
import HomeTab from "./HomeTab";
import AboutTab from "./AboutTab";
import SettingTab from "./SettingTab";
import OrdersTab from "./OrdersTab";
import queryString from "query-string";
import "pages/css/style.css";

// Import the getProfileAPI function
import userService from "services/userServices";

const UserProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null); // Initially null to indicate data is not fetched yet
  const [loading, setLoading] = useState(true); // Loading state to show while data is being fetched
  const [activeTab, setActiveTab] = useState("feed");

  // Fetch activeTab from URL query parameters
  useEffect(() => {
    const queryParams = queryString.parse(location.search);
    if (queryParams.activeTab) {
      setActiveTab(queryParams.activeTab);
    }
  }, [location.search]);

  // Fetch the profile data from API on component mount
  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Get the token from sessionStorage

    const fetchUserProfile = async () => {
      try {
        const response = await userService.getProfileAPI(token); // Fetch the profile data
        const profileData = response.data; // Access the profile data
        setProfile(profileData); // Set profile data
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Failed to fetch user profile.");
        setLoading(false); // Stop loading
      }
    };

    fetchUserProfile();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`?activeTab=${tab}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!profile) {
    return <p>Error fetching profile.</p>;
  }

  return (
    <div className="wrapper">
      <div className="profile-banner">
        <div className="hero-cover-block">
          <div className="hero-cover">
            <div className="hero-cover-img">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/feventopia-app.appspot.com/o/avatars%2FproBanner.jpg?alt=media&token=6bf520da-4091-4615-a193-6bb8fbfb490b"
                alt="User Background"
              />
            </div>
          </div>
        </div>
        <div className="user-dt-block">
          <div className="container">
            <div className="row">
              <div className="col-xl-4 col-lg-5 col-md-12">
                <div className="main-card user-left-dt">
                  <div className="user-avatar-img">
                    <img
                      src={
                        profile.urlAvatar ||
                        "https://firebasestorage.googleapis.com/v0/b/feventopia-app.appspot.com/o/avatars%2Flogo-fav.png?alt=media&token=1e771f4e-1d95-4b9a-a133-76bab5aad662"
                      }
                      alt="User Avatar"
                    />
                  </div>
                  <div className="user-dts">
                    <h4 className="user-name">
                      {profile.name}
                      <span className="verify-badge">
                        <i className="fa-solid fa-circle-check" />
                      </span>
                    </h4>
                    <span className="user-email">{profile.email}</span>
                  </div>
                  <div className="user-description">
                    <p>Tớ là {profile.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-xl-8 col-lg-7 col-md-12">
                <div className="right-profile">
                  <div className="profile-tabs">
                    <ul
                      className="nav nav-pills nav-fill p-2 garren-line-tab"
                      id="myTab"
                      role="tablist"
                    >
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "feed" ? "active" : ""
                          }`}
                          id="feed-tab"
                          onClick={() => handleTabClick("feed")}
                        >
                          <i className="fa-solid fa-house" />
                          <strong>Trang cá nhân</strong>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "about" ? "active" : ""
                          }`}
                          id="about-tab"
                          onClick={() => handleTabClick("about")}
                        >
                          <i className="fa-solid fa-circle-info" />
                          <strong>Thông tin tài khoản</strong>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "setting" ? "active" : ""
                          }`}
                          id="setting-tab"
                          onClick={() => handleTabClick("setting")}
                        >
                          <i className="fa-solid fa-gear" />
                          <strong>Cài đặt mật khẩu</strong>
                        </button>
                      </li>
                      <li className="nav-item">
                        <button
                          className={`nav-link ${
                            activeTab === "orders" ? "active" : ""
                          }`}
                          id="orders-tab"
                          onClick={() => handleTabClick("orders")}
                        >
                          <i className="fa-solid fa-box" />
                          <strong>Đơn mua</strong>
                        </button>
                      </li>
                    </ul>
                  </div>

                  <div className="tab-content">
                    {activeTab === "feed" && (
                      <div
                        className="tab-pane fade show active"
                        id="feed"
                        role="tabpanel"
                        aria-labelledby="feed-tab"
                      >
                        <HomeTab />
                      </div>
                    )}
                    {activeTab === "about" && (
                      <div
                        className="tab-pane fade show active"
                        id="about"
                        role="tabpanel"
                        aria-labelledby="about-tab"
                      >
                        <AboutTab profile={profile} setProfile={setProfile} />
                      </div>
                    )}
                    {activeTab === "setting" && (
                      <div
                        className="tab-pane fade show active"
                        id="setting"
                        role="tabpanel"
                        aria-labelledby="setting-tab"
                      >
                        <SettingTab />
                      </div>
                    )}
                    {activeTab === "orders" && (
                      <div
                        className="tab-pane fade show active"
                        id="orders"
                        role="tabpanel"
                        aria-labelledby="orders-tab"
                      >
                        <OrdersTab />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
