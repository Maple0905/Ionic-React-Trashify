import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, useIonAlert, useIonToast } from '@ionic/react';
import { connect } from '../data/connect';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Store from '../helpers/Store';
import axios from 'axios';
import { RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS, STATUS_PENDING } from '../data/constants';
import { Link, RouteComponentProps } from 'react-router-dom';
import { documentTextOutline, locationOutline, pricetagOutline } from 'ionicons/icons';
import './RequestsPending.scss';

interface OwnProps extends RouteComponentProps {}
interface StateProps {}
interface DispatchProps {}
interface ListProps extends OwnProps, StateProps, DispatchProps { };

const RequestsPending: React.FC<ListProps> = ({ history }) => {
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState({
    request_id: '',
    location: '',
    price: '',
    description: '',
  });
  const [page, setPage] = useState("pending");
  const [role, setRole] = useState("1");
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const modal = useRef<HTMLIonModalElement>(null);

  useEffect(() => {
    let isMounted = true;

    const getPendingRequests = async () => {
      const role = await Store.get("role");
      setRole(role);
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
          .catch((err) => {
            console.log(err);
          })
      } catch (err) {
        console.error(err);
      }
    };

    getPendingRequests();

    return () => {
      isMounted = false;
    };

  }, []);

  const dismiss = () => {
    modal.current?.dismiss();
  }

  const getRequestDetail = async (request_id:any) => {
    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/get-request-detail.php`, { token: token, request_id: request_id })
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
            setRequest(data.request);
          } else if (result == RESPONSE_INVALID_TOKEN) {
            history.push("/login", {direction: "none"});
          }
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  }

  const applyRequest = async (request_id:any) => {
    dismiss();

    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/apply-request.php`, { token: token, request_id: request_id})
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
            history.push("/requests-pending", {direction: "none"});
          } else if (result == RESPONSE_INVALID_TOKEN) {
            history.push("/login", {direction: "none"});
          }
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  }

  const changeRoute = (link:any) => {
    setPage(link);
    history.push("/requests-" + link, {dicrection: "none"});
  }

  return (
  <IonPage id="requests-page">

    <Header title="Requests" />

    <IonContent class="requests-list">

      <IonSegment value={page} onIonChange={(e:any) => changeRoute(e.detail.value)} >
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
              {
                role == '1' ? (
                  <IonCardContent className="py-4 w-full flex justify-between">
                    <div className='w-full'>
                      <div className='flex justify-between'>
                        <div className='flex items-center'>
                          <IonIcon icon={locationOutline}></IonIcon>
                          <IonLabel className='pl-2'>{item.location}</IonLabel>
                        </div>
                        <p className='text-blue-600 tab-bar'>Pending</p>
                      </div>
                      <div className='flex mt-1 items-center'>
                        <IonIcon icon={documentTextOutline}></IonIcon>
                        <IonLabel position="fixed" className='pl-2'>{item.description}</IonLabel>
                      </div>
                      <div className='flex justify-between mt-1 mb-1'>
                        <div className='flex items-center'>
                          <IonIcon icon={pricetagOutline}></IonIcon>
                          <IonLabel className='pl-2'>${item.price}</IonLabel>
                        </div>
                        <IonButton size='small'>
                          <Link to={`/applied-workers/${item.request_id}`}>View</Link>
                        </IonButton>
                      </div>
                    </div>
                  </IonCardContent>
                ) : (
                  <IonCardContent className="py-4 w-full flex justify-between">
                    <div>
                      <div className='flex items-center'>
                        <IonIcon icon={locationOutline}></IonIcon>
                        <IonLabel className='pl-2'>{item.location}</IonLabel>
                      </div>
                      <div className='flex mt-1 items-center'>
                        <IonIcon icon={documentTextOutline}></IonIcon>
                        <IonLabel position='fixed' className='pl-2'>{item.description}</IonLabel>
                      </div>
                      <div className='flex mt-1 mb-1 items-center'>
                        <IonIcon icon={pricetagOutline}></IonIcon>
                        <IonLabel className='pl-2'>${item.price}</IonLabel>
                      </div>
                    </div>
                    <div>
                      <IonButton id={'view' + item.request_id} expand="block" onClick={() => getRequestDetail(item.request_id)} size='small'>
                        View
                      </IonButton>
                      <IonButton
                        size='small'
                        disabled={item.apply_flag == '1'}
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
                                  applyRequest(item.request_id);
                                },
                              },
                            ],
                          })
                        }
                      >
                        {
                          item.apply_flag == '0' ? 'Apply' : 'Applied'
                        }
                      </IonButton>
                    </div>
                  </IonCardContent>
                )
              }
              </IonCard>

              <IonModal id="request-modal" ref={modal} trigger={'view' + item.request_id} className="px-2">
                <IonContent>
                  <IonToolbar>
                    <IonTitle>Request Detail</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => modal.current?.dismiss()}>
                        Close
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>

                  <div className="mt-4 px-4">
                    <div><IonLabel className='font-semibold'>Location</IonLabel></div>
                    <div><IonLabel>{request.location}</IonLabel></div>
                  </div>

                  <div className="mt-4 px-4">
                    <div><IonLabel className='font-semibold'>Description</IonLabel></div>
                    <div><IonLabel>{request.description}</IonLabel></div>
                  </div>

                  <div className="mt-4 px-4">
                    <div><IonLabel className='font-semibold'>Price</IonLabel></div>
                    <div><IonLabel>${request.price}</IonLabel></div>
                  </div>

                  <div className="my-4 px-4">
                    <IonButton className="w-full" onClick={() => applyRequest(request.request_id)} disabled={item.apply_flag == '1'}>
                    {
                      item.apply_flag == '0' ? 'Apply' : 'Applied'
                    }
                    </IonButton>
                  </div>

                </IonContent>
              </IonModal>
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
  component: RequestsPending
});
