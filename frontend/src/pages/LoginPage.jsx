import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../context/AppContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email and password are required!");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
        navigate("/");
      } else {
        setError(data.message === "Invalid Email" ? "No account found!" : "Incorrect password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-8">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-3">Welcome Back</h2>
          <p className="text-gray-500 text-sm">Login to your account</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-3 text-center">{error}</p>}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* Email Field */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Password</label>
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Forgot Password */}
          <p className="text-right text-sm text-indigo-600 hover:underline cursor-pointer">
            <Link to="/reset-password">Forgot password?</Link>
          </p>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-xl shadow hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
