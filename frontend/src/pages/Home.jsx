import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import { AppContent } from '../context/AppContext';
import Tasks from './Tasks';

const Home = () => {

  const { isLoggedIn } = useContext(AppContent);

  return (
    <div>
      <Navbar />

      {isLoggedIn ? (
        <Tasks />
      ) : (
        /* Landing UI */
        <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-100">

          <div className="mb-4 px-4 py-1.5 bg-white/60 backdrop-blur-md border rounded-full text-sm text-indigo-700 shadow">
              Welcome to Primetrade.ai Tasks
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center leading-tight">
              Organize. Track. <span className="text-indigo-600">Achieve.</span>
          </h1>

          <p className="text-gray-600 text-center max-w-xl mt-4 text-lg">
              A modern task management dashboard built for speed, clarity, and productivity.
          </p>

          <div className="flex gap-4 mt-8 flex-wrap justify-center">
              <a href="/login" 
                className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow hover:shadow-lg hover:scale-105 transition">
                Get Started
              </a>

              <a href="/register" 
                className="px-6 py-3 rounded-xl bg-white border border-gray-300 font-semibold shadow hover:bg-gray-100 hover:scale-105 transition">
                Create Account
              </a>
          </div>

        </div>
      )}
    </div>
  );
}

export default Home;
