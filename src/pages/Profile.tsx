import React, { useEffect, useState } from "react";
import { IonContent, IonPage, useIonToast } from "@ionic/react";
import { connect } from '../data/connect';
import Header from "../components/Header";
import Store from "../helpers/Store";
import axios from "axios";
import Footer from "../components/Footer";
import { RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS } from "../data/constants";
import { RouteComponentProps } from "react-router";

interface OwnProps extends RouteComponentProps {}
interface StateProps {}
interface DispatchProps {}
interface ProfileProps extends OwnProps, StateProps, DispatchProps { };

const Profile: React.FC<ProfileProps> = ({ history }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone_number: '',
    location: '',
    language: 'English',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [present] = useIonToast();

  useEffect(() => {
    let isMounted = true;
    const getProfile = async () => {
      const token = await Store.get("token");
  
      try {
        axios.post(`${process.env.REACT_APP_API}/get-profile.php`, { token: token })
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
                setProfile(data.profile);
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

    getProfile();

    return () => {
      isMounted = false;
    }
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!profile.name) { setNameError(true); }
    if (!profile.email) { setEmailError(true); }

    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/save-profile.php`, {
          token: token,
          name: profile.name,
          email: profile.email,
          phone_number: profile.phone_number,
          location: profile.location,
          language: profile.language
        }).then((res) => {
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
        }).catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <IonPage id="profile-page">

      <Header title="Profile" />

      <IonContent id="profile-page">
        <div className="pt-2 pb-5">
          <form onSubmit={saveProfile} className="text-lg px-6">

            <div className="mt-4">
              <span className="font-semibold">Name</span>
              <input
                name="name"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Name"
                value={profile.name}
                onChange={(e) => setProfile({name: e.target.value, email: '', phone_number: '', location: '', language: ''})}
                required
              ></input>

              {formSubmitted && nameError && (
                <span className="text-red-400">
                  <p className="ion-padding-start">Name is required</p>
                </span>
              )}

            </div>

            <div className="mt-4">
              <span className="font-semibold">Email</span>
              <input
                name="email"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Email"
                value={profile.email}
                onChange={(e) => setProfile({name: '', email: e.target.value, phone_number: '', location: '', language: ''})}
                required
              ></input>

              {formSubmitted && emailError && (
                <span className="text-red-400">
                  <p className="ion-padding-start">Email is required</p>
                </span>
              )}

            </div>

            <div className="mt-4">
              <span className="font-semibold">Phone Number</span>
              <input
                name="phonenumber"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Phone Number"
                value={profile.phone_number}
                onChange={(e) => setProfile({name: '', email: '', phone_number: e.target.value, location: '', language: ''})}
              ></input>
            </div>

            <div className="mt-4">
              <span className="font-semibold">Address</span>
              <input
                name="location"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Location"
                value={profile.location}
                onChange={(e) => setProfile({name: '', email: '', phone_number: '', location: e.target.value, language: ''})}
              ></input>
            </div>

            <div className="mt-4">
              <span className="font-semibold">Language</span>
              <select
                name="role"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                value={profile.language}
                onChange={(e) => setProfile({name: '', email: '', phone_number: '', location: '', language: e.target.value})}
              >
                <option value="1">English</option>
                <option value="2">Norwegian</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 mt-10 mb-10 bg-blue-600 text-white rounded-xl font-bold">
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
  mapStateToProps: (state) => ({
  }),
  component: Profile
});
