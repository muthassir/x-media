import React, { useState } from 'react';
import logo from "../assets/InShot_20250406_155054086.png"
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const baseURLS = "https://x-media-bvtm.onrender.com"
    // const localHost = "http://localhost:3000"


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${baseURLS}/api/auth/login`, { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div  className='login text-white'>
            <h2>Login</h2>
            {error && <p className='text-red-600 m-3'>{error}</p>}
            <form onSubmit={handleSubmit} className='flex flex-col'>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className='inp'
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className='inp'
                />
                <button type="submit" className=' ml-4 btn'>
                    Login
                </button>
            </form>
            <p className='mt-4'>
                Don't have an account?<Link to="/register"><span className='text-green-700'>Register</span></Link> 
            </p>
            <img src={logo} alt="logo" className='logo' />           
        </div>
    );
};

export default Login;
