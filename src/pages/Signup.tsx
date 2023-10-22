import React, { useState } from "react";
import { IonPage, IonRadioGroup, IonItem, IonLabel, IonRadio, IonContent, useIonToast } from "@ionic/react";
import "./Login.scss";
import { setIsLoggedIn, setUsername, setEmail } from "../data/user/user.actions";
import { connect } from "../data/connect";
import { RouteComponentProps } from "react-router";
import Store from "../helpers/Store";
import { RESPONSE_INVALID_INFO, RESPONSE_SUCCESS } from "../data/constants";
import axios from "axios";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
  setEmail: typeof setEmail;
}

interface SignupProps extends OwnProps, DispatchProps {}

const Signup: React.FC<SignupProps> = ({ history }) => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("1");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [tosError, setTosError] = useState(false);
  const [agree, setAgree] = useState(false);
  const [present] = useIonToast();

  const signup = async (e:React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!email) { setEmailError(true); }
    if (!password) { setPasswordError(true); }
    if (!agree) { setTosError(true); }

    if (email && password) {
      try {
        axios.post(`${process.env.REACT_APP_API}/register.php`, { name: name, email: email, password: password, role: role })
          .then((res) => {

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
              const role = data.role;
              const email = data.email;
              Store.set("token", token);
              Store.set("role", role);
              Store.set("email", email);
              history.push("/login", { direction: "none" });
            }
          })
          .catch((err) => console.log(err));

      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <IonPage id="signup-page">
      <IonContent id="signup-page">
        <div className="flex flex-col">
          <div>
            <img src="assets/img/h-logo1.png" alt="Ionic logo" className="m-4 h-12" />
            <h1 className="text-4xl px-4 py-8">Signup</h1>
          </div>

          <form noValidate onSubmit={signup} className="px-4 mb-auto">

            {formSubmitted && formError && (
              <span className="text-red-400">
                <p className="mb-5">{formError}</p>
              </span>
            )}

            <label htmlFor="" className="block">
              Name
            </label>
            <input
              name="name"
              className="p-2 border-2 border-gray-100 -xl w-full "
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value!)}
              required
            ></input>

            <label htmlFor="email" className="block mt-6">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="p-2 border-2 border-gray-100 rounded-xl w-full block"
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

            <label htmlFor="email" className="block mt-6">
              Password
            </label>
            <input
              name="password"
              type="password"
              className="p-2 border-2 border-gray-100 rounded-xl w-full block"
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

            <label htmlFor="email" className="block mt-6">
              Role
            </label>
            <IonRadioGroup
              name="role"
              value={role}
              className="p-2 border-2 border-gray-100 rounded-xl w-full block"
              onIonChange={({ detail: { value } }) => setRole(value)}
            >
              <IonItem>
                <IonLabel>Customer</IonLabel>
                <IonRadio value="1" />
              </IonItem>
              <IonItem>
                <IonLabel>Street Sweeper</IonLabel>
                <IonRadio value="2" />
              </IonItem>
            </IonRadioGroup>

            <div className="mb-2 text-center mt-8">
              <p>
                <input
                  type="checkbox"
                  name="agree"
                  value="agree"
                  className="mr-2"
                  onChange={(e) => setAgree(!agree)}
                />
                I agree with Terms of Service and Privacy Policy
              </p>
            </div>

            {formSubmitted && tosError && (
              <span className="text-red-400 text-center">
                <p className="ion-padding-start">
                  You need to agree with our Terms and Conditions
                </p>
              </span>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-6 bg-blue-600 text-white rounded-xl font-bold"
            >
              Signup
            </button>
          </form>
        </div>
        <div className="mx-auto text-center font-bold py-6">
          <p>
            Already have an account?{" "}
            <span
              className="text-blue-600 font-bold"
              onClick={() => history.push("/login", { direction: "none" })}
            >
              Login
            </span>
          </p>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default connect<OwnProps, {}, DispatchProps>({
  mapDispatchToProps: {
    setIsLoggedIn,
    setUsername,
    setEmail,
  },
  component: Signup,
});
