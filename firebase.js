// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDOcV3lXhnyXgTUvtNHNXhpe9Td687p96s",
  authDomain: "flashcardsaas-ca254.firebaseapp.com",
  projectId: "flashcardsaas-ca254",
  storageBucket: "flashcardsaas-ca254.appspot.com",
  messagingSenderId: "906650746273",
  appId: "1:906650746273:web:f01ea1193368ec11089fe0",
  measurementId: "G-6K9JR8J3N5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Conditionally initialize Analytics only if it's supported and in a browser environment
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

export { db };
