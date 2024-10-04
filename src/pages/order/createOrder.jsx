import React, { Fragment, Suspense } from "react";
import Preloader from "../../elements/Preloader";

const Header = React.lazy(() => import("layout/Home/Header"));
const CreateOrder = React.lazy(() => import("layout/Order/CreateOrder"));
const Footer = React.lazy(() => import("layout/Home/Footer"));

const CreateOrderPage = () => {
  return (
    <>
      <Fragment>
        <Suspense fallback={<Preloader />}>
          <Header />

          <CreateOrder />

          <Footer />
        </Suspense>
      </Fragment>
    </>
  );
};

export default CreateOrderPage;
