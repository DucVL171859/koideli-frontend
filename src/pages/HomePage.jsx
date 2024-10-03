import React, { Fragment, Suspense } from "react";
import Preloader from "../elements/Preloader";

const Header = React.lazy(() => import("../layout/Home/Header"));
const Banner = React.lazy(() => import("../layout/Home/Banner"));
const Solution = React.lazy(() => import("../layout/Home/Solution"));

const Logistics = React.lazy(() => import("../layout/Home/Logistics"));
const Shipment = React.lazy(() => import("../layout/Home/Shipment"));
const Feature = React.lazy(() => import("../layout/Home/Feature"));
const Testimonial = React.lazy(() =>
  import("../layout/Home/Testimonial")
);
const Company = React.lazy(() => import("../layout/Home/Company"));
const Footer = React.lazy(() => import("../layout/Home/Footer"));

const HomePage = () => {
  return (
    <>
      <Fragment>
        <Suspense fallback={<Preloader />}>

          <Header />

          <Banner />
          
          <Logistics />

          <Shipment />

          <Solution />

          <Feature />

          <Testimonial />

          <Company />

          <Footer />
        
        </Suspense>
      </Fragment>
    </>
  );
};

export default HomePage;
