import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AICoFounder = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: "Hi! I'm your AI Co-Founder. I can help with strategy, validation, or just bouncing ideas around. What's on your mind?" }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const { user } = useAuth();
    const [isMinimized, setIsMinimized] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = { role: 'user', text: inputText };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.text,
                    context: {
                        page: location.pathname,
                        role: user?.role || 'Founder'
                    }
                })
            });

            const data = await res.json();

            if (data.reply) {
                setMessages(prev => [...prev, { role: 'assistant', text: data.reply, suggestion: data.suggestion }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', text: "I'm pondering that... but can't answer right now." }]);
            }

        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I lost my train of thought. (Network Error)" }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    color: 'white',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    transition: 'transform 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                <Sparkles size={28} />
            </button>
        );
    }

    return (
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '340px',
            height: isMinimized ? '60px' : '480px',
            background: 'var(--bg-card)',
            border: '1px solid var(--glass-border)',
            borderRadius: '16px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            overflow: 'hidden',
            transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
            {/* Header */}
            <div style={{
                padding: '1rem',
                background: 'rgba(255,255,255,0.03)',
                borderBottom: '1px solid var(--glass-border)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Sparkles size={16} color="white" />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600' }}>AI Co-Founder</h3>
                        <span style={{ fontSize: '0.75rem', color: '#10b981' }}>● Online</span>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsMinimized(!isMinimized)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        {isMinimized ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <div style={{
                        flex: 1,
                        padding: '1rem',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '80%'
                            }}>
                                <div style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.5',
                                    borderTopLeftRadius: msg.role === 'assistant' ? '2px' : '12px',
                                    borderTopRightRadius: msg.role === 'user' ? '2px' : '12px'
                                }}>
                                    {msg.text}
                                </div>
                                {msg.suggestion && (
                                    <div style={{
                                        marginTop: '0.5rem',
                                        padding: '0.5rem 0.75rem',
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        color: '#10b981',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}>
                                        <Sparkles size={12} />
                                        <span>Tip: {msg.suggestion}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                Thinking...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} style={{
                        padding: '1rem',
                        borderTop: '1px solid var(--glass-border)',
                        display: 'flex',
                        gap: '0.75rem'
                    }}>
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Ask for advice..."
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid var(--glass-border)',
                                borderRadius: '999px',
                                padding: '0.6rem 1rem',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'var(--primary)',
                                border: 'none',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: inputText.trim() ? 1 : 0.5
                            }}
                            disabled={!inputText.trim()}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </>
            )}
        </div>
    );
};

export default AICoFounder;
