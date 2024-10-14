import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";

const Company = () => {
  function SampleNextArrow(props) {
    const { className, onClick } = props;
    return <FaArrowLeft className={className} onClick={onClick} />;
  }
  function SamplePrevArrow(props) {
    const { className, onClick } = props;
    return <FaArrowRight className={className} onClick={onClick} />;
  }

  const settings = {
    dots: false,
    arrows: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: false,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <>
      {/* company area start  */}
      <div className="company-area">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <div className="company-carousel">
                <Slider {...settings}>
                  <div className="single-carousel-item">
                    <a href="#">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/feventopia-app.appspot.com/o/event-images%2F2020-FPT%20Edu-White.png?alt=media&token=451c0887-9a56-4e0c-b4c6-7c3a1a375959"
                        className="img-fluid"
                        alt="company image"
                      />
                    </a>
                  </div>
                  <div className="single-carousel-item">
                    <a href="#">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/feventopia-app.appspot.com/o/event-images%2FFAT-abt%20(1).png?alt=media&token=3547e3ae-f81b-4298-9a47-73c62d6c1a0d"
                        className="img-fluid"
                        alt="company image"
                      />
                    </a>
                  </div>
                  <div className="single-carousel-item">
                    <a href="#">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/feventopia-app.appspot.com/o/event-images%2FFPT-Retail-Ngang-white.png?alt=media&token=eb9ab319-0aa3-4e87-923d-fa73b826c203"
                        className="img-fluid"
                        alt="company image"
                      />
                    </a>
                  </div>
                  <div className="single-carousel-item">
                    <a href="#">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/feventopia-app.appspot.com/o/event-images%2FFPTU%20GLobal%20trang%20png-05.png?alt=media&token=0e176912-1871-4998-a5c5-0b9184c22d48"
                        className="img-fluid"
                        alt="company image"
                      />
                    </a>
                  </div>
                  <div className="single-carousel-item">
                    <a href="#">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/feventopia-app.appspot.com/o/event-images%2FLOGO-FSB-02%20white.png?alt=media&token=67dd5e22-332f-418c-bd3d-a874b607ff30"
                        className="img-fluid"
                        alt="company image"
                      />
                    </a>
                  </div>
                  <div className="single-carousel-item">
                    <a href="#">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/feventopia-app.appspot.com/o/event-images%2FLogo_White-01.png?alt=media&token=a1bc452a-a59d-4be8-b294-0076777aaec6"
                        className="img-fluid"
                        alt="company image"
                      />
                    </a>
                  </div>
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* company area end */}

      <style jsx>{`
        .single-carousel-item {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .single-carousel-item img {
          max-width: 120px;
          max-height: 80px;
          object-fit: contain;
          margin: 0 auto;
        }

        .company-carousel .slick-slide {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default Company;
