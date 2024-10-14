import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOR7X4WDdxBL-U8HCFqvKfGZbE7_kBRp0",
  authDomain: "koideli.firebaseapp.com",
  projectId: "koideli",
  storageBucket: "koideli.appspot.com",
  messagingSenderId: "579548822135",
  appId: "1:579548822135:web:5a11471b4d32b9a5b02472",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export { storage };
