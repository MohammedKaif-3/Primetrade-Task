import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn, userData, setUserData } = useContext(AppContent);
  const [profileOpen, setProfileOpen] = useState(false);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post("http://localhost:8000/api/auth/logout");
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="w-full bg-white/70 backdrop-blur-xl shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <h1 className="text-[22px] font-semibold tracking-tight text-gray-900">
            Primetrade.ai
          </h1>
        </Link>

         {/* CENTER — Links (Desktop) */}
        <ul className="hidden md:flex items-center space-x-10 font-medium text-gray-700">
          <li>
            <Link to="/" className="hover:text-indigo-600 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/" className="hover:text-indigo-600 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/" className="hover:text-indigo-600 transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* RIGHT SECTION (DESKTOP) */}
        <div className="flex items-center gap-6">

          {/* Profile Dropdown */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition"
              >
                <img
                  src={userData?.avatar || "https://api.dicebear.com/9.x/notionists/svg"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full border"
                />
                <i className="ri-arrow-down-s-line text-lg"></i>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded-xl w-48 py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              Login
            </Link>
          )}
        </div>


      </div>


    </nav>
  );
};

export default Navbar;
