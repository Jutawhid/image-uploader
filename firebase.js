import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

var firebaseConfig = {
  apiKey: "AIzaSyBTPib--JiS7phRmxpwcBh2fcMEADViIRM",
  authDomain: "reactimage-3eee4.firebaseapp.com",
  databaseURL: "https://reactimage-3eee4-default-rtdb.firebaseio.com",
  projectId: "reactimage-3eee4",
  storageBucket: "reactimage-3eee4.appspot.com",
  messagingSenderId: "780993055556",
  appId: "1:780993055556:web:dcccf7cff204289ea4a511",
  measurementId: "G-W47G01J564"
  };


if(!firebase.apps.length) firebase.initializeApp(firebaseConfig)


const auth  = firebase.auth()
const db = firebase.firestore()
const storage = firebase.storage()
const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

export {auth,db,storage,serverTimestamp}


