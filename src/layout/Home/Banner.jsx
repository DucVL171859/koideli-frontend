import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import KoiFish1 from "assets/img/slide-v3/KoiFish1.webp";
import KoiFish2 from "assets/img/slide-v3/KoiFish2.webp";
import KoiFish3 from "assets/img/slide-v3/KoiFish3.jpg";
import KoiFish4 from "assets/img/slide-v3/KoiFish4.jpg";

const Banner = () => {
  const slider1 = useRef(null);
  const slider2 = useRef(null);

  const [state, setState] = useState({
    nav1: null,
    nav2: null,
  });

  useEffect(() => {
    setState({
      nav1: slider1.current,
      nav2: slider2.current,
    });
  }, []);

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
  };

  return (
    <>
      {/* header start */}
      <div className="home-area home-v3">
        <div className="header-slider header-slider2">
          <Slider
            {...settings}
            asNavFor={state.nav2}
            ref={slider1} // Update ref here
          >
            <div>
              <div
                className="header-bg"
                style={{
                  backgroundImage: `url(${KoiFish1})`,
                }}
              >
                <div className="container">
                  <div className="row header-height justify-content-start">
                    <div className="col-lg-6">
                      <div className="header-inner-wrap">
                        <div className="header-inner">
                          {/* header inner */}
                          <h1 className="title animated slideInRight">
                            Giao hàng Cá Koi Quốc Tế
                          </h1>
                          <p className="sub-title">
                            Cung cấp các loài cá Koi cao cấp đến khắp nơi trên
                            thế giới. Chúng tôi đảm bảo cá đến nơi an toàn, khỏe
                            mạnh và đầy màu sắc. Liên hệ ngay để đặt hàng!
                          </p>
                          <div className="btn-wrapper">
                            <a href="/create-order" className="boxed-btn">
                              <span><strong>Tạo Đơn Hàng</strong></span>
                            </a>
                          </div>
                        </div>
                        {/* //.header inner */}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="right-wrapper">
                        <div className="inner">
                          <h2>
                            Dịch vụ giao hàng Cá Koi cho tất cả các kích cỡ và
                            loại
                          </h2>
                          <div className="list">
                            <ul>
                              <li>
                                Giao hàng nhanh chóng và an toàn đến khắp cả
                                nước
                              </li>
                              <li>Đảm bảo sức khỏe và chất lượng cá Koi</li>
                              <li>
                                Hỗ trợ tư vấn chăm sóc cá Koi sau khi giao hàng
                              </li>
                              <li>Đặt hàng dễ dàng qua hệ thống trực tuyến</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                className="header-bg"
                style={{
                  backgroundImage: `url(${KoiFish2})`,
                }}
              >
                <div className="container">
                  <div className="row header-height justify-content-start">
                    <div className="col-lg-6">
                      <div className="header-inner-wrap">
                        <div className="header-inner">
                          {/* header inner */}
                          <h1 className="title animated slideInRight">
                            Giao Cá Koi Toàn Cầu
                          </h1>
                          <p className="sub-title">
                            Dịch vụ giao cá Koi của chúng tôi kết nối với các
                            nhà cung cấp cá Koi hàng đầu thế giới. Đảm bảo an
                            toàn trong mọi lô hàng cá Koi bạn đặt.
                          </p>
                          <div className="btn-wrapper">
                            <a href="/create-order" className="boxed-btn">
                              <span><strong>Tạo Đơn Hàng</strong></span>
                            </a>
                          </div>
                        </div>
                        {/* //.header inner */}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="right-wrapper">
                        <div className="inner">
                          <h2>
                            Giao Cá Koi với các phương pháp bảo quản tốt nhất
                          </h2>
                          <div className="list">
                            <ul>
                              <li>Hệ thống theo dõi đơn hàng 24/7</li>
                              <li>
                                Bảo quản cá trong môi trường tối ưu trong suốt
                                quá trình vận chuyển
                              </li>
                              <li>Giao hàng nhanh chóng</li>
                              <li>
                                Đội ngũ chuyên gia tư vấn chăm sóc cá sau khi
                                nhận hàng
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                className="header-bg"
                style={{
                  backgroundImage: `url(${KoiFish3})`,
                }}
              >
                <div className="container">
                  <div className="row header-height justify-content-start">
                    <div className="col-lg-6">
                      <div className="header-inner-wrap">
                        <div className="header-inner">
                          {/* header inner */}
                          <h1 className="title animated slideInRight">
                            Dịch vụ giao Cá Koi an toàn
                          </h1>
                          <p className="sub-title">
                            Chúng tôi tự hào về chất lượng dịch vụ và quy trình
                            vận chuyển hiện đại đảm bảo cá của bạn luôn khỏe
                            mạnh và đẹp mắt.
                          </p>
                          <div className="btn-wrapper">
                            <a href="/create-order" className="boxed-btn">
                              <span><strong>Tạo Đơn Hàng</strong></span>
                            </a>
                          </div>
                        </div>
                        {/* //.header inner */}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="right-wrapper">
                        <div className="inner">
                          <h2>
                            Hỗ trợ giao Cá Koi với các chuyên gia có kinh nghiệm
                          </h2>
                          <div className="list">
                            <ul>
                              <li>Hỗ trợ theo dõi cá sau khi nhận hàng</li>
                              <li>Đảm bảo an toàn sinh học</li>
                              <li>
                                Hướng dẫn chi tiết về môi trường sống của cá Koi
                              </li>
                              <li>
                                Tư vấn về dinh dưỡng và chăm sóc cá Koi tối ưu
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div
                className="header-bg"
                style={{
                  backgroundImage: `url(${KoiFish4})`,
                }}
              >
                <div className="container">
                  <div className="row header-height justify-content-start">
                    <div className="col-lg-6">
                      <div className="header-inner-wrap">
                        <div className="header-inner">
                          {/* header inner */}
                          <h1 className="title animated slideInRight">
                            Đặt hàng Cá Koi chất lượng cao
                          </h1>
                          <p className="sub-title">
                            Hãy để chúng tôi giúp bạn mang những chú Cá Koi đẹp
                            nhất về hồ cá của mình. Đảm bảo sức khỏe và độ an
                            toàn cao nhất cho mỗi chú cá.
                          </p>
                          <div className="btn-wrapper">
                            <a href="/create-order" className="boxed-btn">
                              <span><strong>Tạo Đơn Hàng</strong></span>
                            </a>
                          </div>
                        </div>
                        {/* //.header inner */}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="right-wrapper">
                        <div className="inner">
                          <h2>
                            Giao Cá Koi đúng thời gian và địa điểm yêu cầu
                          </h2>
                          <div className="list">
                            <ul>
                              <li>Đặt hàng và theo dõi đơn hàng trực tuyến</li>
                              <li>Quản lý việc giao hàng nhanh chóng</li>
                              <li>Giao cá Koi trực tiếp đến địa chỉ của bạn</li>
                              <li>Hỗ trợ 24/7 qua hotline của chúng tôi</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
      {/* header end */}
    </>
  );
};

export default Banner;
