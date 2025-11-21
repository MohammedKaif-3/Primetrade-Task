import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const ResetPasswordOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Email from the previous page
  const emailFromState = location?.state?.email || "";

  const [email] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    if (!email || !otp || !newPassword || !confirm) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        "http://localhost:8000/api/auth/reset-password",
        { email, otp, newPassword }
      );

      if (data.success) {
        setSuccess("Password reset successful!");
        setError("");

        setTimeout(() => {
          navigate("/login");
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
            Verify OTP
          </h2>
          <p className="text-gray-500 text-sm text-center px-6">
            Enter the OTP sent to your email and create a new password.
          </p>
        </div>

        {error && <p className="text-red-500 text-center text-sm mb-3">{error}</p>}
        {success && <p className="text-green-600 text-center text-sm mb-3">{success}</p>}

        {/* Form */}
        <form onSubmit={handleReset} className="space-y-5">

          {/* Email (read-only) */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Email</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-gray-100 border border-gray-300 outline-none text-gray-600"
            />
          </div>

          {/* OTP */}
          <div>
            <label className="text-gray-700 font-medium text-sm">OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Enter 6-digit OTP"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-gray-700 font-medium text-sm">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-gray-700 font-medium text-sm">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-xl shadow hover:shadow-lg hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Back to{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPasswordOtp;
