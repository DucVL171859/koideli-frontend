import React from "react";
import { FaBox, FaMoneyBillAlt, FaShieldAlt, FaTruck } from "react-icons/fa";

const FeatureThree = () => {
  return (
    <>
      {/* Start Our Features area */}
      <div className='features-area style-02'>
        <div className='container'>
          <div className='row justify-content-start'>
            <div className='col-lg-4 offset-lg-1 d-flex'>
              <div className='section-title white text-left m-auto'>
                <span className='subtitles'>Đặc Điểm Nổi Bật</span>
                <h2 className='title active'>Tại Sao Chọn Chúng Tôi!</h2>
                <p className='des'>
                  Chúng tôi cam kết mang lại dịch vụ vận chuyển chuyên nghiệp
                  và minh bạch. Với đội ngũ giàu kinh nghiệm và quy trình hiện
                  đại, chúng tôi đảm bảo sự hài lòng của khách hàng trong mỗi
                  lần hợp tác.
                </p>
                <div className='btn-wrapper animated fadeInUpBig text-left'>
                  <a href='#' className='boxed-btn btn-bounce mt-3'>
                    Liên Hệ Với Chúng Tôi
                  </a>
                </div>
              </div>
            </div>
            <div className='col-lg-6'>
              <div className='features-item'>
                <div className='row'>
                  <div className='col-lg-6'>
                    <div className='single-features-item'>
                      <div className='icon'>
                        <FaMoneyBillAlt />
                      </div>
                      <h4>Giá Cả Minh Bạch</h4>
                    </div>
                    <div className='single-features-item'>
                      <div className='icon'>
                        <FaTruck />
                      </div>
                      <h4>Kho Bãi Lưu Trữ</h4>
                    </div>
                  </div>
                  <div className='col-lg-6 mg-top-60'>
                    <div className='single-features-item'>
                      <div className='icon'>
                        <FaBox />
                      </div>
                      <h4>Theo Dõi Thời Gian Thực</h4>
                    </div>
                    <div className='single-features-item'>
                      <div className='icon'>
                        <FaShieldAlt />
                      </div>
                      <h4>Bảo Mật Hàng Hóa</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Our Features area */}
    </>
  );
};

export default FeatureThree;
