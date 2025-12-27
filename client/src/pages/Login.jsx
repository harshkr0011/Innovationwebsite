
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            if (localStorage.getItem('token')) {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login failed:', err);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '1.5rem', boxSizing: 'border-box' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Welcome Back</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--input-bg)',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
                            placeholder="student@university.edu"
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--glass-border)',
                                background: 'var(--input-bg)',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Login</button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
