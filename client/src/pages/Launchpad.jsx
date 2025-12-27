import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, ThumbsUp, MessageSquare, Rocket, ExternalLink, Plus, X, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Launchpad = () => {
    const { user, isAuthenticated } = useAuth();
    const [launches, setLaunches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('popular'); // 'popular' or 'new'
    const [searchTerm, setSearchTerm] = useState('');
    const [showLaunchModal, setShowLaunchModal] = useState(false);

    // Launch Form State
    const [myProjects, setMyProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [launchForm, setLaunchForm] = useState({
        tagline: '',
        description: '',
        tags: '',
        websiteUrl: ''
    });

    useEffect(() => {
        fetchLaunches();
    }, []);

    // Auto-populate form when project is selected
    useEffect(() => {
        if (selectedProject) {
            const proj = myProjects.find(p => p._id === selectedProject);
            if (proj) {
                setLaunchForm(prev => ({
                    ...prev,
                    description: proj.description || '',
                    tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : (proj.tags || ''),
                    websiteUrl: proj.link || proj.github || ''
                }));
            }
        }
    }, [selectedProject, myProjects]);

    const fetchLaunches = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/launch');
            const data = await res.json();
            setLaunches(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyProjects = async () => {
        if (!isAuthenticated) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/projects/me', {
                headers: { 'x-auth-token': token }
            });
            const data = await res.json();
            setMyProjects(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpvote = async (launchId) => {
        if (!isAuthenticated) return alert('Please login to upvote');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/launch/${launchId}/upvote`, {
                method: 'PUT',
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                const updatedUpvotes = await res.json();
                setLaunches(prev => prev.map(launch => {
                    if (launch._id === launchId) {
                        return { ...launch, upvotes: updatedUpvotes };
                    }
                    return launch;
                }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLaunchSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/launch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    projectId: selectedProject,
                    ...launchForm
                })
            });

            if (res.ok) {
                setShowLaunchModal(false);
                fetchLaunches(); // Refresh feed
                setLaunchForm({ tagline: '', description: '', tags: '', websiteUrl: '' });
                setSelectedProject('');
            } else {
                const data = await res.json();
                alert(data.msg || 'Error launching project');
            }
        } catch (err) {
            console.error(err);
            alert('Server Error');
        }
    };

    const filteredLaunches = launches
        .filter(l =>
            l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
            if (filter === 'popular') return b.upvotes.length - a.upvotes.length;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    Community Launchpad
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Discover the next big thing. Upvote, comment, and support fellow innovators.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => {
                            if (!isAuthenticated) return alert('Please login to launch');
                            setShowLaunchModal(true);
                            fetchMyProjects();
                        }}
                        className="btn-primary"
                        style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}
                    >
                        <Rocket size={20} style={{ marginRight: '0.5rem' }} /> Launch Your Project
                    </button>
                </div>
            </div>

            {/* Controls */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'
            }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setFilter('popular')}
                        className={filter === 'popular' ? 'btn-primary' : 'btn-secondary'}
                    >
                        Popular
                    </button>
                    <button
                        onClick={() => setFilter('new')}
                        className={filter === 'new' ? 'btn-primary' : 'btn-secondary'}
                    >
                        Newest
                    </button>
                </div>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                    <input
                        type="text"
                        placeholder="Search projects or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-input"
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                    />
                </div>
            </div>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {loading ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>Loading launches...</div>
                ) : filteredLaunches.map(launch => (
                    <div key={launch._id} className="glass-panel" style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        transition: 'transform 0.2s',
                        cursor: 'default'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                {/* Logo placeholder or real logo */}
                                <div style={{
                                    width: '50px', height: '50px', borderRadius: '12px',
                                    background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary)'
                                }}>
                                    {launch.project?.title?.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{launch.title}</h3>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>by @{launch.launcher?.username}</span>
                                </div>
                            </div>
                        </div>

                        <p style={{ color: 'var(--text-main)', fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                            {launch.tagline}
                        </p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                            {launch.description}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                            {launch.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} style={{
                                    padding: '0.25rem 0.75rem', borderRadius: '99px',
                                    background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', fontSize: '0.8rem'
                                }}>
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div style={{
                            paddingTop: '1rem', borderTop: '1px solid var(--glass-border)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <button
                                onClick={() => handleUpvote(launch._id)}
                                style={{
                                    background: launch.upvotes.includes(user?._id) ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    border: 'none', borderRadius: '8px',
                                    padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    color: launch.upvotes.includes(user?._id) ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer', transition: 'all 0.2s'
                                }}
                            >
                                <ThumbsUp size={18} />
                                <span style={{ fontWeight: '600' }}>{launch.upvotes.length}</span>
                            </button>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageSquare size={18} />
                                    <span>{launch.comments.length}</span>
                                </button>
                                {launch.websiteUrl && (
                                    <a href={launch.websiteUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}>
                                        <ExternalLink size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Launch Modal */}
            {showLaunchModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '2rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Rocket size={28} color="var(--primary)" /> Launch Project
                            </h2>
                            <button onClick={() => setShowLaunchModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleLaunchSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Select Project</label>
                                <select
                                    className="glass-input"
                                    value={selectedProject}
                                    onChange={(e) => setSelectedProject(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose a project --</option>
                                    {myProjects.map(p => (
                                        <option key={p._id} value={p._id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Auto-populate logic moved to top level */}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tagline (Quick Pitch)</label>
                                <input
                                    className="glass-input"
                                    placeholder="e.g. The Airbnb for Pets"
                                    maxLength={140}
                                    value={launchForm.tagline}
                                    onChange={(e) => setLaunchForm({ ...launchForm, tagline: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Detailed Description</label>
                                <textarea
                                    className="glass-input"
                                    rows={4}
                                    value={launchForm.description}
                                    onChange={(e) => setLaunchForm({ ...launchForm, description: e.target.value })}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Tags (comma separated)</label>
                                    <input
                                        className="glass-input"
                                        placeholder="SaaS, AI, Mobile"
                                        value={launchForm.tags}
                                        onChange={(e) => setLaunchForm({ ...launchForm, tags: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Website/Demo URL</label>
                                    <input
                                        className="glass-input"
                                        type="url"
                                        placeholder="https://..."
                                        value={launchForm.websiteUrl}
                                        onChange={(e) => setLaunchForm({ ...launchForm, websiteUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
                                Launch to Community 🚀
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Launchpad;
