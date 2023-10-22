import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonTitle, IonToolbar, useIonAlert, useIonToast } from '@ionic/react';
import { connect } from '../data/connect';
import './Submits.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Store from '../helpers/Store';
import axios from 'axios';
import { locationOutline, personOutline } from 'ionicons/icons';
import { RouteComponentProps, useLocation } from 'react-router';
import { RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS } from '../data/constants';

interface OwnProps extends RouteComponentProps {
  request_id?: string;
}
interface StateProps {}
interface DispatchProps {}
interface AppliedProps extends OwnProps, StateProps, DispatchProps { };

const AppliedWorkers: React.FC<AppliedProps> = ({history}) => {

  const [workers, setWorkers] = useState([]);
  const [worker, setWorker] = useState({
    worker_id: '',
    name: '',
    email: '',
    phone_number: '',
    location: '',
    language: '',
  });
  const [request, setRequest] = useState({
    request_id: '',
    location: '',
    price: '',
    description: '',
  });
  const [present] = useIonToast();
  const modal = useRef<HTMLIonModalElement>(null);
  const [presentAlert] = useIonAlert();
  const location = useLocation();

  useEffect(() => {

    let isMounted = true;
    const getAppliedWorkers = async () => {
      const id: string = location.pathname.split("/").pop()??'';
      const token = await Store.get("token");
  
      try {
        axios.post(`${process.env.REACT_APP_API}/get-applied-workers.php`, { token: token, request_id: id })
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
                setRequest(data.request);
                setWorkers(data.workers);
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

    getAppliedWorkers();

    return () => {
      isMounted = false;
    }
  }, []);

  const dismiss = () => {
    modal.current?.dismiss();
  }

  const getWorkerProfile = async (worker_id:any) => {
    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/get-profile.php`, { token: token, worker_id: worker_id})
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
            setWorker(data.profile);
          } else if (result == RESPONSE_INVALID_TOKEN) {
            history.push("/login", {direction: "none"});
          }
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  }

  const acceptRequest = async(request_id:any, worker_id:any) => {
    dismiss();

    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/accept-request.php`, { token: token, request_id: request_id, worker_id: worker_id})
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
            history.push("/requests-progressing", {direction: "none"});
          } else if (result == RESPONSE_INVALID_TOKEN) {
            history.push("/login", {direction: "none"});
          }
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  }

  return (
    <IonPage id="submits-page">

      <Header title="Submits" />

      <IonContent class="ion-padding">

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              Request Detail Information
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="mt-2">
              <div><IonLabel className='font-semibold'>Location</IonLabel></div>
              <div><IonLabel>{request.location}</IonLabel></div>
            </div>

            <div className="mt-2">
              <div><IonLabel className='font-semibold'>Description</IonLabel></div>
              <div><IonLabel>{request.description}</IonLabel></div>
            </div>

            <div className="mt-2">
              <div><IonLabel className='font-semibold'>Price</IonLabel></div>
              <div><IonLabel>${request.price}</IonLabel></div>
            </div>
          </IonCardContent>
        </IonCard>

        {
          workers.length == 0 ? (
            <div className='pt-5 text-center'>
              <IonLabel color='danger'>There are no workers.</IonLabel>
            </div>
          ) : ('')
        }

        <IonList>
          {workers.map((item:any, index) => (
            <IonItem lines="none" className='py-2' key={`item-${index}`}>
              <IonCard className='w-full' color='light'>
                <IonCardContent className="py-4 w-full flex justify-between">
                  <div>
                    <div className='flex items-center'>
                      <IonIcon icon={personOutline}></IonIcon>
                      <IonLabel className='pl-2'>{item.name}</IonLabel>
                    </div>
                    <div className='flex mt-1 items-center'>
                      <IonIcon icon={locationOutline}></IonIcon>
                      <IonLabel className='pl-2'>{item.location}</IonLabel>
                    </div>
                  </div>
                  <div>
                    <IonButton id={'view' + item.worker_id} expand="block" onClick={() => getWorkerProfile(item.worker_id)} size='small'>
                      View
                    </IonButton>
                    <IonButton
                      size='small'
                      onClick={() =>
                        presentAlert({
                          header: 'Are you sure?',
                          buttons: [
                            {
                              text: 'Cancel',
                              role: 'cancel',
                              handler: () => {
                                console.log('cancel');
                              },
                            },
                            {
                              text: 'OK',
                              role: 'confirm',
                              handler: () => {
                                acceptRequest(request.request_id, item.worker_id);
                              },
                            },
                          ],
                        })
                      }
                    >
                      Accept
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
              <IonModal id="example-modal" ref={modal} trigger={'view' + item.worker_id} className="px-2">
                <IonContent>
                  <IonToolbar>
                    <IonTitle>Worker Profile</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => modal.current?.dismiss()}>
                        Close
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>

                  <div className="mt-4 px-4">
                    <div><IonLabel className='font-semibold'>Name</IonLabel></div>
                    <div><IonLabel>{worker.name}</IonLabel></div>
                  </div>

                  <div className="mt-4 px-4">
                    <div><IonLabel className='font-semibold'>Email</IonLabel></div>
                    <div><IonLabel>{worker.email}</IonLabel></div>
                  </div>

                  <div className="mt-4 px-4">
                    <div><IonLabel className='font-semibold'>Phone Number</IonLabel></div>
                    <div><IonLabel>{worker.phone_number}</IonLabel></div>
                  </div>

                  <div className="mt-4 px-4">
                    <div><IonLabel className='font-semibold'>Location</IonLabel></div>
                    <div><IonLabel>{worker.location}</IonLabel></div>
                  </div>

                  <div className="mt-4 px-4">
                    <div><IonLabel className='font-semibold'>Language</IonLabel></div>
                    <div><IonLabel>{worker.language}</IonLabel></div>
                  </div>

                  <div className="my-4 px-4">
                    <IonButton className="w-full" onClick={() => acceptRequest(request.request_id, worker.worker_id)}>
                      Accept
                    </IonButton>
                  </div>

                </IonContent>
              </IonModal>
            </IonItem>
          ))}

        </IonList>

      </IonContent>

      <Footer />

    </IonPage>
)};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: AppliedWorkers
});
