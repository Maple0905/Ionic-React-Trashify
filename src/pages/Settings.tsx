import React, { useState } from "react";
import { IonContent, IonPage, IonToggle, useIonToast, useIonViewWillEnter } from "@ionic/react";
import { connect } from "../data/connect";
import Header from "../components/Header";
import axios from "axios";
import Store from "../helpers/Store";
import Footer from "../components/Footer";

interface OwnProps {}

interface StateProps {}

interface DispatchProps {}

interface SettingsProps extends OwnProps, StateProps, DispatchProps {}

const Settings: React.FC<SettingsProps> = () => {

  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState(false);
  const [present] = useIonToast();

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

          if (result === "success") {
            const token = data.token;
            Store.set("token", token);
            setLocation(data.location);
            setLanguage(data.language);
          }
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  };

  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/save-setting.php`, { token: token, location: location, language: language })
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
          }
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  };

  useIonViewWillEnter(() => {
    getSettings();
  });

  return (
    <IonPage id="settings-page">

      <Header title="Settings" />

      <IonContent id="settings-page">
        <div className="pt-10 pb-10">
          <form noValidate onSubmit={saveSettings} className="text-lg px-6">
            <div className="mt-4">
              <span className="font-semibold">Location</span>
              <input
                name="location"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              ></input>
            </div>
            <div className="mt-4">
              <span className="font-semibold">Language</span>
              <select
                name="role"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value=""></option>
                <option value="English">English</option>
                <option value="Norwegian">Norwegian</option>
              </select>
            </div>
              <div className="mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Status</span>
                  <div><IonToggle color="primary" checked={status} onChange={(e) => setStatus(!status)} /></div>
                </div>
              </div>
            <button
              type="submit"
              className="w-full py-2 mt-10 bg-blue-600 text-white rounded-xl font-bold"
            >
              Save
            </button>
          </form>
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
