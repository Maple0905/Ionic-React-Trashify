import React from "react";
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonBackButton } from "@ionic/react";

const Header = (props:any) => {

  let button;
  if (props.title === "Submits" || props.title === "Invoiced Request Detail") {
    button = <IonBackButton></IonBackButton>;
  } else {
    button = <IonMenuButton></IonMenuButton>;
  }

  return (
    <IonHeader>
      <IonToolbar color='tertiary'>
        <IonButtons slot="start">
          {button}
        </IonButtons>
        <IonTitle>{props?.title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
