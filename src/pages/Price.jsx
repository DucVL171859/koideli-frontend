import React, { Fragment, Suspense } from "react";
import Preloader from "../elements/Preloader";

const Header = React.lazy(() => import("../layout/Home/Header"));
const Price = React.lazy(
  () => import("../layout/Home/Price")
);
const Footer = React.lazy(() => import("../layout/Home/Footer"));

const ProfilePage = () => {
  return (
    <>
      <Fragment>
        <Suspense fallback={<Preloader />}>
          <Header />

          <Price />

          <Footer />
        </Suspense>
      </Fragment>
    </>
  );
};

export default ProfilePage;
