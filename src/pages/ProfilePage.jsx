import React, { Fragment, Suspense } from "react";
import Preloader from "../elements/Preloader";

const Header = React.lazy(() => import("../layout/Home/Header"));
const UserProfile = React.lazy(
  () => import("../layout/Home/UserProfile/UserProfile")
);
const Footer = React.lazy(() => import("../layout/Home/Footer"));

const ProfilePage = () => {
  return (
    <>
      <Fragment>
        <Suspense fallback={<Preloader />}>
          <Header />

          <UserProfile />

          <Footer />
        </Suspense>
      </Fragment>
    </>
  );
};

export default ProfilePage;
