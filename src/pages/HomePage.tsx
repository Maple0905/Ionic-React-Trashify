import React from 'react';
import Map from '../components/Map';
import { IonContent, IonPage } from '@ionic/react';
import { Location } from '../models/Location';
import { connect } from '../data/connect';
import * as selectors from '../data/selectors';
import './HomePage.scss';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface OwnProps {}

interface StateProps {
  locations: Location[];
  mapCenter: Location;
}

interface DispatchProps {}

interface HomePageProps extends OwnProps, StateProps, DispatchProps {};

const HomePage: React.FC<HomePageProps> = ({ locations, mapCenter }) => {

  return (
    <IonPage id="home-page">

      <Header title="Home" />
  
      <IonContent class="map-view">
        <Map locations={locations} mapCenter={mapCenter} />
      </IonContent>

      <Footer />

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: (state) => ({
    locations: state.data.locations,
    mapCenter: selectors.mapCenter(state)
  }),
  component: HomePage,
});
