import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        "http://localhost:8000/api/auth/send-reset-otp",
        { email }
      );

      if (data.success) {
        setSuccess("OTP sent to your email");
        setError("");

        // Move to the OTP Verification Page
        setTimeout(() => {
          navigate("/reset-password-otp", { state: { email } });
        }, 1200);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-8">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">P</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Forgot Password
          </h2>
          <p className="text-gray-500 text-sm text-center px-6">
            Enter your registered email and we'll send you an OTP to reset your password.
          </p>
        </div>

        {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-center text-sm mb-3">{success}</p>}

        {/* Form */}
        <form onSubmit={handleSendOtp} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-xl shadow hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgetPassword;
