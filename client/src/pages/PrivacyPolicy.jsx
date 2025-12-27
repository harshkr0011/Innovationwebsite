import React, { useEffect } from 'react';
import { Shield, Lock, Eye, FileText, Globe, Scale } from 'lucide-react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <Shield size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Privacy Policy</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Last updated: {new Date().toLocaleDateString()}</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        Compliant with the Information Technology Act, 2000 and SPDI Rules, 2011 (India).
                    </p>
                </div>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Eye size={24} color="var(--secondary)" />
                        1. Information We Collect
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        We collect information you provide directly to us in accordance with the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011. This includes:
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '2rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        <li><strong>Personal Information:</strong> Name, email address, password, educational details, and professional background.</li>
                        <li><strong>Sensitive Personal Data:</strong> We do not store financial information directly; however, we may process transaction data through secure third-party payment gateways compliant with RBI regulations.</li>
                        <li><strong>User Content:</strong> Project details, code snippets, and communications shared on the platform.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Globe size={24} color="var(--secondary)" />
                        2. Purpose of Collection and Usage
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        We use the information collected for lawful purposes connected with our function or activity, including:
                    </p>
                    <ul style={{ listStyle: 'disc', paddingLeft: '2rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        <li>Facilitating mentorship and team-building services.</li>
                        <li>Verifying your identity as required under Indian laws.</li>
                        <li>Communicating with you regarding updates, security alerts, and support.</li>
                        <li>Compliance with legal obligations and grievance redressal.</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Lock size={24} color="var(--secondary)" />
                        3. Data Security and Disclosure
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>
                        We implement reasonable security practices and procedures as mandated by the IT Act, 2000. We do not disclose your sensitive personal data to third parties without your prior permission, except where disclosure is mandated by law to Government agencies mandated under the law to obtain information for the purpose of verification of identity, or for prevention, detection, investigation including cyber incidents, prosecution, and punishment of offences.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Scale size={24} color="var(--secondary)" />
                        4. Grievance Officer
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>
                        In accordance with the Information Technology Act, 2000 and rules made there under, the name and contact details of the Grievance Officer are provided below:
                    </p>
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <p style={{ color: 'var(--text-main)', fontWeight: 'bold' }}>Grievance Officer: Rakul</p>
                        <p style={{ color: 'var(--text-muted)' }}>InnoSphere India Pvt Ltd</p>
                        <p style={{ color: 'var(--text-muted)' }}>Email: grievance@innosphere.in</p>
                        <p style={{ color: 'var(--text-muted)' }}>Time: Mon - Fri (9:00 AM - 6:00 PM IST)</p>
                    </div>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={24} color="var(--secondary)" />
                        5. Cookies and Tracking
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>
                        We use cookies to improve your experience. By using our website, you consent to the use of cookies in accordance with this privacy policy.
                    </p>
                </section>

                <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', marginTop: '3rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Contact Us</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@innosphere.in" style={{ color: 'var(--primary)' }}>privacy@innosphere.in</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
