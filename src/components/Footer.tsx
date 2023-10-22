import React, { useState } from "react";
import { IonTabBar, IonTabButton, useIonViewDidEnter } from "@ionic/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faNewspaper } from "@fortawesome/free-solid-svg-icons";
import Store from "../helpers/Store";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  const [role, setRole] = useState("1");

  const getRole = async () => {
    const role = await Store.get("role");
    setRole(role);
  }

  useIonViewDidEnter(() => {
    getRole();
  });

  return (
    <IonTabBar
      slot="bottom"
      className="rounded-t-lg h-14 border-t-2 border-gray-300"
    >
      <IonTabButton tab="create" href={role == '1' ? '/request-create' : '/requests-pending'} className="bg-white">
        <FontAwesomeIcon icon={faAdd} size="2x" />
      </IonTabButton>
      <IonTabButton tab="home" href="/home" className="bg-white">
        <img className="h-full py-2" src="/assets/img/pin1.png" alt="menu-logo" />
      </IonTabButton>
      <IonTabButton tab="profile" href="/settings" className="bg-white">
        <FontAwesomeIcon icon={faCog} size="2x" />
      </IonTabButton>
    </IonTabBar>
  );
};

export default Footer;
