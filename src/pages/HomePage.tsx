import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import { IonContent, IonPage } from '@ionic/react';
import { connect } from '../data/connect';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './HomePage.scss';
import Store from '../helpers/Store';
import axios from 'axios';
import { RESPONSE_SUCCESS } from '../data/constants';

interface OwnProps {}

interface StateProps {}

interface DispatchProps {}

interface HomePageProps extends OwnProps, StateProps, DispatchProps {};

const HomePage: React.FC<HomePageProps> = () => {
  const [location, setLocation] = useState({
    current: {
      id: '',
      name: '',
      lat: 0,
      lng: 0,
    },
    locations: []
  });

  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      const token = await Store.get("token");

      try {
        axios.post(`${process.env.REACT_APP_API}/get-location.php`, { token: token })
          .then((res) => {
  
            const data = res.data;
            const result = data.result;
  
            if (result == RESPONSE_SUCCESS) {
              const token = data.token;
              Store.set("token", token);
              if (isMounted) {
                setLocation(data.location);
              }
            }
          })
          .catch((err) => console.log(err));
  
      } catch (err) {
        console.log(err);
      }
    };

    getLocation();

    return () => {
      isMounted = false;
    }
  }, []);

  return (
    <IonPage id="home-page">

      <Header title="Home" />

      <IonContent id="map-view">

        <Map location = {location} />

      </IonContent>

      <Footer />

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
  }),
  component: HomePage,
});
