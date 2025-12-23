'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Volume2, VolumeX, Moon, Sun, Bell, User, Palette, Save } from 'lucide-react';
import styles from './page.module.css';

export default function SettingsPage() {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [darkMode, setDarkMode] = useState(true);
    const [notifications, setNotifications] = useState(true);
    const [diceAnimation, setDiceAnimation] = useState(true);
    const [userName, setUserName] = useState('Adventurer');
    const [theme, setTheme] = useState('purple');

    const themes = [
        { id: 'purple', name: 'Royal Purple', color: '#8b5cf6' },
        { id: 'red', name: 'Dragon Red', color: '#ef4444' },
        { id: 'blue', name: 'Ocean Blue', color: '#3b82f6' },
        { id: 'green', name: 'Forest Green', color: '#22c55e' },
        { id: 'gold', name: 'Golden', color: '#f59e0b' },
    ];

    return (
        <div className={styles.settingsPage}>
            <motion.header
                className={styles.pageHeader}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1><Settings size={32} /> Settings</h1>
                <p>Customize your experience</p>
            </motion.header>

            <div className={styles.settingsGrid}>
                {/* Profile Section */}
                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2><User size={20} /> Profile</h2>
                    <div className={styles.formGroup}>
                        <label>Display Name</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Your adventurer name"
                        />
                    </div>
                </motion.section>

                {/* Appearance Section */}
                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <h2><Palette size={20} /> Appearance</h2>

                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                            <div>
                                <span className={styles.settingLabel}>Dark Mode</span>
                                <span className={styles.settingDesc}>Use dark theme throughout the app</span>
                            </div>
                        </div>
                        <label className={styles.toggle}>
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={(e) => setDarkMode(e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.themeSelector}>
                        <label>Theme Color</label>
                        <div className={styles.themes}>
                            {themes.map(t => (
                                <button
                                    key={t.id}
                                    className={`${styles.themeBtn} ${theme === t.id ? styles.active : ''}`}
                                    style={{ '--theme-color': t.color } as React.CSSProperties}
                                    onClick={() => setTheme(t.id)}
                                    title={t.name}
                                />
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Audio Section */}
                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2>{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />} Audio</h2>

                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <Volume2 size={18} />
                            <div>
                                <span className={styles.settingLabel}>Sound Effects</span>
                                <span className={styles.settingDesc}>Play sounds for dice rolls and actions</span>
                            </div>
                        </div>
                        <label className={styles.toggle}>
                            <input
                                type="checkbox"
                                checked={soundEnabled}
                                onChange={(e) => setSoundEnabled(e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>

                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <Bell size={18} />
                            <div>
                                <span className={styles.settingLabel}>Notifications</span>
                                <span className={styles.settingDesc}>Receive audio notifications for turns</span>
                            </div>
                        </div>
                        <label className={styles.toggle}>
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </motion.section>

                {/* Gameplay Section */}
                <motion.section
                    className={styles.section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                >
                    <h2>🎲 Gameplay</h2>

                    <div className={styles.settingRow}>
                        <div className={styles.settingInfo}>
                            <span>🎯</span>
                            <div>
                                <span className={styles.settingLabel}>Dice Animations</span>
                                <span className={styles.settingDesc}>Show animations when rolling dice</span>
                            </div>
                        </div>
                        <label className={styles.toggle}>
                            <input
                                type="checkbox"
                                checked={diceAnimation}
                                onChange={(e) => setDiceAnimation(e.target.checked)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                </motion.section>
            </div>

            <motion.div
                className={styles.saveSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <button className="btn btn-gold">
                    <Save size={18} /> Save Settings
                </button>
            </motion.div>
        </div>
    );
}
