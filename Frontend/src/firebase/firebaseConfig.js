import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClOOLRtz5Rr3aohmQdPRQxvC8yN9IcC9k",
  authDomain: "rajagiri-rasi-bakery-rrb.firebaseapp.com",
  projectId: "rajagiri-rasi-bakery-rrb",
  storageBucket: "rajagiri-rasi-bakery-rrb.firebasestorage.app",
  messagingSenderId: "302984639984",
  appId: "1:302984639984:web:07f6b6e9c5306a28741935"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


