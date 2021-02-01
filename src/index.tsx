import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import App from "./App";
import { firebase } from "./firebase";
import reportWebVitals from "./reportWebVitals";
import "normalize.css";
const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  ReactDOM.render(
    <React.StrictMode>
      <RecoilRoot>
        <App initialUserValue={user} />
      </RecoilRoot>
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
