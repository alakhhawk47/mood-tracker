import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC41LyIgPiVCejTbSynDOzdckXTX3oqARA",
  authDomain: "emograph-b8212.firebaseapp.com",
  projectId: "emograph-b8212",
  storageBucket: "emograph-b8212.firebasestorage.app",
  messagingSenderId: "243854228250",
  appId: "1:243854228250:web:7e00bf823c14392bd78aa3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();