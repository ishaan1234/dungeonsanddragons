'use client';

import { motion } from 'framer-motion';
import { Dice6 } from 'lucide-react';
import DiceRoller from '@/components/dice/DiceRoller';

export default function DicePage() {
    return (
        <div className="dice-page">
            <motion.header
                className="page-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="header-content">
                    <h1><Dice6 size={32} /> Dice Roller</h1>
                    <p>Let fate decide your destiny</p>
                </div>
            </motion.header>

            <motion.div
                className="dice-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <DiceRoller />
            </motion.div>

            <style jsx>{`
        .dice-page {
          min-height: 100vh;
          padding: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: var(--text-secondary);
        }

        .dice-content {
          max-width: 800px;
          margin: 0 auto;
        }

        @media (max-width: 768px) {
          .dice-page {
            padding: 1rem;
            padding-top: 4rem;
          }

          .page-header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
}
