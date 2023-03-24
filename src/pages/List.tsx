import React, { useState } from 'react';
import { IonContent, IonItem, IonLabel, IonList, IonPage, useIonToast, useIonViewWillEnter } from '@ionic/react';
import { connect } from '../data/connect';
import './MapView.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Store from '../helpers/Store';
import axios from 'axios';
import { STATUS_PENDING } from '../data/constants';

interface OwnProps {}
interface StateProps {}
interface DispatchProps {}
interface ListProps extends OwnProps, StateProps, DispatchProps { };

const List: React.FC<ListProps> = () => {
  const [requests, setRequests] = useState([]);
  const [present] = useIonToast();

  const getRequests = async () => {
    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/get-requests.php`, { token: token, status: STATUS_PENDING })
        .then((res) => {

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
  <IonPage id="requests-page">

    <Header title="Requests" />

    <IonContent class="requests-list">
      <div className='pt-10 pb-10'>
        <IonList>
          {requests.map((item:any, index) => (
            <IonItem lines="inset" className="flex items-center justify-between py-2">
              <div className="ml-4 w-full flex justify-between" key={`item-${index}`}>
                <IonLabel>{item.location}</IonLabel>
                <IonLabel>{item.description}</IonLabel>
                <IonLabel>${item.price}</IonLabel>
              </div>
            </IonItem>
          ))}
        </IonList>
      </div>
    </IonContent>

    <Footer />

  </IonPage>
)};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: List
});
