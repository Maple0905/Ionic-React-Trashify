import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonContent, IonIcon, IonItem, IonLabel, IonList, IonPage, IonSegment, IonSegmentButton, useIonToast } from '@ionic/react';
import { connect } from '../data/connect';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Store from '../helpers/Store';
import axios from 'axios';
import { RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS, STATUS_COMPLETED } from '../data/constants';
import { documentTextOutline, locationOutline, pricetagOutline } from 'ionicons/icons';
import { RouteComponentProps } from "react-router";
import './RequestsPending.scss';

interface OwnProps extends RouteComponentProps {}
interface StateProps {}
interface DispatchProps {}
interface ListProps extends OwnProps, StateProps, DispatchProps { };

const RequestsCompleted: React.FC<ListProps> = ({ history }) => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState("completed");
  const [present] = useIonToast();

  useEffect(() => {

    let isMounted = true;
    const getCompletedRequests = async () => {
      const token = await Store.get("token");

      try {
        axios.post(`${process.env.REACT_APP_API}/get-requests.php`, { token: token, status: STATUS_COMPLETED })
          .then((res) => {
  
            const data = res.data;
            const result = data.result;
            const msg = data.msg;
  
            present({
              message: msg,
              duration: 1500,
              position: 'bottom'
            });
  
            if (result == RESPONSE_SUCCESS) {
              const token = data.token;
              Store.set("token", token);
              if (isMounted) {
                setRequests(data.requests);
              }
            } else if (result == RESPONSE_INVALID_TOKEN) {
              history.push("/login", {direction: "none"});
            }
          })
          .catch((err) => console.log(err));
  
      } catch (err) {
        console.log(err);
      }
    };

    getCompletedRequests();

    return () => {
      isMounted = false;
    }

  }, []);

  const changeRoute = (link:any) => {
    setPage(link);
    history.push("/requests-" + link, {dicrection: "none"});
  }

  return (
  <IonPage id="requests-page">

    <Header title="Requests" />

    <IonContent class="requests-list">

      <IonSegment value={page} onIonChange={(e:any) => changeRoute(e.detail.value)}>
        <IonSegmentButton value="pending">
          <IonLabel class='tab-bar'>Pending</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="progressing">
          <IonLabel class='tab-bar'>Progressing</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="invoiced">
          <IonLabel class='tab-bar'>Invoiced</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="completed">
          <IonLabel class='tab-bar'>Completed</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      <div className='pb-10'>
        {
          requests.length == 0 ? (
            <div className='pt-5 text-center'>
              <IonLabel color='danger'>There are no requests.</IonLabel>
            </div>
          ) : ('')
        }
        <IonList>
          {requests.map((item:any, index) => (
            <IonItem lines="none" className='py-2' key={`item-${index}`}>
              <IonCard className='w-full' color='light'>
                <IonCardContent className="py-4 w-full flex justify-between">
                  <div className='w-full'>
                    <div className='flex justify-between'>
                      <div className='flex items-center'>
                        <IonIcon icon={locationOutline}></IonIcon>
                        <IonLabel className='pl-2'>{item.location}</IonLabel>
                      </div>
                      <p className='text-blue-600 tab-bar'>Completed</p>
                    </div>
                    <div className='flex mt-1 items-center'>
                      <IonIcon icon={documentTextOutline}></IonIcon>
                      <IonLabel position="fixed" className='pl-2'>{item.description}</IonLabel>
                    </div>
                    <div className='flex mt-1 mb-1 items-center'>
                      <IonIcon icon={pricetagOutline}></IonIcon>
                      <IonLabel className='pl-2'>${item.price}</IonLabel>
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
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
  component: RequestsCompleted
});
