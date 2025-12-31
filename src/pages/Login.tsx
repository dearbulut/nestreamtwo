// Login Page - TV Style with virtual keyboard navigation

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { changeLanguage } from '../i18n';
import { useTVNavigation } from '../hooks/useTVNavigation';
import './Login.css';

interface LoginProps {
    onLoginSuccess: () => void;
}

export function Login({ onLoginSuccess }: LoginProps) {
    const { t, i18n } = useTranslation();
    const [url, setUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState(0);
    const [showInfoPopup, setShowInfoPopup] = useState(true);

    const inputs = useRef<(HTMLInputElement | HTMLButtonElement | null)[]>([]);

    // Check for saved credentials on mount
    useEffect(() => {
        const saved = storage.getCredentials();
        if (saved) {
            setUrl(saved.url);
            setUsername(saved.username);
            setPassword(saved.password);
        }
    }, []);

    // Handle language change
    const handleLanguageChange = (lang: 'tr' | 'en') => {
        changeLanguage(lang);
    };

    const handleLogin = async () => {
        if (!url || !username || !password) {
            setError(t('login.invalidCredentials'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            await api.authenticate(url, username, password);

            // Save credentials
            storage.saveCredentials({ url, username, password });

            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || t('login.connectionError'));
        } finally {
            setLoading(false);
        }
    };

    const moveFocus = (delta: number) => {
        const newIndex = Math.max(0, Math.min(focusedField + delta, 3));
        setFocusedField(newIndex);
        inputs.current[newIndex]?.focus();
    };

    useTVNavigation({
        onNavigate: (direction) => {
            if (direction === 'up') moveFocus(-1);
            if (direction === 'down') moveFocus(1);
        },
        onEnter: () => {
            if (focusedField === 3) {
                handleLogin();
            }
        },
    });

    return (
        <div className="login-container">
            {/* Info Popup */}
            {showInfoPopup && (
                <div className="info-popup-overlay">
                    <div className="info-popup">
                        <div className="info-popup-icon">
                            <svg viewBox="0 0 24 24" fill="none" width="48" height="48">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="info-popup-content">
                            <p className="info-popup-text">
                                This project was developed by <strong>Soft Tech</strong>.
                            </p>
                            <p className="info-popup-contact">
                                Contact us on Telegram:
                            </p>
                            <a href="https://t.me/techsoftwareone" target="_blank" rel="noopener noreferrer" className="info-popup-telegram">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                                </svg>
                                <span>@techsoftwareone</span>
                            </a>
                        </div>
                        <button className="info-popup-btn" onClick={() => setShowInfoPopup(false)}>
                            OK
                        </button>
                    </div>
                </div>
            )}

            {/* Animated background */}
            <div className="login-bg">
                <div className="login-orb login-orb-1" />
                <div className="login-orb login-orb-2" />
                <div className="login-orb login-orb-3" />
                <div className="login-grid-overlay" />
            </div>

            {/* Language Selector */}
            <div className="login-language-selector">
                <button
                    className={`lang-btn ${i18n.language === 'tr' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('tr')}
                    title="Türkçe"
                >
                    🇹🇷
                </button>
                <button
                    className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                    title="English"
                >
                    🇬🇧
                </button>
            </div>

            <div className="login-content animate-scale-in">
                {/* Logo */}
                <div className="login-header">
                    <div className="login-logo">
                        <svg viewBox="0 0 24 24" fill="none" className="login-logo-icon">
                            <path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V15C20 15.5523 19.5523 16 19 16H5C4.44772 16 4 15.5523 4 15V5Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 20H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12 16V20" stroke="currentColor" strokeWidth="2" />
                            <path d="M9 9L11 11L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="login-title">NeoStream</h1>
                    <p className="login-subtitle">{t('login.subtitle')}</p>
                </div>

                {/* Login Form */}
                <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div className="login-field">
                        <label className="login-label">{t('login.serverUrl')}</label>
                        <input
                            ref={(el) => { inputs.current[0] = el; }}
                            type="text"
                            className={`tv-input ${focusedField === 0 ? 'tv-focused' : ''}`}
                            placeholder={t('login.serverUrlPlaceholder')}
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onFocus={() => setFocusedField(0)}
                            disabled={loading}
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">{t('login.username')}</label>
                        <input
                            ref={(el) => { inputs.current[1] = el; }}
                            type="text"
                            className={`tv-input ${focusedField === 1 ? 'tv-focused' : ''}`}
                            placeholder={t('login.usernamePlaceholder')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onFocus={() => setFocusedField(1)}
                            disabled={loading}
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">{t('login.password')}</label>
                        <input
                            ref={(el) => { inputs.current[2] = el; }}
                            type="password"
                            className={`tv-input ${focusedField === 2 ? 'tv-focused' : ''}`}
                            placeholder={t('login.passwordPlaceholder')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onFocus={() => setFocusedField(2)}
                            disabled={loading}
                        />
                    </div>

                    {error && (
                        <div className="login-error">
                            <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <button
                        ref={(el) => { inputs.current[3] = el; }}
                        type="submit"
                        className={`tv-button login-button ${focusedField === 3 ? 'tv-focused' : ''}`}
                        onFocus={() => setFocusedField(3)}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="login-spinner" />
                                {t('login.loggingIn')}
                            </>
                        ) : (
                            <>
                                <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                                    <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <path d="M10 17L15 12L10 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                {t('login.loginButton')}
                            </>
                        )}
                    </button>
                </form>

                {/* Navigation hint */}
                <div className="login-hint">
                    <span>↑↓ {t('liveTV.hints.navigate')}</span>
                    <span>•</span>
                    <span>OK {t('liveTV.hints.select')}</span>
                </div>
            </div>
        </div>
    );
}
