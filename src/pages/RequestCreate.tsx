import React, { useState } from "react";
import { IonContent, IonPage, useIonToast } from "@ionic/react";
import { connect } from '../data/connect';
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import Store from "../helpers/Store";
import { RouteComponentProps } from "react-router";
import { RESPONSE_INVALID_TOKEN, RESPONSE_SUCCESS } from "../data/constants";

interface OwnProps extends RouteComponentProps {}
interface StateProps {}
interface DispatchProps {}
interface RequestCreateProps extends OwnProps, StateProps, DispatchProps { };

const RequestCreate: React.FC<RequestCreateProps> = ({history}) => {
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [present] = useIonToast();

  const createRequest = async () => {
    const token = await Store.get("token");

    try {
      axios.post(`${process.env.REACT_APP_API}/create-request.php`, { token: token, location: location, price: price, description: description })
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
            history.push("/requests-pending", {direction: "none"});
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
          <div className="text-lg px-6">
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
              <span className="font-semibold">Price</span>
              <input
                name="price"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></input>
            </div>
            <div className="mt-4">
              <span className="font-semibold">Description</span>
              <textarea
                name="description"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <button className="w-full py-2 mt-10 mb-10 bg-blue-600 text-white rounded-xl font-bold" onClick={() => createRequest()}>
              Request
            </button>
          </div>
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
