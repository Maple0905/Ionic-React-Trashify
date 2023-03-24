import React, { useState } from "react";
import { IonPage, IonModal, useIonRouter, IonRadioGroup, IonItem, IonLabel, IonRadio, IonContent } from "@ionic/react";
import "./Login.scss";
import { setIsLoggedIn, setUsername, setEmail } from "../data/user/user.actions";
import { connect } from "../data/connect";
import { RouteComponentProps } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import Store from "../helpers/Store";

interface OwnProps extends RouteComponentProps {}

interface DispatchProps {
  setIsLoggedIn: typeof setIsLoggedIn;
  setUsername: typeof setUsername;
  setEmail: typeof setEmail;
}

interface SignupProps extends OwnProps, DispatchProps {}

const Signup: React.FC<SignupProps> = ({
  setIsLoggedIn,
  history,
  setUsername: setUsernameAction,
  setEmail: setEmailAction,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [tosError, setTosError] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [agree, setAgree] = useState(false);
  const router = useIonRouter();

  const signup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!email) {
      setEmailError(true);
    }
    if (!password) {
      setPasswordError(true);
    }
    if (agree === false) {
      setTosError(true);
    }

    if (email && password && confirmpassword && agree) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API}/auth/verify`,
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          const message = await response.json();
          alert(message.message);
        } else {
          await response.json();
          Store.set("signup", { email, password, role, agree });

          router.push("/signup-complete-profile", "forward", "push");
        }
      } catch (err) {
        alert(err);
        console.log(err);
      }
    }
  };

  const handleGoogle = async () => {
    const result = await GoogleAuth.signIn();
    console.log({ result });
  };

  React.useEffect(() => {
    GoogleAuth.initialize();
    console.log("Google Auth Init");
  }, []);

  return (
    <IonPage id="signup-page">
      <IonContent id="signup-page">
        <div className="flex flex-col">
          <div>
            <img src="assets/img/logo.png" alt="Ionic logo" className="m-4" />
            <h1 className="text-4xl px-4 py-8">Signup</h1>
          </div>

          <form noValidate onSubmit={signup} className="px-4 mb-auto">
            <label htmlFor="email" className="mb-2 block">
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

            <label htmlFor="email" className="mb-2 block mt-8">
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

            <label htmlFor="email" className="mb-2 block mt-8">
              Confirm Password
            </label>
            <input
              name="confirmpassword"
              type="password"
              className="p-2 border-2 border-gray-100 rounded-xl w-full block"
              placeholder="Confirm Password"
              value={confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value!)}
              required
            ></input>

            {password && confirmpassword && password !== confirmpassword && (
              <span className="text-red-400">
                <p className="ion-padding-start">
                  Password and Confirm Password do not match.
                </p>
              </span>
            )}

            <label htmlFor="email" className="mb-2 block mt-8">
              Role
            </label>
            <IonRadioGroup
              name="role"
              value={role}
              className="p-2 border-2 border-gray-100 rounded-xl w-full block"
              // onChange={(e) => setRole(e.target.value)}
              onIonChange={({ detail: { value } }) => setRole(value)}
            >
              <IonItem>
                <IonLabel>Customer</IonLabel>
                <IonRadio value="customer" defaultChecked />
              </IonItem>
              <IonItem>
                <IonLabel>Street Sweeper</IonLabel>
                <IonRadio value="worker" />
              </IonItem>
            </IonRadioGroup>

            <div className="mb-6 text-center mt-8">
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
              <span className="text-red-400">
                <p className="ion-padding-start">
                  You need to agree with our Terms and Conditions
                </p>
              </span>
            )}

            <button
              type="submit"
              className="w-full py-3 mt-2 bg-blue-600 text-white rounded-xl font-bold"
            >
              Signup
            </button>
          </form>
        </div>
        <div className="mx-auto text-center font-bold py-8">
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

        <IonModal isOpen={signupModal}>
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
                href="/signup-phone-number"
                className="w-full my-8 bg-purple-600 text-white py-4 block rounded-xl font-bold"
              >
                Sign up with phone number{" "}
              </a>
              <div>or</div>
              <div
                className="w-full my-4 border-2 py-4 border-gray-300  rounded-xl"
                onClick={handleGoogle}
              >
                Sign up with Google{" "}
              </div>  
              <div className="w-full my-4 border-2 py-4 border-gray-300  rounded-xl">
                Sign up with Apple
              </div>
              <div className="w-full my-4 border-2 py-4 border-gray-300  rounded-xl">
                Sign up with Facebook
              </div>
            </div>
            <div className="fixed top-1 bottom-0 left-1/4 font-bold mb-8">
              <p>
                Already have an account?{" "}
                <span
                  className="py-4 text-purple-600 font-bold"
                  onClick={() => setSignupModal(false)}
                >
                  Signup
                </span>
              </p>
            </div>
          </div>
        </IonModal>
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
