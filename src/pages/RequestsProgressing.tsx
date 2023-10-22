import React, { useEffect, useRef, useState } from 'react';
import { IonButton, IonButtons, IonCard, IonCardContent, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonModal, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { connect } from '../data/connect';
import './Submits.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Store from '../helpers/Store';
import axios from 'axios';
import { RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS, STATUS_PROGRESSING } from '../data/constants';
import { documentTextOutline, locationOutline, pricetagOutline } from 'ionicons/icons';
import { RouteComponentProps } from 'react-router';

interface OwnProps extends RouteComponentProps {}
interface StateProps {}
interface DispatchProps {}
interface ListProps extends OwnProps, StateProps, DispatchProps { };

const RequestsProgressing: React.FC<ListProps> = ({ history }) => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState("progressing");
  const [role, setRole] = useState("1");
  const [present] = useIonToast();
  const modal = useRef<HTMLIonModalElement>(null);
  const [image1, setImage1] = useState<string | undefined | ArrayBuffer | null>();
  const [image2, setImage2] = useState<string | undefined | ArrayBuffer | null>();
  const [image3, setImage3] = useState<string | undefined | ArrayBuffer | null>();

  useEffect(() => {

    let isMounted = true;

    const getProgressingRequests = async () => {
      const role = await Store.get("role");
      setRole(role);
      const token = await Store.get("token");
  
      try {
        axios.post(`${process.env.REACT_APP_API}/get-requests.php`, { token: token, status: STATUS_PROGRESSING })
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

      getProgressingRequests();

      return () => {
        isMounted = false;
      };

    };
  
  }, []);

  const dismiss = () => {
    modal.current?.dismiss();
  }

  const complete = async (request_id:any) => {
    dismiss();

    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/complete-request.php`, { token: token, request_id: request_id, image1: image1, image2: image2, image3: image3 })
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
            history.push("/requests-invoiced", {direction: "none"});
          } else if (result == RESPONSE_INVALID_TOKEN) {
            history.push("/login", {direction: "none"});
          }
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  }

  const upload1 = (e:any) => {
    let files = e.target.files;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = (event) => {
      setImage1(event.target?.result);
    }
  }

  const upload2 = (e:any) => {
    let files = e.target.files;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = (event) => {
      setImage2(event.target?.result);
    }
  }

  const upload3 = (e:any) => {
    let files = e.target.files;
    let fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = (event) => {
      setImage3(event.target?.result);
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

      <IonSegment value={page} onIonChange={(e:any) => changeRoute(e.detail.value)}>
        <IonSegmentButton value="pending">
          <IonLabel class='tab-bar'>Pending</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="progressing" color='light'>
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
            <IonItem lines="none" className='py-' key={`item-${index}`}>
              <IonCard className='w-full' color='light'>
                <IonCardContent className="py-2 w-full flex justify-between">
                  <div className='w-full'>
                    <div className='flex justify-between'>
                      <div className='flex items-center'>
                        <IonIcon icon={locationOutline}></IonIcon>
                        <IonLabel className='pl-2'>{item.location}</IonLabel>
                      </div>
                      <p className='text-blue-600 tab-bar'>Progressing</p>
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
                        role == "1" ? ('') : (
                          <IonButton id={'view' + item.request_id} expand="block" size='small'>Complete</IonButton>
                        )
                      }
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>

              <IonModal id="progressing-modal" ref={modal} trigger={'view' + item.request_id} className="px-2">
                <IonHeader>
                  <IonToolbar>
                    <IonTitle>Upload Photo</IonTitle>
                    <IonButtons slot="end">
                      <IonButton onClick={() => modal.current?.dismiss()}>
                        Close
                      </IonButton>
                    </IonButtons>
                  </IonToolbar>
                </IonHeader>

                <IonContent>

                  <div className='mt-4 px-4'>
                    <input type='file' name='image1' onChange={(e) => upload1(e)} />
                  </div>

                  <div className='mt-4 px-4'>
                    <input type='file' name='image2' onChange={(e) => upload2(e)} />
                  </div>

                  <div className='mt-4 px-4'>
                    <input type='file' name='image3' onChange={(e) => upload3(e)} />
                  </div>

                  <div className="my-4 px-4">
                    <IonButton className="w-full" onClick={() => complete(item.request_id)}>
                      Complete
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
  component: RequestsProgressing
});
