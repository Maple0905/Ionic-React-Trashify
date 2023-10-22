import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import RequestCreate from "../pages/RequestCreate";
import HomePage from "../pages/HomePage";
import RequestsPending from "../pages/RequestsPending";
import RequestsProgressing from "../pages/RequestsProgressing";
import RequestsInvoiced from "../pages/RequestsInvoiced";
import RequestsCompleted from "../pages/RequestsCompleted";
import AppliedWorkers from "../pages/AppliedWorkers";
import ChangePassword from "../pages/ChangePassword";

const routes = [
  { path: "/home", component: HomePage, exact: true },
  // { path: "/requests", component: List, exact: true },
  { path: "/requests-pending", component: RequestsPending, exact: true },
  { path: "/requests-progressing", component: RequestsProgressing, exact: true },
  { path: "/requests-invoiced", component: RequestsInvoiced, exact: true },
  { path: "/requests-completed", component: RequestsCompleted, exact: true },
  { path: "/profile", component: Profile, exact: true },
  { path: "/settings", component: Settings, exact: true },
  { path: "/change-password", component: ChangePassword, exact: true },
  { path: "/applied-workers/:request_id", component: AppliedWorkers, exact: true },
  { path: "/request-create", component: RequestCreate, exact: true },
];

export default routes;
