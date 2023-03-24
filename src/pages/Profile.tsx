import React, { useState } from "react";
import { IonContent, IonPage, useIonToast, useIonViewWillEnter } from "@ionic/react";
import { connect } from '../data/connect';
import Header from "../components/Header";
import Store from "../helpers/Store";
import axios from "axios";
import Footer from "../components/Footer";

interface OwnProps { }
interface StateProps {}
interface DispatchProps {}
interface ProfileProps extends OwnProps, StateProps, DispatchProps { };

const Profile: React.FC<ProfileProps> = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  const [language, setLanguage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [present] = useIonToast();

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

          if (result === "success") {
            const token = data.token;
            Store.set("token", token);
            setName(data.name);
            setEmail(data.email);
            setPhoneNumber(data.phone_number);
            setLocation(data.location);
            setLanguage(data.language);
          }
        })
        .catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!name) { setNameError(true); }
    if (!email) { setEmailError(true); }

    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/save-profile.php`, {
          token: token,
          name: name,
          email: email,
          phone_number: phone_number,
          location: location,
          language: language
        }).then((res) => {
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
        }).catch((err) => console.log(err));

    } catch (err) {
      console.log(err);
    }
  };

  useIonViewWillEnter(() => {
    getProfile();
  });

  return (
    <IonPage id="profile-page">

      <Header title="Profile" />

      <IonContent id="profile-page">
        <div className="pt-10 pb-10">
          <form onSubmit={saveProfile} className="text-lg px-6">

            <div className="mt-4">
              <span className="font-semibold">Name</span>
              <input
                name="name"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={phone_number}
                onChange={(e) => setPhoneNumber(e.target.value)}
              ></input>
            </div>

            <div className="mt-4">
              <span className="font-semibold">Address</span>
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
                <option value="1" selected>English</option>
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
