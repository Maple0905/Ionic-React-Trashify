import React, { useState } from "react";
import { IonContent, IonPage, useIonToast } from "@ionic/react";
import { connect } from '../data/connect';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import Store from "../helpers/Store";
import { RouteComponentProps } from "react-router";
import { RESPONSE_INVALID_INFO, RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS } from "../data/constants";

interface OwnProps extends RouteComponentProps {}
interface StateProps {}
interface DispatchProps {}
interface RequestCreateProps extends OwnProps, StateProps, DispatchProps { };

const RequestCreate: React.FC<RequestCreateProps> = ({history}) => {
  const [old_password, setOldPassword] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [oldError, setOldError] = useState(false);
  const [newError, setNewError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [matchError, setMatchError] = useState(false);
  const [present] = useIonToast();

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!old_password) setOldError(true);
    if (!new_password) setNewError(true);
    if (!confirm_password) setConfirmError(true);
    if (new_password != confirm_password) setMatchError(true);

    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/change-password.php`, { token: token, old_password: old_password, new_password: new_password })
        .then((res) => {

          debugger;

          const data = res.data;
          const result = data.result;
          const msg = data.msg;

          present({
            message: msg,
            duration: 1500,
            position: 'bottom'
          });

          if (result == RESPONSE_INVALID_INFO) {
            setFormError(msg);
          } else if (result == RESPONSE_SUCCESS) {
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
  }

  return (
    <IonPage id="request-create-page">

      <Header title="Create Request" />

      <IonContent id="request-create-page">
        <div className="pt-5 pb-5">
          <form onSubmit={changePassword} className="text-lg px-6">

            {formSubmitted && formError && (
              <span className="text-red-400">
                <p className="mb-5">{formError}</p>
              </span>
            )}

            <div className="mt-4">
              <span className="font-semibold">Old Password</span>
              <input
                name="old_password"
                type="password"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Old Password"
                value={old_password}
                onChange={(e) => setOldPassword(e.target.value)}
              ></input>

              {formSubmitted && oldError && (
                <span className="text-red-400">
                  <p className="ion-padding-start">Old Password is required</p>
                </span>
              )}

            </div>
            <div className="mt-4">
              <span className="font-semibold">New Password</span>
              <input
                name="new_password"
                type="password"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="New Password"
                value={new_password}
                onChange={(e) => setNewPassword(e.target.value)}
              ></input>

              {formSubmitted && newError && (
                <span className="text-red-400">
                  <p className="ion-padding-start">New Password is required</p>
                </span>
              )}

            </div>
            <div className="mt-4">
              <span className="font-semibold">Confirm Password</span>
              <input
                name="confirmPassword"
                type="password"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Confirm Password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></input>

              {formSubmitted && confirmError && (
                <span className="text-red-400">
                  <p className="ion-padding-start">Confirm Password is required</p>
                </span>
              )}

              {formSubmitted && matchError && (
                <span className="text-red-400">
                  <p className="ion-padding-start">Try again - The passwords you entered don't match.</p>
                </span>
              )}

            </div>
            <button type="submit" className="w-full py-2 mt-10 mb-10 bg-blue-600 text-white rounded-xl font-bold">
              Change Password
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
  component: RequestCreate
});
