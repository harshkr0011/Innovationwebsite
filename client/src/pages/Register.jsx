
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register({ ...formData, username: formData.name });
            if (localStorage.getItem('token')) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', paddingTop: '1rem', boxSizing: 'border-box' }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Join the Platform</h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                            placeholder="John Doe"
                        />
                    </div>

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

                    <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Create Account</button>
                </form>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
