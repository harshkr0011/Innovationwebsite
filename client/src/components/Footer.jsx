import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart, ExternalLink, ArrowRight } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = React.useState('');
    const [status, setStatus] = React.useState('idle'); // idle, loading, success, error
    const [message, setMessage] = React.useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        try {
            setStatus('loading');
            const res = await fetch('http://localhost:5000/api/subscribers/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.msg);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(data.msg || 'Subscription failed');
            }
        } catch (err) {
            console.error('Subscription error:', err);
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        } finally {
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);
        }
    };

    return (
        <footer style={{
            marginTop: 'auto',
            padding: '2rem 2rem 1rem',
            borderTop: '1px solid var(--glass-border)',
            background: 'var(--bg-card)',
            color: 'var(--text-muted)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'left' }}>

                {/* Brand & Social Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '0.25rem', fontSize: '1.25rem', fontWeight: 'bold' }}>InnoSphere</h3>
                        <p style={{ fontSize: '0.85rem', lineHeight: '1.5', maxWidth: '300px' }}>
                            Empowering the next generation of innovators to think, build, and launch the future. Join our global community today.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                            <Github size={18} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#1DA1F2'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                            <Twitter size={18} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#0A66C2'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                            <Linkedin size={18} />
                        </a>
                        <a href="mailto:contact@innosphere.com" style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>
                            <Mail size={18} />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: '600', fontSize: '1rem' }}>Platform</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <li><Link to="/validator" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>AI Idea Validator</Link></li>
                        <li><Link to="/team" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Find Co-founders</Link></li>
                        <li><Link to="/mentors" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Expert Mentors</Link></li>
                        <li><Link to="/grants" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Grant Tracker</Link></li>
                    </ul>
                </div>

                {/* Community */}
                <div>
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: '600', fontSize: '1rem' }}>Community</h4>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                        <li><Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Dashboard</Link></li>
                        <li><Link to="/roadmap" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Roadmap</Link></li>
                        <li><Link to="/open-roles" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}>Open Roles</Link></li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '0.75rem', fontWeight: '600', fontSize: '1rem' }}>Stay Updated</h4>
                    <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>Get the latest updates on grants and tech trends.</p>
                    <form style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }} onSubmit={handleSubscribe}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: 'var(--text-main)',
                                    flex: 1,
                                    outline: 'none',
                                    fontSize: '0.9rem'
                                }}
                                required
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                style={{
                                    background: 'var(--primary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.5rem',
                                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: status === 'loading' ? 0.7 : 1
                                }}
                            >
                                <ArrowRight size={16} />
                            </button>
                        </div>
                        {message && (
                            <p style={{
                                fontSize: '0.8rem',
                                color: status === 'success' ? '#10b981' : '#ef4444',
                                margin: 0
                            }}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </div>

            {/* Bottom Bar */}
            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>Made with</span>
                    <Heart size={14} fill="#ef4444" color="#ef4444" />
                    <span>by the InnoSphere Team</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span>&copy; {new Date().getFullYear()} InnoSphere. All rights reserved.</span>
                    <Link to="/privacy" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Privacy Policy <ExternalLink size={12} /></Link>
                    <Link to="/terms" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>Terms of Service <ExternalLink size={12} /></Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
