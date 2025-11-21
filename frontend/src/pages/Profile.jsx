// Profile.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ASSIGNMENT_PDF = "/mnt/data/Frontend Developer Task.pdf";

export default function Profile() {
  const { getUserData } = useContext(AppContent);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  // fetch profile
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`http://localhost:8000/api/user/data`, { withCredentials: true });
      if (data?.success && data.userData) {
        setProfile({
          name: data.userData.name || "",
          email: data.userData.email || "",
        });
      } else {
        setError(data?.message || "Unable to fetch profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    if (!profile.name.trim()) {
      setError("Name is required");
      setSaving(false);
      return;
    }
    if (!profile.email.trim() || !validateEmail(profile.email)) {
      setError("Valid email is required");
      setSaving(false);
      return;
    }

    try {
      const { data } = await axios.put(
        `http://localhost:8000/api/user/update`,
        { name: profile.name, email: profile.email },
        { withCredentials: true }
      );

      if (data?.success) {
        setMessage("Profile updated successfully");
        getUserData?.();
        loadProfile();
      } else {
        setError(data?.message || "Update failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-start justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-2xl">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200 relative">

          {/* BACK TO DASHBOARD BTN */}
          <button
            onClick={() => navigate("/")}
            className="absolute left-4 top-4 text-sm px-3 py-1.5 rounded-lg border border-gray-300 bg-white hover:bg-gray-50"
          >
            ⬅ Back to Dashboard
          </button>

          <h2 className="text-2xl font-semibold text-center mb-6 mt-6">Profile Settings</h2>

          {(message || error) && (
            <div className={`mb-4 p-3 rounded ${message ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              {message || error}
              <button onClick={() => { setMessage(null); setError(null); }} className="ml-3 text-sm">
                <FiX />
              </button>
            </div>
          )}

          <form onSubmit={saveProfile} className="space-y-6">

            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input
                value={profile.name}
                onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                value={profile.email}
                onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex justify-between">
              <button type="button" onClick={loadProfile} className="px-4 py-2 rounded-lg border">
                Reset
              </button>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
