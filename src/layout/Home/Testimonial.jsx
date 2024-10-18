import React from "react";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";
import Slider from "react-slick";

const Testimonial = () => {
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return <FaArrowRight className={className} onClick={onClick} />;
  }
  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return <FaArrowLeft className={className} onClick={onClick} />;
  }

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <>
      {/* Start Testimonial area  */}
      <div className="testimonial-area-3">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 d-flex">
              <div className="section-title text-left m-auto">
                <h2 className="title">Đánh Giá Khách Hàng</h2>
                <p>
                  Chúng tôi rất vui mừng được phục vụ các khách hàng trên toàn
                  cầu và nhận được những phản hồi tích cực. Mỗi đánh giá giúp
                  chúng tôi cải thiện và phát triển dịch vụ của mình.
                </p>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="review-area style-01">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="testimonial-slider">
                      <Slider {...settings}>
                        <div className="single-review">
                          <div className="single-review-item">
                            <div className="review-head">
                              <div
                                className="thumb"

                              >
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/koideli.appspot.com/o/comp%2Fkoideli-logo.png?alt=media&token=a6cded0e-67fb-4121-a71b-8ce741f4d411"
                                  alt="Hình ảnh khách hàng"
                                />
                              </div>
                              <div className="author-details">
                                <h5 className="author">AnhPH</h5>
                                <span className="post">QuangVL</span>
                                <ul className="rating">
                                  <li>
                                    <FaStar />
                                  </li>
                                  <li>
                                    <FaStar />
                                  </li>
                                  <li>
                                    <FaStar />
                                  </li>
                                  <li>
                                    <FaStar />
                                  </li>
                                  <li>
                                    <FaStar />
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="description">
                              <p>
                                Tôi rất hài lòng với dịch vụ giao hàng này. Cá
                                của tôi được giao đúng thời gian và trong tình
                                trạng rất tốt. Tôi chắc chắn sẽ tiếp tục sử dụng
                                dịch vụ này trong tương lai.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* You can duplicate the review items for more testimonials */}
                        <div className="single-review">
                          <div className="single-review-item">
                            <div className="review-head">
                              <div className="thumb">
                                <img
                                  src="https://firebasestorage.googleapis.com/v0/b/koideli.appspot.com/o/comp%2Fkoideli-logo.png?alt=media&token=a6cded0e-67fb-4121-a71b-8ce741f4d411"
                                  alt="Hình ảnh khách hàng"
                                />
                              </div>
                              <div className="author-details">
                                <h5 className="author">QuangBH</h5>
                                <span className="post">DucVL</span>
                                <ul className="rating">
                                  <li>
                                    <FaStar />
                                  </li>
                                  <li>
                                    <FaStar />
                                  </li>
                                  <li>
                                    <FaStar />
                                  </li>
                                  <li>
                                    <FaStar />
                                  </li>
                                  <li>
                                    <FaStar />
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="description">
                              <p>
                                Dịch vụ tuyệt vời! Giao hàng nhanh chóng và hỗ
                                trợ tận tình. Tôi rất ấn tượng với sự chuyên
                                nghiệp và chất lượng dịch vụ.
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* More testimonials can be added here */}
                      </Slider>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Testimonial area */}
    </>
  );
};

export default Testimonial;
