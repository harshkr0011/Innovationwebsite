import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { apiRequest } from './api';

const AuthContext = {
  current: null,
  Provider: ({ value, children }) => {
    AuthContext.current = value;
    return children;
  }
};

function useAuth() {
  const ctx = AuthContext.current;
  if (!ctx) {
    throw new Error('AuthContext must be used inside App');
  }
  return ctx;
}

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('innovation_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('innovation_token') || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('innovation_token', token);
    } else {
      localStorage.removeItem('innovation_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('innovation_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('innovation_user');
    }
  }, [user]);

  const login = (tokenValue, userValue) => {
    setToken(tokenValue);
    setUser(userValue);
  };

  const logout = () => {
    setToken('');
    setUser(null);
  };

  const authContext = useMemo(
    () => ({ user, token, login, logout, loading, setLoading }),
    [user, token, loading]
  );

  return (
    <AuthContext.Provider value={authContext}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AIPage /></ProtectedRoute>} />
          <Route path="/launch" element={<ProtectedRoute><LaunchPage /></ProtectedRoute>} />
          <Route path="/mentors" element={<ProtectedRoute><MentorsPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthContext.Provider>
  );
}

function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <Link to="/" className="brand">Innovation Platform</Link>
        </div>

        <nav className="nav">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          {!user && <Link to="/auth" className={location.pathname === '/auth' ? 'active' : ''}>Login</Link>}
          {user && (
            <>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
              <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>Projects</Link>
              <Link to="/ai" className={location.pathname === '/ai' ? 'active' : ''}>AI Studio</Link>
              <Link to="/launch" className={location.pathname === '/launch' ? 'active' : ''}>Launch</Link>
              <Link to="/mentors" className={location.pathname === '/mentors' ? 'active' : ''}>Mentors</Link>
              <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>Profile</Link>
            </>
          )}
        </nav>

        <div className="user-actions">
          {user ? (
            <>
              <span className="welcome">Hi, {user.username || user.email}</span>
              <button className="secondary-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link to="/auth" className="primary-button">Get started</Link>
          )}
        </div>
      </header>

      <main className="main-content">{children}</main>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" replace />;
}

function HomePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const startupMetrics = [
    { label: 'Active founders', value: '24k+' },
    { label: 'Mentor sessions', value: '8.4k' },
    { label: 'Launches this month', value: '412' },
    { label: 'Success match rate', value: '92%' }
  ];

  const opportunityData = [
    { title: 'AI Workflow for SMBs', stage: 'Seed ready', trend: '+28%' },
    { title: 'Developer hiring network', stage: 'Hiring now', trend: '+19%' },
    { title: 'Climate fintech pilot', stage: 'Mentor matched', trend: '+34%' }
  ];

  const mentorBoard = [
    { name: 'Aisha Rahman', role: 'Product strategy', rating: '4.9', expertise: 'B2B SaaS' },
    { name: 'Daniel Park', role: 'AI product', rating: '4.8', expertise: 'Machine learning' },
    { name: 'Priya Shah', role: 'Fundraising', rating: '5.0', expertise: 'Series A prep' }
  ];

  async function handleSubscribe(e) {
    e.preventDefault();
    try {
      const result = await apiRequest('/subscribers/subscribe', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      setMessage(result.msg || 'Subscribed successfully');
      setEmail('');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="hero">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Startup Innovation Platform</span>
          <h1>Turn ideas into ventures with AI, data, and mentorship.</h1>
          <p>
            Launch faster with a network of founders, investors, operators, and AI advisors.
            Validate traction, build momentum, and find the right support at every stage.
          </p>
          <div className="cta-row">
            <Link to="/auth" className="primary-button">Create account</Link>
            <Link to="/projects" className="secondary-button">Explore projects</Link>
          </div>
        </div>

        <div className="hero-panel-side">
          <div className="mini-signal">
            <span>Startup pulse</span>
            <strong>+41.8%</strong>
            <small>Month over month</small>
          </div>
          <div className="mini-chart" aria-hidden="true">
            <span style={{ height: '35%' }} />
            <span style={{ height: '48%' }} />
            <span style={{ height: '62%' }} />
            <span style={{ height: '58%' }} />
            <span style={{ height: '72%' }} />
            <span style={{ height: '86%' }} />
            <span style={{ height: '100%' }} />
          </div>
        </div>
      </section>

      <section className="metric-strip">
        {startupMetrics.map((metric) => (
          <div key={metric.label} className="metric-pill">
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </section>

      <section className="feature-grid">
        <FeatureCard title="AI Validation" text="Evaluate startup concept strength, market fit, and roadmap confidence using guided AI workflows." />
        <FeatureCard title="Team Matching" text="Find co-founders, developers, and operators matched by skills, goals, and stage." />
        <FeatureCard title="Launch Feed" text="Track product releases, community momentum, and founder updates in one signal-rich feed." />
        <FeatureCard title="Mentor Network" text="Get tailored guidance from proven operators, product leaders, and ecosystem experts." />
      </section>

      <section className="split-panel">
        <div className="panel">
          <span className="eyebrow small">Why founders choose us</span>
          <h2>Built for real startup execution.</h2>
          <ul className="check-list">
            <li>AI-assisted product planning and market validation</li>
            <li>Mentorship pathways mapped to your startup stage</li>
            <li>Investor-ready project visibility and launch tracking</li>
            <li>Founder community for customer discovery and collaboration</li>
          </ul>
        </div>

        <div className="panel">
          <span className="eyebrow small">Market pulse</span>
          <h2>High-signal opportunities</h2>
          <div className="opportunity-list">
            {opportunityData.map((item) => (
              <div key={item.title} className="opportunity-item">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.stage}</span>
                </div>
                <em>{item.trend}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel mentor-panel">
        <div className="section-heading-row">
          <div>
            <span className="eyebrow small">Mentor board</span>
            <h2>Operators who help ideas become ventures</h2>
          </div>
          <Link to="/mentors" className="secondary-button">View network</Link>
        </div>

        <div className="mentor-grid">
          {mentorBoard.map((mentor) => (
            <article key={mentor.name} className="mentor-card">
              <div className="mentor-topline">
                <div className="avatar">{mentor.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</div>
                <div>
                  <h3>{mentor.name}</h3>
                  <span>{mentor.role}</span>
                </div>
              </div>
              <p>{mentor.expertise}</p>
              <strong>★ {mentor.rating}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter">
        <div>
          <h2>Stay in the loop</h2>
          <p>Get founder updates, launch alerts, and funding opportunities in your inbox.</p>
        </div>
        <form onSubmit={handleSubscribe} className="inline-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <button className="primary-button" type="submit">Subscribe</button>
        </form>
        {message && <p className="inline-message">{message}</p>}
      </section>
    </div>
  );
}

function FeatureCard({ title, text }) {
  return (
    <article className="feature-card">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const payload = mode === 'login'
        ? { email: form.email, password: form.password }
        : { username: form.username, email: form.email, password: form.password };

      const result = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      if (result.token) {
        login(result.token, result.user);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <div className="auth-toggle">
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')} type="button">Login</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')} type="button">Register</button>
        </div>

        <form onSubmit={handleSubmit} className="stack-form">
          {mode === 'register' && (
            <label>
              Username
              <input name="username" value={form.username} onChange={handleChange} required />
            </label>
          )}

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} minLength="6" required />
          </label>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  );
}

function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const pipeline = [
    { label: 'Customer discovery', value: 78, tone: 'cyan' },
    { label: 'Prototype validation', value: 64, tone: 'blue' },
    { label: 'Mentor feedback loop', value: 88, tone: 'purple' },
    { label: 'Launch readiness', value: 71, tone: 'green' }
  ];

  const activityFeed = [
    { title: 'New mentor session booked', detail: 'Product strategy review with Aisha Rahman', time: '2h ago' },
    { title: 'Community traction increased', detail: 'Engagement up 18% from last week', time: '6h ago' },
    { title: 'AI roadmap generated', detail: '3 growth loops recommended for your product', time: '1d ago' }
  ];

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [_, profileResult, statsResult, projectList] = await Promise.all([
          apiRequest('/auth/me'),
          apiRequest('/profile/me'),
          apiRequest('/profile/stats'),
          apiRequest('/projects')
        ]);

        setProfile(profileResult);
        setStats(statsResult);
        setProjects(projectList.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) return <div className="panel">Loading dashboard...</div>;

  return (
    <div className="content-stack">
      <section className="dashboard-top panel">
        <div>
          <span className="eyebrow small">Founder dashboard</span>
          <h2>Welcome back, {profile?.username || 'builder'}.</h2>
        </div>
        <div className="dashboard-badge">
          <span className="dot" />
          Startup health: strong
        </div>
      </section>

      <section className="stats-grid">
        <StatCard label="Projects" value={stats?.projects ?? 0} />
        <StatCard label="Contributions" value={stats?.contributions ?? 0} />
        <StatCard label="Likes" value={stats?.likes ?? 0} />
        <StatCard label="Reputation" value={stats?.reputation ?? 0} />
      </section>

      <section className="two-column">
        <div className="panel">
          <h2>Startup snapshot</h2>
          <p className="muted-text">{profile?.bio || 'Complete your profile to showcase your work and attract the right opportunity.'}</p>
          <div className="meta-list">
            <span>Role: {profile?.role || 'Student Innovator'}</span>
            <span>Location: {profile?.location || 'Not specified'}</span>
            <span>Skills: {(profile?.skills || ['Innovation']).join(', ')}</span>
          </div>
        </div>

        <div className="panel">
          <h2>Recent projects</h2>
          {projects.length ? (
            <ul className="list-plain">
              {projects.map((project) => (
                <li key={project._id}>
                  <strong>{project.title}</strong>
                  <span>{project.tags?.slice(0, 3).join(' • ') || 'General'}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No projects yet.</p>
          )}
        </div>
      </section>

      <section className="two-column">
        <div className="panel">
          <h2>Execution pipeline</h2>
          <div className="pipeline-list">
            {pipeline.map((item) => (
              <div key={item.label} className="pipeline-row">
                <div className="pipeline-label">
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
                <div className="pipeline-track">
                  <span className={`pipeline-fill ${item.tone}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h2>Recent activity</h2>
          <div className="activity-feed">
            {activityFeed.map((item) => (
              <div key={item.title} className="activity-item">
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                <small>{item.time}</small>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ title: '', description: '', tags: '', link: '', github: '' });

  const loadProjects = async () => {
    try {
      const data = await apiRequest('/projects');
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await apiRequest('/projects', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setForm({ title: '', description: '', tags: '', link: '', github: '' });
      loadProjects();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="content-stack">
      <section className="panel">
        <h2>Create a project</h2>
        <form onSubmit={handleSubmit} className="stack-form compact">
          <div className="inline-two">
            <label>
              Title
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label>
              Tags
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="AI, SaaS, Health" />
            </label>
          </div>

          <label>
            Description
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows="4" />
          </label>

          <div className="inline-two">
            <label>
              Link
              <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
            </label>
            <label>
              GitHub
              <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
            </label>
          </div>

          <button type="submit" className="primary-button">Publish project</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="panel">
        <h2>Project board</h2>
        {loading ? <p>Loading projects...</p> : (
          <div className="card-grid">
            {projects.map((project) => (
              <article className="project-card" key={project._id}>
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span>{project.likes?.length || 0} likes</span>
                </div>
                <p>{project.description}</p>
                <div className="tag-row">
                  {(project.tags || []).map((tag) => <span key={`${project._id}-${tag}`} className="tag">{tag}</span>)}
                </div>
                <div className="small-links">
                  {project.link && <a href={project.link} target="_blank" rel="noreferrer">Project link</a>}
                  {project.github && <a href={project.github} target="_blank" rel="noreferrer">GitHub</a>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function AIPage() {
  const [selected, setSelected] = useState('validate');
  const [form, setForm] = useState({ title: '', description: '', conversation: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = selected === 'validate'
        ? { title: form.title, description: form.description }
        : selected === 'roadmap'
          ? { title: form.title, description: form.description }
          : selected === 'leanCanvas'
            ? { conversation: form.conversation }
            : { title: form.title, description: form.description };

      const endpoint = selected === 'validate'
        ? '/ai/validate'
        : selected === 'roadmap'
          ? '/ai/roadmap'
          : selected === 'leanCanvas'
            ? '/ai/lean-canvas'
            : '/ai/pitch-deck';

      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="content-stack">
      <section className="panel">
        <h2>AI Studio</h2>
        <div className="inline-two">
          <button className={selected === 'validate' ? 'segment active' : 'segment'} onClick={() => setSelected('validate')} type="button">Validate idea</button>
          <button className={selected === 'roadmap' ? 'segment active' : 'segment'} onClick={() => setSelected('roadmap')} type="button">Roadmap</button>
          <button className={selected === 'leanCanvas' ? 'segment active' : 'segment'} onClick={() => setSelected('leanCanvas')} type="button">Lean canvas</button>
          <button className={selected === 'pitchDeck' ? 'segment active' : 'segment'} onClick={() => setSelected('pitchDeck')} type="button">Pitch deck</button>
        </div>

        <form onSubmit={handleSubmit} className="stack-form compact">
          {selected !== 'leanCanvas' ? (
            <>
              <label>
                Project title
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="5" required />
              </label>
            </>
          ) : (
            <label>
              Conversation / business idea
              <textarea value={form.conversation} onChange={(e) => setForm({ ...form, conversation: e.target.value })} rows="5" required />
            </label>
          )}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate insight'}
          </button>
        </form>
      </section>

      {result && (
        <section className="panel">
          <h2>Result</h2>
          {result.error ? <p className="error-message">{result.error}</p> : (
            <pre className="result-box">{JSON.stringify(result, null, 2)}</pre>
          )}
        </section>
      )}
    </div>
  );
}

function LaunchPage() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLaunches() {
      try {
        const data = await apiRequest('/launch');
        setLaunches(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadLaunches();
  }, []);

  if (loading) return <div className="panel">Loading launches...</div>;

  return (
    <div className="content-stack">
      <section className="panel">
        <h2>Launch feed</h2>
        <div className="card-grid">
          {launches.map((launch) => (
            <article className="project-card" key={launch._id}>
              <h3>{launch.title}</h3>
              <p>{launch.tagline || launch.description}</p>
              <div className="tag-row">
                {(launch.tags || []).map((tag) => <span key={`${launch._id}-${tag}`} className="tag">{tag}</span>)}
              </div>
              <small>By {launch.launcher?.username || 'Founder'}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MentorsPage() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMentors() {
      try {
        const data = await apiRequest('/mentors');
        setMentors(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMentors();
  }, []);

  if (loading) return <div className="panel">Loading mentors...</div>;

  return (
    <div className="content-stack">
      <section className="panel">
        <h2>Mentor network</h2>
        <div className="card-grid">
          {mentors.map((mentor) => (
            <article className="project-card" key={mentor._id}>
              <h3>{mentor.username}</h3>
              <p>{mentor.role} • {mentor.company}</p>
              <p>{mentor.bio}</p>
              <div className="tag-row">
                {(mentor.skills || []).map((skill) => <span key={`${mentor._id}-${skill}`} className="tag">{skill}</span>)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function ProfilePage() {
  const [profile, setProfile] = useState({ bio: '', skills: '', location: '', role: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiRequest('/profile/me');
        setProfile({
          bio: data.bio || '',
          skills: (data.skills || []).join(', '),
          location: data.location || '',
          role: data.role || 'Student Innovator'
        });
      } catch (error) {
        console.error(error);
      }
    }

    loadProfile();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await apiRequest('/profile', {
        method: 'POST',
        body: JSON.stringify({
          ...profile,
          skills: profile.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
        })
      });
      setMessage('Profile saved successfully');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="content-stack">
      <section className="panel">
        <h2>Your profile</h2>
        <form onSubmit={saveProfile} className="stack-form compact">
          <label>
            Role
            <input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
          </label>
          <label>
            Location
            <input value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
          </label>
          <label>
            Skills
            <input value={profile.skills} onChange={(e) => setProfile({ ...profile, skills: e.target.value })} />
          </label>
          <label>
            Bio
            <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows="4" />
          </label>

          <button className="primary-button" type="submit">Save profile</button>
        </form>
        {message && <p className="inline-message">{message}</p>}
      </section>
    </div>
  );
}

export default App;
