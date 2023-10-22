import React, { useEffect, useState } from "react";
import { IonCheckbox, IonPage, useIonToast } from "@ionic/react";
import "./Login.scss";
import { setIsLoggedIn, setUsername, setEmail } from "../data/user/user.actions";
import { connect } from "../data/connect";
import { RouteComponentProps } from "react-router";
import Store from "../helpers/Store";
import axios from 'axios';
import { RESPONSE_INVALID_INFO, RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS } from "../data/constants";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
  setEmail: typeof setEmail;
}

interface LoginProps extends OwnProps, DispatchProps {}

const Login: React.FC<LoginProps> = ({ history }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isRemember, setIsRmemebr] = useState(false);
  const [rememberedData, setRememberedData] = useState({
    email: '',
    password: '',
  });
  const [present] = useIonToast();

  useEffect(() => {
    let isMounted = false;

    const isRemembered = async () => {
      const isRemembered = await Store.get("isRemember");
      if (isRemembered != null) setIsRmemebr(isRemembered);
      if (isRemembered) {
        const email = await Store.get("email");
        const password = await Store.get("password");
        if (isMounted) {
            setRememberedData({ email: email, password: password });
        }
      }
    }

    isRemembered();

    return () => {
      isMounted = false;
    }

  }, [isRemember]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!rememberedData.email) { setEmailError(true); }
    if (!rememberedData.password) { setPasswordError(true); }

    if (rememberedData.email && rememberedData.password) {
      try {

        axios.post(`${process.env.REACT_APP_API}/login.php`, { email: rememberedData.email, password: rememberedData.password })
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
              Store.set("token", token);
              Store.set("role", role);
              if (isRemember) {
                Store.set("isRemember", isRemember);
                Store.set("email", rememberedData.email);
                Store.set("passsword", rememberedData.password);;
              }
              history.push("/home", { direction: "none" });
            } else if (result == RESPONSE_INVALID_TOKEN) {
              history.push("/login", {direction: "none"});
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
          <img src="assets/img/h-logo1.png" alt="Ionic logo" className="m-4 h-12" />
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
            className="p-2 border-2 border-gray-100 rounded-xl w-full block mb-2"
            placeholder="Email"
            value={rememberedData.email}
            onChange={(e) => setRememberedData({ email: e.target.value, password: rememberedData.password })}
            required
          ></input>

          {formSubmitted && emailError && (
            <span className="text-red-400">
              <p className="ion-padding-start">Email is required</p>
            </span>
          )}

          <label htmlFor="email" className="mt-6 mb-2 block">
            Password
          </label>
          <input
            name="password"
            type="password"
            className="p-2 border-2 border-gray-100 rounded-xl w-full block mb-2"
            placeholder="Password"
            value={rememberedData.password}
            onChange={(e) => setRememberedData({ email: rememberedData.email, password: e.target.value })}
            required
          ></input>

          {formSubmitted && passwordError && (
            <span className="text-red-400">
              <p className="ion-padding-start">Password is required</p>
            </span>
          )}

          <div className="flex block mb-2 mt-6 items-center my-auto">
            <input
              name="isRemember"
              type="checkbox"
              checked={isRemember}
              onChange={(e) => setIsRmemebr(!isRemember)}
            ></input>
            <label className="ml-2">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-blue-600 text-white rounded-xl font-bold mt-6"
          >
            Login
          </button>

        </form>
      </div>
      <div className="mb-8 text-center font-bold">
        <span>
          {"Don't have an account? "}
          <span
            className="text-blue-600 font-bold"
            onClick={() => history.push("/signup", { direction: "none" })}
          >
            SignUp
          </span>
        </span>
      </div>
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
