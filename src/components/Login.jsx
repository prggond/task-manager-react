import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      console.log('Login response:', res.data);

      if (!res.data.token) {
        alert('Invalid credentials');
        return;
      }

      // ✅ Save token + user info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.user.role.toLowerCase());
      localStorage.setItem('user_id', res.data.user.id);

      navigate('/projects');
    } catch(err){
      console.error(err);
      alert('Login failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{maxWidth:'400px', margin:'50px auto'}}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;