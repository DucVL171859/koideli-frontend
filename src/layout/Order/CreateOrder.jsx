import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

const CreateOrderPage = () => {
  const [order, setOrder] = useState({
    recipientPhone: "",
    recipientName: "",
    address: "",
    district: "",
    ward: "",
    city: "",
    shippingMethod: "express",
    shippingType: "pickup",
    additionalServices: [],
    items: [{ length: 0, quantity: 1, document: "" }],
    estimatedCost: 0,
  });

  // Update order state on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrder({ ...order, [name]: value });
  };

  // Handle changes to fish details
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...order.items];
    updatedItems[index][field] = value;
    setOrder({ ...order, items: updatedItems });
  };

  // Add a new fish entry
  const addItem = () => {
    setOrder({
      ...order,
      items: [...order.items, { length: 0, quantity: 1, document: "" }],
    });
  };

  // Remove a fish entry
  const removeItem = (index) => {
    const updatedItems = order.items.filter((item, idx) => idx !== index);
    setOrder({ ...order, items: updatedItems });
  };

  // Calculate estimated shipping cost
  const calculateShippingCost = () => {
    let totalLength = 0;
    let totalQuantity = 0;

    order.items.forEach((item) => {
      totalLength += parseFloat(item.length) * parseFloat(item.quantity);
      totalQuantity += parseFloat(item.quantity);
    });

    const baseRate = order.shippingMethod === "express" ? 10 : 7; // Example base rate: $10 for express, $7 for eco
    const estimatedCost = totalLength * baseRate + totalQuantity * 5; // Example formula
    setOrder({ ...order, estimatedCost });
  };

  // Recalculate shipping cost whenever item details change
  useEffect(() => {
    calculateShippingCost();
  }, [order.items, order.shippingMethod]);

  return (
    <div className="create-order-page">
      <h2>Tạo đơn hàng</h2>

      <div className="form-section">
        <h3>Người Nhận</h3>
        <input
          type="text"
          placeholder="Nhập số điện thoại khách hàng"
          name="recipientPhone"
          value={order.recipientPhone}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Tên khách hàng"
          name="recipientName"
          value={order.recipientName}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Địa chỉ chi tiết (Tòa nhà/Hẻm/Đường)"
          name="address"
          value={order.address}
          onChange={handleInputChange}
        />
        <div className="address-inputs">
          <input
            type="text"
            placeholder="Đường/Ấp/Khu"
            name="district"
            value={order.district}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Phường/Xã"
            name="ward"
            value={order.ward}
            onChange={handleInputChange}
          />
          <input
            type="text"
            placeholder="Quận/Huyện"
            name="city"
            value={order.city}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Lấy & Giao tận nơi</h3>
        <label>
          <input
            type="radio"
            name="shippingMethod"
            value="express"
            checked={order.shippingMethod === "express"}
            onChange={handleInputChange}
          />
          EXPRESS nhanh {"<"} 20kg
        </label>
        <label>
          <input
            type="radio"
            name="shippingMethod"
            value="eco"
            checked={order.shippingMethod === "eco"}
            onChange={handleInputChange}
          />
          BBS ECO {"≥"} 20kg
        </label>
        <label>
          <input
            type="radio"
            name="shippingType"
            value="pickup"
            checked={order.shippingType === "pickup"}
            onChange={handleInputChange}
          />
          Lấy hàng tận nơi
        </label>
        <label>
          <input
            type="radio"
            name="shippingType"
            value="dropoff"
            checked={order.shippingType === "dropoff"}
            onChange={handleInputChange}
          />
          Gửi hàng bưu cục
        </label>
      </div>

      <div className="form-section">
        <h3>Thông tin Cá Koi</h3>
        {order.items.map((item, index) => (
          <div key={index} className="product-item">
            <input
              type="number"
              placeholder="Chiều dài cá (cm)"
              name={`itemLength-${index}`}
              value={item.length}
              onChange={(e) => handleItemChange(index, "length", e.target.value)}
            />
            <input
              type="number"
              placeholder="Số lượng"
              name={`itemQuantity-${index}`}
              value={item.quantity}
              onChange={(e) =>
                handleItemChange(index, "quantity", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Tài liệu liên quan"
              name={`itemDocument-${index}`}
              value={item.document}
              onChange={(e) =>
                handleItemChange(index, "document", e.target.value)
              }
            />
            <button
              className="delete-item-btn"
              onClick={() => removeItem(index)}
            >
              <FaTrash /> Xóa
            </button>
          </div>
        ))}
        <button onClick={addItem} className="add-item-btn">
          <FaPlus /> Thêm Cá Koi
        </button>
      </div>

      {/* Display Estimated Shipping Cost */}
      <div className="form-section">
        <h3>Chi phí vận chuyển ước tính</h3>
        <p>Tổng chi phí ước tính: {order.estimatedCost} VNĐ</p>
      </div>

      <div className="submit-section">
        <button className="save-draft-btn">Lưu nháp</button>
        <button className="submit-order-btn">Đăng đơn</button>
      </div>
    </div>
  );
};

export default CreateOrderPage;
