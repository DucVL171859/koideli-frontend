import { lazy } from "react";
import Loadable from "./../components/Loadable";

const HomeProfile = Loadable(
  lazy(() => import("../pages/ProfilePage"))
);

const ProfileRoutes = {
  path: "/user-profile",
  element: <HomeProfile />,
  // children: [
  //     {
  //       path: "user-profile",
  //       element: <UserProfile />,
  //     },
  // ]
};

export default ProfileRoutes;
