
import { initializeApp,getApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, logEvent } from "firebase/analytics"
//import firebase from "firebase/app";
const firebaseConfig =  initializeApp({
   
  apiKey: "AIzaSyA764C7WdnjFOiwfh9q9nqstrCqA08gvfU",
  authDomain: "social-c7db0.firebaseapp.com",
  projectId: "social-c7db0",
  storageBucket: "social-c7db0.appspot.com",
  messagingSenderId: "782857857583",
  appId: "1:782857857583:web:e080621d0ffb1776d6b4da",
  measurementId: "G-B2S28WESDV"
});


let firebaseApp;
try {
    firebaseApp = getApp();
    console.log(
        'firebaseApp',
    )
} catch (e) {
  firebaseApp = initializeApp(firebaseConfig);
  console.log('firebaseApp', firebaseApp);
}



// Initialize Firebase
//export const app = initializeApp(firebaseConfig);
export const app = firebaseApp
export const storage = getStorage(app);
export const db = getFirestore();
export const auth = getAuth();



export const analytics = () => {
  if (typeof window !== "undefined") {
   //  return firebase.analytics()
    return getAnalytics(app)
  } else {
     return null
  }
}



 //export  const analytics = getAnalytics(app);


export {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
}