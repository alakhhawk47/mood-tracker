import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

 return (
  <div className="min-h-screen flex">

    {/* 🔵 LEFT IMAGE SECTION */}
    <div className="w-1/2 hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700">
      
      <img
        src="https://img.sanishtech.com/u/a96c63653b52ff66a0d94f356a8ca2f7.jpg"
        alt="login visual"
        className="w-[80%] max-w-md rounded-2xl shadow-2xl"
      />

    </div>


    {/* ⚪ RIGHT LOGIN SECTION */}
    <div className="w-full md:w-1/2 flex items-center justify-center bg-white dark:bg-[#020617]">

      <div className="w-full max-w-md p-8">

        <h2 className="text-3xl font-bold mb-2 text-center text-white">
          Welcome Back 
        </h2>

        <p className="text-center opacity-60 mb-6 text-white">
          Login to access your EmoGraph dashboard
        </p>

        {/* GOOGLE LOGIN BUTTON */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl shadow-lg font-semibold transition"
        >
          Sign in with Google
        </button>

      </div>
    </div>
  </div>
 )
};