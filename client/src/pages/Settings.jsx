import React, { useState } from 'react';
import { User, Bell, Shield, Moon, Save, Check } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Form States
    const [profileData, setProfileData] = useState({
        name: user?.username || '',
        bio: user?.bio || 'Passionate innovator building the future.',
        email: user?.email || ''
    });

    const [notifications, setNotifications] = useState({
        email: true,
        browser: false,
        marketing: false
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSuccessMsg('Profile updated successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        }, 1500);
    };

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'appearance', label: 'Appearance', icon: Moon },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>Settings</h1>

            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'row', padding: 0, overflow: 'hidden', minHeight: '600px' }}>

                {/* Sidebar Navigation */}
                <div style={{
                    width: '280px',
                    padding: '2rem',
                    borderRight: '1px solid var(--glass-border)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: activeTab === tab.id ? 'var(--active-item-bg)' : 'transparent',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontSize: '0.95rem',
                                fontWeight: activeTab === tab.id ? '600' : '500',
                                transition: 'all 0.2s'
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ flex: 1, padding: '3rem' }}>

                    {/* Account Settings */}
                    {activeTab === 'account' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Account Settings</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your profile information and account details.</p>
                            </div>

                            <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Display Name</label>
                                    <input
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                        className="glass-input"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-main)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        disabled
                                        className="glass-input"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                                    />
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Email cannot be changed.</p>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Bio</label>
                                    <textarea
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        rows="4"
                                        className="glass-input"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-main)', resize: 'vertical' }}
                                    />
                                </div>
                                <div style={{ paddingTop: '1rem' }}>
                                    <button className="btn-primary" disabled={loading} style={{ padding: '0.75rem 2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                        {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                                    </button>
                                </div>
                                {successMsg && (
                                    <div style={{ padding: '0.75rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', borderRadius: '8px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <Check size={16} /> {successMsg}
                                    </div>
                                )}
                            </form>
                        </div>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === 'appearance' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Appearance</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Customize how InnoSphere looks on your device.</p>
                            </div>

                            <div style={{ padding: '1.5rem', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', maxWidth: '600px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', fontWeight: '600' }}>Theme Preference</h3>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Switch between dark and light mode.</p>
                                    </div>
                                    <button
                                        onClick={toggleTheme}
                                        style={{
                                            background: 'var(--primary)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {theme === 'dark' ? <><Moon size={16} /> Dark Mode</> : <><Moon size={16} /> Light Mode</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Notifications</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Choose what updates you want to receive.</p>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
                                {Object.entries(notifications).map(([key, value]) => (
                                    <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem', textTransform: 'capitalize', fontWeight: '600' }}>{key} Notifications</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Receive updates via {key}.</p>
                                        </div>
                                        <div
                                            onClick={() => setNotifications({ ...notifications, [key]: !value })}
                                            style={{
                                                width: '44px',
                                                height: '24px',
                                                background: value ? 'var(--primary)' : 'var(--glass-border)',
                                                borderRadius: '999px',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'background 0.2s'
                                            }}
                                        >
                                            <div style={{
                                                width: '18px',
                                                height: '18px',
                                                background: 'white',
                                                borderRadius: '50%',
                                                position: 'absolute',
                                                top: '3px',
                                                left: value ? '23px' : '3px',
                                                transition: 'left 0.2s',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                            }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div>
                            <div style={{ marginBottom: '2rem' }}>
                                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Security</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage your password and account security.</p>
                            </div>

                            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Current Password</label>
                                    <input type="password" placeholder="••••••••" className="glass-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-main)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>New Password</label>
                                    <input type="password" placeholder="••••••••" className="glass-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--input-bg)', color: 'var(--text-main)' }} />
                                </div>
                                <div style={{ paddingTop: '1rem' }}>
                                    <button className="btn-primary" type="button" style={{ padding: '0.75rem 2rem' }}>Update Password</button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Settings;
