'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Users,
  Swords,
  BookOpen,
  Dice6,
  Plus,
  Play,
  Crown,
  Scroll,
  Sparkles,
  ChevronRight,
  UserPlus,
  Compass,
} from 'lucide-react';
import { quickRoll } from '@/lib/dice';
import { DiceType, DiceRoll } from '@/types';
import styles from './page.module.css';

const diceTypes: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

const diceColors: Record<DiceType, string> = {
  d4: '#ef4444',
  d6: '#f97316',
  d8: '#84cc16',
  d10: '#06b6d4',
  d12: '#8b5cf6',
  d20: '#ec4899',
  d100: '#f59e0b',
};

export default function HomePage() {
  const [quickRollResult, setQuickRollResult] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleQuickRoll = async (die: DiceType) => {
    setIsRolling(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const roll = quickRoll(die, 0, 'Player');
    setQuickRollResult(roll);
    setIsRolling(false);
  };

  return (
    <div className={styles.dashboard}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className={styles.heroTitle}>
              <Crown className={styles.heroIcon} size={40} />
              Welcome, Adventurer
            </h1>
            <p className={styles.heroSubtitle}>Your epic journey awaits. Gather your party and forge your legend.</p>
          </motion.div>
          <motion.div
            className={styles.heroActions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="/characters" className="btn btn-gold btn-lg">
              <Plus size={20} /> Create Character
            </Link>
            <button className="btn btn-primary btn-lg">
              <Play size={20} /> Start Session
            </button>
          </motion.div>
        </div>
        <div className={styles.heroDecoration} />
      </section>

      {/* Quick Stats */}
      <section className={styles.statsSection}>
        <motion.div
          className={styles.statsGrid}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Users size={24} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Characters</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><BookOpen size={24} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Campaigns</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Swords size={24} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Encounters</span>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><Dice6 size={24} /></div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>0</span>
              <span className={styles.statLabel}>Dice Rolled</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Main Content Grid */}
      <div className={styles.contentGrid}>
        {/* Quick Dice */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className={styles.cardHeader}>
            <h3><Dice6 size={20} /> Quick Roll</h3>
            <Link href="/dice" className={styles.viewAll}>
              Open Roller <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.quickDiceGrid}>
              {diceTypes.map(die => (
                <button
                  key={die}
                  className={styles.quickDieBtn}
                  style={{ '--die-color': diceColors[die] } as React.CSSProperties}
                  onClick={() => handleQuickRoll(die)}
                  disabled={isRolling}
                >
                  {die}
                </button>
              ))}
            </div>
            <div className={styles.quickRollResult}>
              {quickRollResult ? (
                <motion.div
                  key={quickRollResult.id}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={styles.resultDisplay}
                >
                  <span className={styles.resultValue}>{quickRollResult.total}</span>
                  <span className={styles.resultFormula}>{quickRollResult.formula}</span>
                </motion.div>
              ) : (
                <span className={styles.resultPlaceholder}>Click a die to roll</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Party */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className={styles.cardHeader}>
            <h3><Users size={20} /> Your Party</h3>
            <Link href="/characters" className={styles.viewAll}>
              Manage <ChevronRight size={16} />
            </Link>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.emptyState}>
              <Users size={48} />
              <p>No characters yet</p>
              <Link href="/characters" className="btn btn-secondary btn-sm">
                <Plus size={16} /> Create Character
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Adventure Log */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className={styles.cardHeader}>
            <h3><Scroll size={20} /> Adventure Log</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.emptyState}>
              <Scroll size={48} />
              <p>Your adventure begins soon...</p>
              <span className={styles.hint}>Dice rolls, combat events, and story moments will appear here</span>
            </div>
          </div>
        </motion.div>

        {/* Current Quest */}
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className={styles.cardHeader}>
            <h3><Compass size={20} /> Current Quest</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.emptyState}>
              <Compass size={48} />
              <p>No active quest</p>
              <Link href="/campaign" className="btn btn-secondary btn-sm">
                <Plus size={16} /> Start Campaign
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.section
        className={styles.quickActions}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2>Quick Actions</h2>
        <div className={styles.actionsGrid}>
          <Link href="/characters" className={styles.actionCard}>
            <div className={styles.actionIcon}><Plus size={24} /></div>
            <div className={styles.actionInfo}>
              <h4>Create Character</h4>
              <p>Build a new hero for your adventures</p>
            </div>
          </Link>
          <Link href="/campaign" className={styles.actionCard}>
            <div className={styles.actionIcon}><BookOpen size={24} /></div>
            <div className={styles.actionInfo}>
              <h4>New Campaign</h4>
              <p>Start a new epic story</p>
            </div>
          </Link>
          <button className={styles.actionCard}>
            <div className={styles.actionIcon}><UserPlus size={24} /></div>
            <div className={styles.actionInfo}>
              <h4>Join Session</h4>
              <p>Enter a session code to join friends</p>
            </div>
          </button>
          <Link href="/bestiary" className={styles.actionCard}>
            <div className={styles.actionIcon}><Sparkles size={24} /></div>
            <div className={styles.actionInfo}>
              <h4>Browse Bestiary</h4>
              <p>Explore creatures and monsters</p>
            </div>
          </Link>
        </div>
      </motion.section>
    </div>
  );
}
