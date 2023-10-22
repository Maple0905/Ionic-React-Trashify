import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { connect } from '../data/connect';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Store from '../helpers/Store';
import axios from 'axios';
import { RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS, STATUS_INVOICED } from '../data/constants';
import { documentTextOutline, locationOutline, pricetagOutline } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';
import './RequestsPending.scss';

declare var Stripe: any;

interface OwnProps extends RouteComponentProps {}
interface StateProps {}
interface DispatchProps {}
interface ListProps extends OwnProps, StateProps, DispatchProps { };

let card: any;
const stripe = new Stripe('pk_test_y25DDrH9CrZMUlLR68gK4ZHa', {
  apiVersion: '2022-11-15'
});

const RequestsInvoiced: React.FC<ListProps> = ({ history }) => {
  const [requests, setRequests] = useState([]);
  const [request, setRequest] = useState({
    request_id: '',
    location: '',
    price: '',
    description: '',
    image1: '',
    image2: '',
    image3: '',
  });
  const [page, setPage] = useState("invoiced");
  const [role, setRole] = useState("1");
  const [present] = useIonToast();
  const modal = useRef<HTMLIonModalElement>(null);
  const [payData, setPayData] = useState({
    request_id: "",
    stripe_id: "",
  });

  useEffect(() => {
    if (payData.stripe_id != "") {
      pay();
    }

    let isMounted = true;

    const getInvoicedRequests = async () => {
      const role = await Store.get("role");
      setRole(role);
      const token = await Store.get("token");
  
      try {
        axios.post(`${process.env.REACT_APP_API}/get-requests.php`, { token: token, status: STATUS_INVOICED })
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

    getInvoicedRequests();
  
    return () => {
      isMounted = false;
    };

  }, [payData]);

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
          setupStripe();
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  }

  const pay = async () => {
    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/pay-request.php`, { token: token, request_id: payData.request_id, stripe_id: payData.stripe_id })
        .then((res) => {
          console.log("data ", res);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  const getPayData = (request_id:any) => {
    stripe.createSource(card).then((result:any) => {
      if (result.error) {
        let errorElement = document.getElementById('card-errors');
        if (errorElement) {
          errorElement.textContent = result.error.message;
        }
      } else {
        setPayData({ request_id: request_id, stripe_id: result.source.id });
      }
    });
  }

  const setupStripe = () => {
    let elements = stripe.elements();

    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    card = elements.create('card', { style: style });
    card.mount('#card-element');

    card.addEventListener('change', (event: any) => {
      let displayError: any = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

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
                <IonCardContent className="py-4 w-full flex justify-between">
                  <div className='w-full'>
                    <div className='flex justify-between'>
                      <div className='flex items-center'>
                        <IonIcon icon={locationOutline}></IonIcon>
                        <IonLabel className='pl-2'>{item.location}</IonLabel>
                      </div>
                      <p className='text-blue-600 tab-bar'>Invoiced</p>
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
                      {
                        role == '1' ? (
                          <IonButton id={'view' + item.request_id} expand="block" onClick={() => getRequestDetail(item.request_id)} size='small'>
                            View
                          </IonButton>
                        ) : ('')
                      }
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonModal id="invoice-modal" ref={modal} trigger={'view' + item.request_id} className="px-2">
                <IonContent>
                  <IonHeader>
                    <IonToolbar>
                      <IonTitle>Invoiced Request Detail</IonTitle>
                      <IonButtons slot="end">
                        <IonButton onClick={() => modal.current?.dismiss()}>
                          Close
                        </IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>

                  <div id="payment" className="mt-4 px-4">
                    <div id="card-element"></div>
                    <div id="card-errors" role="alert"></div>
                    <IonButton onClick={() => getPayData(item.request_id)}>Pay</IonButton>
                  </div>

                  <div className="mt-4 px-4">
                    <img className="w-full" src={`${process.env.REACT_APP_API}/` + request.image1} alt="Image 3" />
                  </div>

                  <div className="mt-4 px-4 flex">
                    <div className="pr-1">
                      <img className="w-full h-40" src={`${process.env.REACT_APP_API}/` + request.image2} alt="Image 1" />
                    </div>
                    <div className="pl-1">
                      <img className="w-full h-40" src={`${process.env.REACT_APP_API}/` + request.image3} alt="Image 2" />
                    </div>
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
  component: RequestsInvoiced
});
