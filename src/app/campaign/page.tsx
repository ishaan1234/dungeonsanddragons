'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Users, Calendar, MapPin, Clock, Settings, Play } from 'lucide-react';
import styles from './page.module.css';

interface Campaign {
    id: string;
    name: string;
    description: string;
    setting: string;
    sessionCount: number;
    playerCount: number;
    lastPlayed: string;
    status: 'active' | 'paused' | 'completed';
}

const dummyCampaigns: Campaign[] = [
    {
        id: 'lost-mines',
        name: 'Lost Mine of Phandelver',
        description: 'A classic adventure for new players. The party must find the lost mine and stop the Black Spider.',
        setting: 'Sword Coast',
        sessionCount: 5,
        playerCount: 4,
        lastPlayed: '2 days ago',
        status: 'active',
    },
    {
        id: 'curse-strahd',
        name: 'Curse of Strahd',
        description: 'A gothic horror adventure in the haunted land of Barovia.',
        setting: 'Barovia',
        sessionCount: 12,
        playerCount: 5,
        lastPlayed: '1 week ago',
        status: 'paused',
    },
];

export default function CampaignPage() {
    const [campaigns] = useState<Campaign[]>(dummyCampaigns);
    const [showCreate, setShowCreate] = useState(false);

    return (
        <div className={styles.campaignPage}>
            <motion.header
                className={styles.pageHeader}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.headerContent}>
                    <h1><BookOpen size={32} /> Campaigns</h1>
                    <p>Manage your epic adventures</p>
                </div>
                <button className="btn btn-gold" onClick={() => setShowCreate(true)}>
                    <Plus size={18} /> New Campaign
                </button>
            </motion.header>

            {/* Quick Actions */}
            <motion.div
                className={styles.quickActions}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <button className="btn btn-primary">
                    <Play size={18} /> Join Session
                </button>
                <button className="btn btn-secondary">
                    <Users size={18} /> Invite Players
                </button>
            </motion.div>

            {/* Campaigns List */}
            <div className={styles.campaignsList}>
                <h2>Your Campaigns</h2>

                {campaigns.length === 0 ? (
                    <div className={styles.emptyState}>
                        <BookOpen size={48} />
                        <p>No campaigns yet</p>
                        <p className={styles.hint}>Create your first campaign to start your adventure</p>
                        <button className="btn btn-gold" onClick={() => setShowCreate(true)}>
                            <Plus size={18} /> Create Campaign
                        </button>
                    </div>
                ) : (
                    <div className={styles.campaignsGrid}>
                        {campaigns.map((campaign, index) => (
                            <motion.div
                                key={campaign.id}
                                className={styles.campaignCard}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <div className={styles.campaignHeader}>
                                    <h3>{campaign.name}</h3>
                                    <span className={`${styles.statusBadge} ${styles[campaign.status]}`}>
                                        {campaign.status}
                                    </span>
                                </div>

                                <p className={styles.description}>{campaign.description}</p>

                                <div className={styles.campaignMeta}>
                                    <span><MapPin size={14} /> {campaign.setting}</span>
                                    <span><Users size={14} /> {campaign.playerCount} players</span>
                                    <span><Calendar size={14} /> {campaign.sessionCount} sessions</span>
                                    <span><Clock size={14} /> {campaign.lastPlayed}</span>
                                </div>

                                <div className={styles.campaignActions}>
                                    <button className="btn btn-primary btn-sm">
                                        <Play size={14} /> Continue
                                    </button>
                                    <button className="btn btn-secondary btn-sm">
                                        <Settings size={14} /> Manage
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
