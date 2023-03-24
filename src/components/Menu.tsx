import React from "react";
import { RouteComponentProps, withRouter, useLocation } from "react-router";
import { IonAvatar, IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle } from "@ionic/react";
import { home, logOut, settings, timerSharp, person, create } from "ionicons/icons";

import { connect } from "../data/connect";
import { setDarkMode } from "../data/user/user.actions";
import "./Menu.css";

const routes = {

  loggedInPages: [
    { title: "Home", path: "/home", icon: home },
    { title: "Profile", path: "/profile", icon: person },
    { title: "Requests", path: "/requests", icon: timerSharp },
    { title: "Setting", path: "/settings", icon: settings },
    { title: "Submits", path: "/submits", icon: create },
    { title: "Logout", path: "/login", icon: logOut },
  ],
  loggedOutPages: [
    { title: "Home", path: "/home", icon: home },
    { title: "Profile", path: "/profile", icon: person },
    { title: "Requests", path: "/requests", icon: timerSharp },
    { title: "Setting", path: "/settings", icon: settings },
    { title: "Submits", path: "/submits", icon: create },
    { title: "Logout", path: "/login", icon: logOut },
  ],
};

interface Pages {
  title: string;
  path: string;
  icon: string;
  routerDirection?: string;
}

interface StateProps {
  darkMode: boolean;
  isAuthenticated: boolean;
  menuEnabled: boolean;
}

interface DispatchProps {
  setDarkMode: typeof setDarkMode;
}

interface MenuProps extends RouteComponentProps, StateProps, DispatchProps {}

const Menu: React.FC<MenuProps> = ({
  darkMode,
  history,
  isAuthenticated,
  setDarkMode,
  menuEnabled,
}) => {
  const location = useLocation();

  function renderlistItems(list: Pages[]) {
    return list
      .filter((route) => !!route.path)
      .map((p) => (
        <IonMenuToggle key={p.title} auto-hide="false">
          <IonItem
            detail={false}
            routerLink={p.path}
            routerDirection="none"
            className={
              location.pathname.startsWith(p.path) ? "selected" : undefined
            }
          >
            <IonIcon slot="start" icon={p.icon} />
            <IonLabel className="text-xl font-semibold">{p.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  return (
    <IonMenu type="overlay" disabled={!menuEnabled} contentId="main">
      <IonContent forceOverscroll={false}>
        <div className="pt-10">
          <IonAvatar className="w-28 h-28 mx-auto">
            <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </IonAvatar>
        </div>
        <div className="py-5 text-base text-center">
          <span className="text-center">admin@gmail.com</span>
        </div>
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <IonList>
          {isAuthenticated ? renderlistItems(routes.loggedInPages) : renderlistItems(routes.loggedOutPages)}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default connect<{}, StateProps, {}>({
  mapStateToProps: (state) => ({
    darkMode: state.user.darkMode,
    isAuthenticated: state.user.isLoggedin,
    menuEnabled: state.data.menuEnabled,
  }),
  mapDispatchToProps: {
    setDarkMode,
  },
  component: withRouter(Menu),
});
