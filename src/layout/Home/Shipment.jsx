import React, { useState, useEffect } from "react";

const ShipmentThree = () => {
  const [shipment, setShipment] = useState({
    quantitySmall: 0, // Number of small fish
    quantityMedium: 0, // Number of medium fish
    quantityLarge: 0, // Number of large fish
    boxes: [],
    estimatedCost: 0,
  });

  const boxCapacity = {
    largeBox: { large: 2, medium: 3, small: 1 }, // 2 large or 3 medium & 1 small
    mediumBox: { large: 1, medium: 1, small: 2 }, // 1 large or 1 medium & 2 small
    smallBox: { large: 0, medium: 1, small: 2 }, // 1 medium or 2 small
  };

  const baseRatePerBox = 20; // Example base cost per box

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShipment({
      ...shipment,
      [name]: parseInt(value),
    });
  };

  const calculateBoxesAndCost = () => {
    let small = shipment.quantitySmall;
    let medium = shipment.quantityMedium;
    let large = shipment.quantityLarge;
    const boxes = [];

    // Calculate how many large boxes are needed
    while (large > 0 || medium > 0 || small > 0) {
      if (large >= 2) {
        boxes.push({ boxSize: "largeBox", large: 2, medium: 0, small: 0 });
        large -= 2;
      } else if (large === 1) {
        boxes.push({ boxSize: "mediumBox", large: 1, medium: 0, small: 0 });
        large -= 1;
      } else if (medium >= 3 && small >= 1) {
        boxes.push({ boxSize: "largeBox", large: 0, medium: 3, small: 1 });
        medium -= 3;
        small -= 1;
      } else if (medium >= 1 && small >= 2) {
        boxes.push({ boxSize: "mediumBox", large: 0, medium: 1, small: 2 });
        medium -= 1;
        small -= 2;
      } else if (medium === 1 && small < 2) {
        boxes.push({ boxSize: "smallBox", large: 0, medium: 1, small: 0 });
        medium -= 1;
      } else if (small >= 2) {
        boxes.push({ boxSize: "smallBox", large: 0, medium: 0, small: 2 });
        small -= 2;
      } else if (small === 1) {
        boxes.push({ boxSize: "smallBox", large: 0, medium: 0, small: 1 });
        small -= 1;
      }
    }

    // Calculate the estimated shipping cost based on the number of boxes
    const estimatedCost = boxes.length * baseRatePerBox;
    setShipment({ ...shipment, boxes, estimatedCost });
  };

  useEffect(() => {
    calculateBoxesAndCost();
  }, [shipment.quantitySmall, shipment.quantityMedium, shipment.quantityLarge]);

  return (
    <>
      <div className="shipment-area style-03">
        <div className="container">
          <div className="row justify-content-start">
            <div className="col-lg-6">
              <div className="shipment-form-wrap">
                <h3 className="title">Tính Toán Dịch Vụ</h3>
                <form id="shipment-form">
                  <div className="personal-data">
                    <div className="row">
                      <div className="col-lg-12">
                        <h4>Thông Tin Cá Koi</h4>
                      </div>
                      <div className="col-lg-4">
                        <div className="form-group">
                          <label>Nhỏ</label>
                          <input
                            type="number"
                            className="form-control"
                            name="quantitySmall"
                            placeholder="Số lượng cá nhỏ"
                            value={shipment.quantitySmall}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="form-group">
                          <label>Vừa</label>
                          <input
                            type="number"
                            className="form-control"
                            name="quantityMedium"
                            placeholder="Số lượng cá vừa"
                            value={shipment.quantityMedium}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="col-lg-4">
                        <div className="form-group">
                          <label>Lớn</label>
                          <input
                            type="number"
                            className="form-control"
                            name="quantityLarge"
                            placeholder="Số lượng cá lớn"
                            value={shipment.quantityLarge}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Estimated Shipping Cost and Number of Boxes */}
                  <div className="submit-shipment">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group">
                          <h4>Hộp cần thiết:</h4>
                          <ul>
                            {shipment.boxes.map((box, index) => (
                              <li key={index}>
                                {box.boxSize} - {box.large} cá lớn, {box.medium} cá vừa, {box.small} cá nhỏ
                              </li>
                            ))}
                          </ul>
                          <h4>Chi phí vận chuyển ước tính: {shipment.estimatedCost} VNĐ</h4>
                        </div>

                        <div className="form-group ">
                          <button type="submit" className="shipment-btn">
                            Yêu Cầu Báo Giá
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-5 d-flex">
              <div className="section-title text-left m-auto">
                <span className="subtitle">Kinh Nghiệm</span>
                <h2 className="title">
                  Chúng Tôi Có Hơn 15 Năm Kinh Nghiệm Trong Vận Chuyển
                </h2>
                <p className="sub-title">
                  Với đội ngũ chuyên nghiệp và quy trình tối ưu, chúng tôi tự hào
                  mang đến dịch vụ vận chuyển hàng đầu cho khách hàng trong suốt 15
                  năm qua.
                </p>
                <div className="btn-wrapper text-left">
                  <a href="#" className="boxed-btn btn-bounce">
                    Liên Hệ Với Chúng Tôi
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShipmentThree;
