import React, { useState } from "react";
import { IonPage, IonModal, useIonToast } from "@ionic/react";
import "./Login.scss";
import { setIsLoggedIn, setUsername, setEmail } from "../data/user/user.actions";
import { connect } from "../data/connect";
import { RouteComponentProps } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { set } from "../util/store";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { Plugins } from "@capacitor/core";
import Store from "../helpers/Store";
import axios from 'axios';

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
  setEmail: typeof setEmail;
}

interface LoginProps extends OwnProps, DispatchProps {}

const Login: React.FC<LoginProps> = ({
  setIsLoggedIn,
  history,
  setUsername: setUsernameAction,
  setEmail: setEmailAction,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [present] = useIonToast();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!email) { setEmailError(true); }
    if (!password) { setPasswordError(true); }

    if (email && password) {
      try {

        axios.post(`${process.env.REACT_APP_API}/login.php`, { email: email, password: password })
          .then((res) => {
            const data = res.data;
            const result = data.result;
            const msg = data.msg;

            present({
              message: msg,
              duration: 1500,
              position: 'bottom'
            });

            if (result == "failed") {
              setFormError(msg);
            } else if (result == "success") {
              const token = data.token;
              Store.set("token", token);
              history.push("/home", { direction: "none" });
            }
          })
          .catch((err) => console.log(err));

      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <IonPage id="login-page">
      <div className="flex flex-col">
        <div>
          <img src="assets/img/logo.png" alt="Ionic logo" className="m-4" />
          <h1 className="text-4xl px-4 py-8">Login</h1>
        </div>

        <form noValidate onSubmit={login} className="px-4 text-lg mb-auto">

          {formSubmitted && formError && (
            <span className="text-red-400">
              <p className="mb-5">{formError}</p>
            </span>
          )}

          <label htmlFor="email" className="mb-2 block">
            Email
          </label>
          <input
            name="email"
            type="email"
            className="p-2 border-2 border-gray-100 rounded-xl w-full block mb-8"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value!)}
            required
          ></input>

          {formSubmitted && emailError && (
            <span className="text-red-400">
              <p className="ion-padding-start">Email is required</p>
            </span>
          )}

          <label htmlFor="email" className="mb-2 block">
            Password
          </label>
          <input
            name="password"
            type="password"
            className="p-2 border-2 border-gray-100 rounded-xl w-full block mb-8"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value!)}
            required
          ></input>

          {formSubmitted && passwordError && (
            <span className="text-red-400">
              <p className="ion-padding-start">Password is required</p>
            </span>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-xl font-bold"
          >
            Login
          </button>
        </form>
      </div>
      <div className="mb-8 text-center font-bold">
        <span>
          {"Don't have an account? "}
          <span
            className="py-4 text-blue-600"
            onClick={() => setSignupModal(true)}
          >
            Sign Up
          </span>
        </span>
      </div>

      <IonModal isOpen={signupModal} id="ion-my-modal">
        <div className="p-4">
          <span onClick={() => setSignupModal(false)}>
            <FontAwesomeIcon icon={faClose} size="2x" />
          </span>
        </div>
        <div className="flex flex-col h-screen justify-center p-4 text-center">
          <div className="">
            <img
              src="/assets/img/logo-lg.png"
              alt="logo lg"
              className="object-none mx-auto mb-4"
            />
            <p className="my-4 font-bold">Create an account to continue</p>
            <p>
              By creating an account you agree to our Terms of Service and
              Privacy Policy
            </p>
          </div>
          <div className="mb-auto">
            <a
              href="/signup"
              className="w-full my-8 bg-blue-600 text-white py-3 block rounded-xl font-bold"
            >
              Sign up with email{" "}
            </a>
          </div>
          <div className="font-bold mb-8">
            <p>
              Already have an account?{" "}
              <span
                className="py-4 text-purple-600 font-bold"
                onClick={() => setSignupModal(false)}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setUsername,
    setEmail,
  },
  component: Login,
});
