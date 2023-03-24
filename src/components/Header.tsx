import React from "react";
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from "@ionic/react";

const Header = (props:any) => {

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton></IonMenuButton>
        </IonButtons>
        <IonTitle>{props?.title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
