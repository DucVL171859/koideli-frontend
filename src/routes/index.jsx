import { createBrowserRouter } from "react-router-dom";
import AdminRoutes from "./AdminRoutes";
import HomeRoutes from "./HomeRoutes";
import LoginRoutes from "./LoginRoutes";
import RegisterRoutes from "./RegisterRoutes";
import SaleRoutes from "./SaleRoutes";
import ManagerRoutes from "./ManagerRoutes";
import DeliveryRoutes from "./DeliveryRoutes";

const router = createBrowserRouter(
  [
    AdminRoutes,
    HomeRoutes,
    LoginRoutes,
    RegisterRoutes,
    SaleRoutes,
    ManagerRoutes,
    DeliveryRoutes,
  ],
  {
    basename: "/",
  }
);

export default router;
