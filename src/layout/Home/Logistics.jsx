import React from "react";
import TrackVisibility from "react-on-screen";
import CountUp from "react-countup";
import { FaBoxOpen, FaLayerGroup, FaRssSquare } from "react-icons/fa";

const LogisticsTwo = () => {
  return (
    <>
      {/* Start Logistics area  */}
      <div className='logistics_area style-02 pt-5 pb-0'>
        <div className='container-fluid'>
          <div className='row justify-content-start'>
            <div className='col-lg-6 remove-col-padding'>
              <div className='logistics-image' />
            </div>
            <div className='col-lg-5'>
              <div className='logistics-content'>
                <div className='section-title  text-left'>
                  <span className='subtitle'>Giá Trị Cốt Lõi Của Chúng Tôi</span>
                  <h2 className='title'>Dịch Vụ Vận Chuyển Hàng Đầu Toàn Cầu</h2>
                  <p>
                    Chúng tôi cam kết mang đến cho khách hàng dịch vụ vận chuyển
                    hàng hóa nhanh chóng và an toàn. Đội ngũ chuyên nghiệp và
                    quy trình hiện đại giúp đảm bảo chất lượng và sự hài lòng
                    cho mỗi đơn hàng. Hãy để chúng tôi giúp bạn kết nối với thế
                    giới qua dịch vụ vận chuyển đáng tin cậy.
                  </p>
                </div>
              </div>
              <div className='counterup' id='counterup'>
                <div className='container'>
                  <div className='row'>
                    <div className='col-lg-4 col-md-4 col-sm-4'>
                      <div className='countr wow fadeInLeft'>
                        <div className='couter-icon'>
                          <FaBoxOpen />
                        </div>
                        <TrackVisibility once>
                          {({ isVisible }) =>
                            isVisible && (
                              <span className='counter'>
                                <CountUp delay={0} start={0} end={45789} />
                              </span>
                            )
                          }
                        </TrackVisibility>
                        <h3 className='title'>Gói Hàng Đã Giao</h3>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-sm-4'>
                      <div className='countr wow fadeInUp'>
                        <div className='couter-icon'>
                          <FaLayerGroup />
                        </div>
                        <TrackVisibility once>
                          {({ isVisible }) =>
                            isVisible && (
                              <span className='counter'>
                                <CountUp delay={0} start={0} end={31216} />
                              </span>
                            )
                          }
                        </TrackVisibility>
                        <h3 className='title'>Khách Hàng Quay Lại</h3>
                      </div>
                    </div>
                    <div className='col-lg-4 col-md-4 col-sm-4'>
                      <div className='countr wow fadeInRight'>
                        <div className='couter-icon'>
                          <FaRssSquare />
                        </div>
                        <TrackVisibility once>
                          {({ isVisible }) =>
                            isVisible && (
                              <span className='counter'>
                                <CountUp delay={0} start={0} end={21454} />
                              </span>
                            )
                          }
                        </TrackVisibility>
                        <h3 className='title'>Khách Hàng Của Chúng Tôi</h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Logistics area  */}
    </>
  );
};

export default LogisticsTwo;
