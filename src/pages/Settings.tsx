import React, { useEffect, useRef, useState } from "react";
import { IonContent, IonPage, useIonToast } from "@ionic/react";
import { connect } from "../data/connect";
import Header from "../components/Header";
import axios from "axios";
import Store from "../helpers/Store";
import Footer from "../components/Footer";
import "./Settings.scss";
import { RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS } from "../data/constants";
import { RouteComponentProps } from "react-router";

interface OwnProps extends RouteComponentProps {}
interface StateProps {}
interface DispatchProps {}

interface SettingsProps extends OwnProps, StateProps, DispatchProps {}

const Settings: React.FC<SettingsProps> = ({ history }) => {

  const [setting, setSetting] = useState({
    location: '',
    language: '',
    position: {
      lat: '',
      lng: '',
    }
  });
  const [present] = useIonToast();
  const mapEle = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>();

  useEffect(() => {

    let isMounted = true;
    const getSettings = async () => {
      const token = await Store.get("token");
  
      try {
        axios.post(`${process.env.REACT_APP_API}/get-setting.php`, { token: token })
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
                setSetting(data.setting); 
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

    getSettings();

    const lat: number = +setting.position.lat;
    const lng: number = +setting.position.lng;

    const myLatLng = { lat: lat, lng: lng };

    map.current = new google.maps.Map(mapEle.current, {
      center: myLatLng,
      zoom: 12
    });

    map.current.addListener("click", (mapsMouseEvent) => {
      const json = mapsMouseEvent.latLng.toJSON();

      setSetting({
        location: setting.location,
        language: setting.language,
        position: {
          lat: json.lat,
          lng: json.lng
        }
      });
    });

    let infoWindow = new google.maps.InfoWindow({
      content: `<h5>{Hello}</h5>`
    });

    google.maps.event.addListenerOnce(map.current, 'idle', () => {
      if (mapEle.current) {
        mapEle.current.classList.add('setting-show-map');
      }
    });

    let marker = new google.maps.Marker({
      position: myLatLng,
      map: map.current,
      title: "Hello",
    });

    marker.addListener('click', () => {
      infoWindow.open(map.current!, marker);
    });

    return () => {
      isMounted = false;
    };

  }, [setting]);

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/save-setting.php`, { token: token, location: setting.location, language: setting.language, lat: setting.position.lat, lng: setting.position.lng })
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
          } else if (result == RESPONSE_INVALID_TOKEN) {
            history.push("/login", {direction: "none"});
          }
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <IonPage id="settings-page">

      <Header title="Settings" />

      <IonContent id="settings-page">
        <div className="pt-2">
          <div id="form-view" className="pb-5">
            <form noValidate onSubmit={saveSettings} className="text-lg px-6">
              <div className="mt-4">
                <span className="font-semibold">Location</span>
                <input
                  name="location"
                  className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                  placeholder="Location"
                  value={setting.location}
                  onChange={(e) => setSetting({ location: e.target.value, language: setting.language, position: setting.position})}
                ></input>
              </div>
              <div className="mt-4 flex">
                <div className="pr-1">
                  <span className="font-semibold">Latitude</span>
                  <input
                    name="lat"
                    className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                    placeholder="Latitude"
                    value={setting.position.lat}
                    onChange={(e) => setSetting({
                      location: setting.location,
                      language: setting.language,
                      position: {
                        lat: e.target.value,
                        lng: setting.position.lng
                      }
                    })}
                  ></input>
                </div>
                <div className="pl-1">
                  <span className="font-semibold">Longitude</span>
                  <input
                    name="lng"
                    className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                    placeholder="Longitude"
                    value={setting.position.lng}
                    onChange={(e) => setSetting({
                      location: setting.location,
                      language: setting.language,
                      position: {
                        lat: setting.position.lat,
                        lng: e.target.value
                      }
                    })}
                  ></input>
                </div>
              </div>
              <div className="mt-4">
                <span className="font-semibold">Language</span>
                <select
                  name="role"
                  className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                  value={setting.language}
                  onChange={(e) => setSetting({ location: setting.location, language: e.target.value, position: setting.position})}
                >
                  <option value=""></option>
                  <option value="English">English</option>
                  <option value="Norwegian">Norwegian</option>
                </select>
              </div>
              <div id="setting-map-view" className="mt-4">
                <div ref={mapEle} className="setting-map-canvas"></div>
              </div>
              <button
                type="submit"
                className="w-full py-2 mt-10 bg-blue-600 text-white rounded-xl font-bold"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      </IonContent>

      <Footer />

    </IonPage>
  );
};

export default connect<OwnProps, StateProps, DispatchProps>({
  mapStateToProps: () => ({
  }),
  component: Settings,
});
