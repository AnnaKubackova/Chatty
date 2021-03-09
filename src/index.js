import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { Provider } from 'react-redux';
import store from "./store";

const firebaseConfig = {
  apiKey: "AIzaSyCUUpbqMIFV7__XeskMUAjoykWcMBtzAq0",
  authDomain: "web-messenger-23489.firebaseapp.com",
  projectId: "web-messenger-23489",
  storageBucket: "web-messenger-23489.appspot.com",
  messagingSenderId: "534627749842",
  appId: "1:534627749842:web:5ca5f35ff0b9156373020b"
};

firebase.initializeApp(firebaseConfig);

window.store = store;

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);