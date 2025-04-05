import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div  className='login'>
            <h1>WebX</h1>
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
        </div>
    );
};

export default Login;