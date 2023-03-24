import React from "react";
import { IonTabBar, IonTabButton } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faHouse } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {

  return (
    <IonTabBar
      slot="bottom"
      className="rounded-t-lg h-14 border-t-2 border-gray-300"
    >
      <IonTabButton tab="create" href="/request-create" className="bg-white">
        <FontAwesomeIcon icon={faHouse} size="2x" />
      </IonTabButton>
      <IonTabButton tab="home" href="/home" className="bg-white">
        <img className="h-full" src="/assets/img/logo-menu.png" alt="menu-logo" />
      </IonTabButton>
      <IonTabButton tab="profile" href="/settings" className="bg-white">
        <FontAwesomeIcon icon={faCog} size="2x" />
      </IonTabButton>
    </IonTabBar>
  );
};

export default Footer;
