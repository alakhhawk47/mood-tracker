import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Tracker from "../Tracker";

export default function Dashboard() {
  const user = auth.currentUser;

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white relative">

      {/* 🔥 TOP RIGHT PROFILE BAR */}
      <div className="absolute top-6 right-6 flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg z-50">

        {user?.photoURL && (
          <img
            src={user.photoURL}
            alt="profile"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
        )}

        <div className="hidden md:block">
          <p className="font-semibold">{user?.displayName}</p>
          <p className="text-xs opacity-70">{user?.email}</p>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      {/* 🔥 FULL MOOD TRACKER */}
      <Tracker />

    </div>
  );
}