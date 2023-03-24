import React from "react";
import { IonContent, IonPage } from "@ionic/react";
import { connect } from '../data/connect';
import Header from "../components/Header";
import Footer from "../components/Footer";

interface OwnProps { }
interface StateProps {}
interface DispatchProps {}
interface RequestCreateProps extends OwnProps, StateProps, DispatchProps { };

const RequestCreate: React.FC<RequestCreateProps> = () => {

  return (
    <IonPage id="request-create-page">

      <Header title="Create Request" />

      <IonContent id="request-create-page">
        <div className="pt-10 pb-10">
          <div className="text-lg px-6">
            <div className="mt-4">
              <span className="font-semibold">Location</span>
              <input
                name="email"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Location"
              ></input>
            </div>
            <div className="mt-4">
              <span className="font-semibold">Price</span>
              <input
                name="name"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Price"
              ></input>
            </div>
            <div className="mt-4">
              <span className="font-semibold">Description</span>
              <textarea
                name="name"
                className="p-2 border-2 border-gray-100 rounded-xl w-full block"
                placeholder="Description"
              ></textarea>
            </div>
            <button className="w-full py-2 mt-10 mb-10 bg-blue-600 text-white rounded-xl font-bold">
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
