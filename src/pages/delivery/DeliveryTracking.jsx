import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/style.css";
const OrderDetail = () => {
  const navigate = useNavigate();
  const handleAcceptOrder = () => {
    navigate("/delivery/new-delivery");
  };

  const handleRejectOrder = () => {
    console.log("Order rejected");
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Shipment Tracking</h2>
        <div className="search">
          <input type="text" placeholder="Search Shipping ID" />
          <button className="filter-btn">⚙</button>
        </div>
        <div className="shipment-list">
          <div className="shipment-item">
            <div className="shipment-id">
              <span>Shipping ID</span>
              <span>#SP4981241965</span>
              <span className="status shipped">Recived</span>
            </div>
          </div>
          <div className="shipment-item active">
            <div className="shipment-id">
              <span>Shipping ID</span>
              <span>#SP9876543210</span>
              <span className="status in-transit">Destination</span>
            </div>
            <div className="shipment-details">
              <p>
                <strong>23 November 2023, 09:13</strong> - The package has been
                picked up
              </p>
              <p>
                <strong>23 November 2023, 10:17</strong> - The package in
                transit
              </p>
              <p>
                <strong>23 November 2023, 10:42</strong> - The package in
                transit
              </p>
              <p>
                <strong>23 November 2023, 11:20</strong> - The package is in
                transit to its final destination
              </p>
              <div className="carrier">
                <span>Carrier: Devon Lane</span>
                <button className="call-btn">☎</button>
                <button className="message-btn">✉</button>
              </div>
            </div>
          </div>
          <div className="shipment-item">
            <div className="shipment-id">
              <span>Shipping ID</span>
              <span>#SP1683513014</span>
              <span className="status pending">Delivered</span>
            </div>
          </div>
        </div>
      </div>
      <div className="map-section">
        <h3>Live Shipment Tracking</h3>
        {/* Embedded Google Map */}
        <iframe
          id="map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2517.504898641587!2d8.682126515746625!3d50.11092277942965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bda9a0727c6b6f%3A0x111da97ac103b6b1!2sFrankfurt!5e0!3m2!1sen!2sde!4v1602740925638!5m2!1sen!2sde"
          width="100%"
          height={300}
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
        <div className="tracking-info">
          <p>
            <strong>Shipping ID:</strong> #SP9876543210
          </p>
          <p>
            <strong>Status:</strong>Destination
          </p>
          <p>
            <strong>Departure:</strong> Aschaffenburg
          </p>
          <p>
            <strong>Destination:</strong> Frankfurt
          </p>
          <div className="progress-bar">
            <span>Package Shipped</span>
            <div className="progress">
              <div className="progress-fill" />
            </div>
            <span>Estimated Package Received</span>
          </div>
          <p>
            <strong>Total Distance:</strong> 225 km
          </p>
          <p>
            <strong>Est. Delivery Time:</strong> 2h 40m
          </p>
          <p>
            <strong>Total Weight:</strong> 14.5 kg
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
