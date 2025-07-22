// src/pages/Login.js
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState();
  console.log("🚀 ~ Login ~ err:", err);
  const navigate = useNavigate();

  const loginHandler = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      navigate("/editor");
    } catch (err) {
      const code = err.code?.split("/")[1] || "unknown-error";
      console.log("🚀 ~ loginHandler ~ code:", code);

      const errorMessages = {
        "invalid-email": "Invalid email address.",
        "email-already-in-use": "Email already registered.",
        "weak-password": "Password should be at least 6 characters.",
        "user-not-found": "No account found for this email.",
        "invalid-credential": "Incorrect password.",
        "popup-closed-by-user": "Login popup was closed.",
        "network-request-failed": "Network error. Check your connection.",
        "missing-password": "Please enter a password.",
      };

      const message = errorMessages[code] || "Something went wrong!";
      setErr(message);
    }
  };

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-800 text-white">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-24">
        <div className="max-w-md w-full space-y-6">
          <div>
            <h2 className="text-3xl font-semibold">Log in</h2>
          </div>

          <button
            onClick={googleLogin}
            className="w-full flex items-center justify-center border border-gray-700 rounded-md py-2 hover:bg-gray-900"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="G"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>

          <div className="text-center text-sm text-gray-500">OR</div>

          <div className="space-y-4">
            <input
              className="w-full px-4 py-2 bg-zinc-900 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-600"
              placeholder="Email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full px-4 py-2 bg-zinc-900 border border-gray-700 rounded-md focus:outline-none focus:ring focus:ring-blue-600"
              placeholder="Password"
              type="password"
              onChange={(e) => setPass(e.target.value)}
            />
            {typeof err === "string" && err && (
              <span className="text-red-500 text-sm">{err}</span>
            )}
            <button
              onClick={loginHandler}
              className="w-full bg-white text-black font-semibold py-2 rounded-md hover:opacity-90 transition"
            >
              Log in
            </button>
          </div>

          <div className="text-sm text-center text-gray-500">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:underline">
              Create your account
            </a>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="landing-hero hidden md:flex w-1/2 min-h-screen items-center justify-center relative bg-gradient-to-br from-[#6e57ff] via-[#ed72a5] to-[#f9c88d]">
        <div className="absolute inset-0 backdrop-blur-md bg-black bg-opacity-10 z-10" />
        <div className="z-20 p-8 rounded-lg bg-white/10 backdrop-blur-md shadow-xl">
          <p className="text-white text-lg font-medium">
            Ask Shakti to build web
          </p>
        </div>
      </div>
    </div>
  );
}
