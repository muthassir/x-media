import React from "react";
import logo from "../assets/InShot_20250406_155054086.png"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Loading from "./Loading";

const Register = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const localHost = "http://localhost:3000";
  // const localHost  = "https://x-media-bvtm.onrender.com"
  const [error, setError] = useState("");

 // Login/Register Auth handlers
 const [email, setEmail] = useState("");
 const [username, setUsername] = useState("");
 const [password, setPassword] = useState("");
 //  register auth
 const handleSubmit = async (e) => {
   e.preventDefault();
   setLoading(true)
   try {
     const response = await axios.post(`${localHost}/api/auth/register`, {
       email,
       username,
       password,
     });
     localStorage.setItem("token", response.data.token);
     localStorage.setItem("user", JSON.stringify(response.data.user));
     setLoading(false)
     navigate("/dashboard");
   } catch (err) {
     setError(err.response?.data?.message || "Registration failed");
     setLoading(false)
   }
 };

  return (
    <div className="login text-white flex flex-col justify-center items-center h-screen">
      <h2>Register</h2>
      {error && <p className="text-red-600">{error}</p>}
      {loading ? (
        <Loading/> // Display the loading spinner
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-sm">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="inp mb-3 rounded"
            disabled={loading} // Disable input during loading
          />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="inp mb-3 rounded"
            disabled={loading} // Disable input during loading
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="inp mb-3 rounded"
            disabled={loading} // Disable input during loading
          />
          <button
            type="submit"
            className={`ml-4 btn rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            Register
          </button>
        </form>
      )}
      <div className="mt-4">
        <p>
          Already have an account?{" "}
          <Link to="/">
            <span className="text-green-700 cursor-pointer">Login</span>
          </Link>
        </p>
      </div>
      <img src={logo} alt="logo" className="logo mt-6" />
    </div>
  );
};

export default Register;