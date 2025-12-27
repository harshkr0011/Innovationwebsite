import React, { useEffect } from 'react';
import { FileText, CheckCircle, AlertTriangle, Scale, XCircle } from 'lucide-react';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{ background: 'var(--primary-glow)', width: 'fit-content', padding: '1rem', borderRadius: '50%', margin: '0 auto 1rem' }}>
                        <Scale size={40} color="var(--primary)" />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Terms of Service</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Effective Date: {new Date().toLocaleDateString()}</p>
                </div>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <CheckCircle size={24} color="var(--secondary)" />
                        1. Acceptance of Terms
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>
                        By accessing or using InnoSphere ("Service"), you agree to be bound by these Terms. These Terms are governed by the laws of India, including the Information Technology Act, 2000 and the rules made thereunder.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FileText size={24} color="var(--secondary)" />
                        2. User Content and Conduct
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        You retain ownership of any intellectual property rights that you hold in that content. However, by uploading content, you grant InnoSphere a worldwide, royalty-free license to use, host, store, reproduce, and display such content for the limited purpose of operating, promoting, and improving our Services.
                    </p>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>
                        You agree strictly not to post content that is defamatory, obscene, invasive of privacy, infringing intellectual property rights, or otherwise unlawful under Indian laws.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AlertTriangle size={24} color="var(--secondary)" />
                        3. Governing Law and Jurisdiction
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>
                        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any dispute arising out of or in relation to this Agreement shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
                    </p>
                </section>

                <section style={{ marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <XCircle size={24} color="var(--secondary)" />
                        4. Termination
                    </h2>
                    <p style={{ lineHeight: '1.7', color: 'var(--text-muted)' }}>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <div style={{ padding: '1.5rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', marginTop: '3rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Questions?</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                        Please contact us at <a href="mailto:legal@innosphere.in" style={{ color: 'var(--primary)' }}>legal@innosphere.in</a> for any questions regarding these Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
