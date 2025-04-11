import React from 'react';
import logo from "../assets/InShot_20250406_155054086.png"
import {  Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Loading from './Loading';

const Login = () => {
  const [loading, setLoading] = useState(false); // State for loading
    const navigate = useNavigate();
    const localHost = "http://localhost:3000";
    // const localHost  = "https://x-media-bvtm.onrender.com"
    const [error, setError] = useState("");

    // Login/Register Auth handlers
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
 

 
  // login auth
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the request starts
    try {
      const response = await axios.post(`${localHost}/api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setLoading(false); // Set loading to false on successful login
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false); // Set loading to false on successful login
    }
  };
  // auth ends
    return (
      <div className='login text-white flex flex-col justify-center items-center h-screen'>
      <h2>Login</h2>
      {error && <p className='text-red-600 m-3'>{error}</p>}
      {loading ? (
        <Loading /> // Display the loading spinner
      ) : (
        <form onSubmit={handleSubmit} className='flex flex-col w-full max-w-sm'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className='inp mb-3 rounded'
            disabled={loading} // Disable input during loading
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className='inp mb-3 rounded'
            disabled={loading} // Disable input during loading
          />
          <button type="submit" className={`ml-4 btn rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
            Login
          </button>
        </form>
      )}
      <p className='mt-4'>
        Don't have an account? <Link to="/register"><span className='text-green-700 cursor-pointer'>Register</span></Link>
      </p>
      <img src={logo} alt="logo" className='logo mt-6' />
    </div>
    );
};

export default Login;
