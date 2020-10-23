import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const configDev = {
  apiKey: "AIzaSyDGlfFk7h3azPwK_9HNoKPVpSQV193-60o",
  authDomain: "react-slack-clone-af2b9.firebaseapp.com",
  databaseURL: "https://react-slack-clone-af2b9.firebaseio.com",
  projectId: "react-slack-clone-af2b9",
  storageBucket: "react-slack-clone-af2b9.appspot.com",
  messagingSenderId: "54813501182",
  appId: "1:54813501182:web:101abb88d5d7c2979da7af",
  measurementId: "G-J6X9395LB7",
};
firebase.initializeApp(configDev);
firebase.analytics();

export default firebase;
