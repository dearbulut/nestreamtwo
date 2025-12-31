// Settings Page - Language, Player, and UI Preferences

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { storage, type Settings as SettingsType } from '../services/storage';
import { changeLanguage } from '../i18n';
import './Settings.css';

export function Settings() {
    const { t, i18n } = useTranslation();
    const [settings, setSettings] = useState<SettingsType>(storage.getSettings());
    const [saved, setSaved] = useState(false);

    // Update settings and persist
    const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        storage.saveSettings(newSettings);
        
        // Handle language change
        if (key === 'language') {
            changeLanguage(value as 'tr' | 'en');
        }
        
        // Show saved indicator
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    // Clear data functions
    const handleClearFavorites = () => {
        if (confirm(t('settings.data.clearFavorites') + '?')) {
            storage.clearFavorites();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const handleClearList = () => {
        if (confirm(t('settings.data.clearList') + '?')) {
            storage.clearWatchLater();
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    return (
        <div className="settings-page">
            <div className="settings-bg-gradient" />
            
            <div className="settings-container">
                <header className="settings-header">
                    <h1 className="settings-title">
                        <span className="settings-icon">⚙️</span>
                        {t('settings.title')}
                    </h1>
                    {saved && (
                        <div className="settings-saved">
                            ✓ {t('common.save')}
                        </div>
                    )}
                </header>

                <div className="settings-content">
                    {/* Language Section */}
                    <section className="settings-section">
                        <h2 className="section-title">
                            <span className="section-icon">🌐</span>
                            {t('settings.language.title')}
                        </h2>
                        <p className="section-description">{t('settings.language.description')}</p>
                        
                        <div className="language-options">
                            <button
                                className={`language-btn ${settings.language === 'tr' ? 'active' : ''}`}
                                onClick={() => updateSetting('language', 'tr')}
                            >
                                <span className="lang-flag">🇹🇷</span>
                                <span className="lang-name">{t('settings.language.turkish')}</span>
                            </button>
                            <button
                                className={`language-btn ${settings.language === 'en' ? 'active' : ''}`}
                                onClick={() => updateSetting('language', 'en')}
                            >
                                <span className="lang-flag">🇬🇧</span>
                                <span className="lang-name">{t('settings.language.english')}</span>
                            </button>
                        </div>
                    </section>

                    {/* Player Section */}
                    <section className="settings-section">
                        <h2 className="section-title">
                            <span className="section-icon">▶️</span>
                            {t('settings.player.title')}
                        </h2>
                        
                        <div className="setting-item">
                            <div className="setting-info">
                                <span className="setting-label">{t('settings.player.autoplay')}</span>
                                <span className="setting-description">{t('settings.player.autoplayDescription')}</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.autoPlay}
                                    onChange={(e) => updateSetting('autoPlay', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>

                        <div className="setting-item">
                            <div className="setting-info">
                                <span className="setting-label">{t('settings.player.quality')}</span>
                            </div>
                            <select
                                className="setting-select"
                                value={settings.preferredQuality}
                                onChange={(e) => updateSetting('preferredQuality', e.target.value as SettingsType['preferredQuality'])}
                            >
                                <option value="auto">{t('settings.player.qualityAuto')}</option>
                                <option value="1080p">{t('settings.player.quality1080p')}</option>
                                <option value="720p">{t('settings.player.quality720p')}</option>
                                <option value="480p">{t('settings.player.quality480p')}</option>
                            </select>
                        </div>
                    </section>

                    {/* Appearance Section */}
                    <section className="settings-section">
                        <h2 className="section-title">
                            <span className="section-icon">🎨</span>
                            {t('settings.appearance.title')}
                        </h2>
                        
                        <div className="setting-item">
                            <div className="setting-info">
                                <span className="setting-label">{t('settings.appearance.compactMode')}</span>
                                <span className="setting-description">{t('settings.appearance.compactModeDescription')}</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={settings.compactMode}
                                    onChange={(e) => updateSetting('compactMode', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </section>

                    {/* Data Section */}
                    <section className="settings-section">
                        <h2 className="section-title">
                            <span className="section-icon">🗂️</span>
                            {t('settings.data.title')}
                        </h2>
                        
                        <div className="data-actions">
                            <button className="data-btn" onClick={handleClearFavorites}>
                                <span className="btn-icon">❤️</span>
                                {t('settings.data.clearFavorites')}
                            </button>
                            <button className="data-btn" onClick={handleClearList}>
                                <span className="btn-icon">📑</span>
                                {t('settings.data.clearList')}
                            </button>
                        </div>
                    </section>

                    {/* About Section */}
                    <section className="settings-section">
                        <h2 className="section-title">
                            <span className="section-icon">ℹ️</span>
                            {t('settings.about.title')}
                        </h2>
                        
                        <div className="about-info">
                            <div className="about-item">
                                <span className="about-label">{t('settings.about.version')}</span>
                                <span className="about-value">1.0.0</span>
                            </div>
                            <div className="about-item">
                                <span className="about-label">{t('settings.about.developer')}</span>
                                <span className="about-value">NeoStream Team</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
