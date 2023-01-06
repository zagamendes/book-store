import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDF3uXDNFLVvJUUbkvCj5Uz9O6gaEPskgI",
  authDomain: "bookstore-15b7a.firebaseapp.com",
  projectId: "bookstore-15b7a",
  storageBucket: "bookstore-15b7a.appspot.com",
  messagingSenderId: "956146004383",
  appId: "1:956146004383:web:e5c7d25a02c27a31b54daa",
  measurementId: "G-73M20C8XN8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const Auth = getAuth(app);
export const db = getFirestore(app);
if (window.location.hostname == "localhost") {
  connectFirestoreEmulator(db, "localhost", 8080);
}
export default app;
