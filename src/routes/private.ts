import Settings from "../pages/Settings";
import List from "../pages/List";
import Profile from "../pages/Profile";
import RequestCreate from "../pages/RequestCreate";
import Submits from "../pages/Submits";
import HomePage from "../pages/HomePage";

const routes = [
  { path: "/home", component: HomePage, exact: true },
  { path: "/requests", component: List, exact: true },
  { path: "/profile", component: Profile, exact: true },
  { path: "/settings", component: Settings, exact: true },
  { path: "/submits", component: Submits, exact: true },
  { path: "/request-create", component: RequestCreate, exact: true },
];

export default routes;
