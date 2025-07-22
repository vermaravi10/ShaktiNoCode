import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSwwhD2fgUNSe0n2L1O-W2KQJzAWx5KkQ",
  authDomain: "no-code-auth-fb11c.firebaseapp.com",
  projectId: "no-code-auth-fb11c",
  storageBucket: "no-code-auth-fb11c.firebasestorage.app",
  messagingSenderId: "141347091522",
  appId: "1:141347091522:web:68b12ddd0556d95729a9db",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
