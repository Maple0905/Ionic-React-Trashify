import React, { useRef, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonItem, IonLabel, IonList, IonModal, IonPage, IonTitle, IonToolbar, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { connect } from '../data/connect';
import './Submits.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Store from '../helpers/Store';
import axios from 'axios';
import { STATUS_PENDING } from '../data/constants';

interface OwnProps { }
interface StateProps {}
interface DispatchProps {}
interface SubmitsProps extends OwnProps, StateProps, DispatchProps { };

const Submits: React.FC<SubmitsProps> = () => {

  const [requests, setRequests] = useState([]);
  const [present] = useIonToast();

  const modal = useRef<HTMLIonModalElement>(null);

  const dismiss = () => {
    modal.current?.dismiss();
  }

  const getRequests = async () => {
    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/get-requests.php`, { token: token, status: STATUS_PENDING })
        .then((res) => {

          debugger;

          const data = res.data;
          const result = data.result;
          const msg = data.msg;

          present({
            message: msg,
            duration: 1500,
            position: 'bottom'
          });

          if (result === "success") {
            const token = data.token;
            Store.set("token", token);
            setRequests(data.requests);
          }
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  };

  useIonViewWillEnter(() => {
    getRequests();
  });

  return (
    <IonPage id="submits-page">

      <Header title="Submits" />

      <IonContent class="ion-padding">

        <div className='pt-10 pb-10'>
          <IonList>
            {requests.map((item:any, index) => (
              <IonItem lines="inset" className="flex items-center justify-between py-2">
                <div className="ml-4 w-full flex justify-between" key={`item-${index}`}>
                  <div className="">
                    <IonLabel>{item.location}</IonLabel>
                    <IonLabel>{item.description}</IonLabel>
                    <IonLabel>${item.price}</IonLabel>
                  </div>
                  <div className="">
                    <IonButton id="view-modal" expand="block" className="">
                      View
                    </IonButton>
                    <IonButton id="open-modal" expand="block" className="">
                      Accept
                    </IonButton>
                  </div>
                </div>
              </IonItem>
            ))}
          </IonList>
        </div>

        <IonModal id="example-modal" ref={modal} trigger="open-modal" className='px-2'>
          <IonContent scroll-y="false">
            <IonToolbar>
              <IonTitle>Request</IonTitle>
              <IonButtons slot='end'>
                <IonButton color='light' onClick={() => dismiss()}>
                  close
                </IonButton>
              </IonButtons>
            </IonToolbar>

          </IonContent>
        </IonModal>

      </IonContent>

      <Footer />

    </IonPage>
)};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: Submits
});
