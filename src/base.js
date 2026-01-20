import Rebase from 're-base';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyA3Hh4QWuIJSbMo-cPswPh9wxOMLDEiy0E",
    authDomain: "pot-o--goals.firebaseapp.com",
    databaseURL: "https://pot-o--goals.firebaseio.com",
    projectId: "pot-o--goals",
    storageBucket: "pot-o--goals.appspot.com",
    messagingSenderId: "54070005404",
    appId: "1:54070005404:web:0a4a98657a1566cd36e759",
    measurementId: "G-GYR4RF8NQS",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const base = Rebase.createClass(firebaseApp.database());

//this is a named export
export {firebaseApp}

//this is the default export
export default base;
