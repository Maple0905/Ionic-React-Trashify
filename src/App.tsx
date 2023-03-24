import React, { useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import Menu from "./components/Menu";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/tailwind.css";

import "leaflet/dist/leaflet.css";

import { connect } from "./data/connect";
import { AppContextProvider } from "./data/AppContext";
import { loadConfData } from "./data/sessions/sessions.actions";
import {
  setIsLoggedIn,
  setUsername,
  loadUserData,
} from "./data/user/user.actions";
import { createStore } from "./util/store";
import { Schedule } from "./models/Schedule";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import { PrivatePages, PublicPages } from "./routes";
import RedirectToLogin from "./components/RedirectToLogin";
import Auth from "./helpers/Auth";

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <IonicAppConnected />
    </AppContextProvider>
  );
};

interface StateProps {
  darkMode: boolean;
  schedule: Schedule;
}

interface DispatchProps {
  loadConfData: typeof loadConfData;
  loadUserData: typeof loadUserData;
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
}

interface IonicAppProps extends StateProps, DispatchProps {}

const IonicApp: React.FC<IonicAppProps> = ({
  darkMode,
  schedule,
  setIsLoggedIn,
  setUsername,
  loadConfData,
  loadUserData,
}) => {
  useEffect(() => {
    loadUserData();
    loadConfData();
    const setupStore = async () => {
      await createStore("local");
    };

    setupStore();
    // eslint-disable-next-line
  }, []);

  const getRoutes = (routes: any, type: string) => {
    if (type === "private") {
      return routes.map((route: any, index: any) => (
        <PrivateRoute
          key={index}
          exact={route.exact}
          path={route.path}
          // auth={Auth}
          // userProfile={userProfile}
          component={route.component}
        />
      ));
    }

    return routes.map((route: any, index: any) => (
      <PublicRoute
        key={index}
        exact={route.exact}
        // auth={Auth}
        path={route.path}
        component={route.component}
      />
    ));
  };

  return schedule.groups.length === 0 ? (
    <div></div>
  ) : (
    <IonApp className={`${darkMode ? "dark-theme" : ""}`}>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <Menu />
          <IonRouterOutlet id="main">
            <RedirectToLogin
              setIsLoggedIn={setIsLoggedIn}
              setUsername={setUsername}
            />
            {getRoutes(PublicPages, "public")}
            {getRoutes(PrivatePages, "private")}
            {Auth.validate() ? (
              <Redirect to="/login" />
            ) : (
              <Redirect to="/login" />
            )}
          </IonRouterOutlet>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;

const IonicAppConnected = connect<{}, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    schedule: state.data.schedule,
  }),
  mapDispatchToProps: {
    loadConfData,
    loadUserData,
    setIsLoggedIn,
    setUsername,
  },
  component: IonicApp,
});
