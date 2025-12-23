'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dice6, Plus, Minus, RotateCcw, Sparkles } from 'lucide-react';
import { DiceType, DiceRoll } from '@/types';
import { executeRoll, quickRoll, checkNatural } from '@/lib/dice';
import styles from './DiceRoller.module.css';

interface DiceCount {
  d4: number;
  d6: number;
  d8: number;
  d10: number;
  d12: number;
  d20: number;
  d100: number;
}

const diceColors: Record<DiceType, string> = {
  d4: '#ef4444',
  d6: '#f97316',
  d8: '#84cc16',
  d10: '#06b6d4',
  d12: '#8b5cf6',
  d20: '#ec4899',
  d100: '#f59e0b',
};

export default function DiceRoller() {
  const [diceCount, setDiceCount] = useState<DiceCount>({
    d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0, d100: 0,
  });
  const [modifier, setModifier] = useState(0);
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [customFormula, setCustomFormula] = useState('');
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [currentRoll, setCurrentRoll] = useState<DiceRoll | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const addDie = (die: DiceType) => {
    setDiceCount(prev => ({ ...prev, [die]: Math.min(prev[die] + 1, 20) }));
  };

  const removeDie = (die: DiceType) => {
    setDiceCount(prev => ({ ...prev, [die]: Math.max(prev[die] - 1, 0) }));
  };

  const clearDice = () => {
    setDiceCount({ d4: 0, d6: 0, d8: 0, d10: 0, d12: 0, d20: 0, d100: 0 });
    setModifier(0);
    setAdvantage(false);
    setDisadvantage(false);
  };

  const buildFormula = useCallback(() => {
    const parts: string[] = [];
    (Object.keys(diceCount) as DiceType[]).forEach(die => {
      if (diceCount[die] > 0) {
        parts.push(`${diceCount[die]}${die}`);
      }
    });

    if (parts.length === 0) return '';

    let formula = parts.join('+');
    if (modifier !== 0) {
      formula += modifier > 0 ? `+${modifier}` : modifier.toString();
    }
    return formula;
  }, [diceCount, modifier]);

  const performRoll = useCallback(async (formula?: string) => {
    const rollFormula = formula || buildFormula();
    if (!rollFormula) return;

    setIsRolling(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const type = advantage && !disadvantage ? 'advantage'
      : disadvantage && !advantage ? 'disadvantage'
        : 'normal';

    const roll = executeRoll(rollFormula, 'Player', undefined, type);

    setCurrentRoll(roll);
    setRollHistory(prev => [roll, ...prev].slice(0, 50));
    setIsRolling(false);
  }, [buildFormula, advantage, disadvantage]);

  const quickRollDie = async (die: DiceType) => {
    setIsRolling(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const roll = quickRoll(die, 0, 'Player');
    setCurrentRoll(roll);
    setRollHistory(prev => [roll, ...prev].slice(0, 50));
    setIsRolling(false);
  };

  const handleCustomRoll = () => {
    if (customFormula.trim()) {
      performRoll(customFormula.trim());
      setCustomFormula('');
    }
  };

  const natural = currentRoll ? checkNatural(currentRoll) : null;

  return (
    <div className={styles.diceRoller}>
      {/* Main Dice Display */}
      <div className={styles.diceDisplay}>
        <AnimatePresence mode="wait">
          {isRolling ? (
            <motion.div
              key="rolling"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: [0, 360] }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ rotate: { repeat: Infinity, duration: 0.5 } }}
              className={styles.rollingAnimation}
            >
              <Dice6 size={80} />
            </motion.div>
          ) : currentRoll ? (
            <motion.div
              key={currentRoll.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`${styles.rollResult} ${natural === 'nat20' ? styles.critical : ''} ${natural === 'nat1' ? styles.fumble : ''}`}
            >
              {natural === 'nat20' && (
                <motion.div
                  className={styles.criticalEffect}
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Sparkles size={32} />
                </motion.div>
              )}
              <span className={styles.total}>{currentRoll.total}</span>
              <span className={styles.formula}>{currentRoll.formula}</span>
              <span className={styles.breakdown}>
                [{currentRoll.dice.map(d => d.result).join(', ')}]
                {currentRoll.modifier !== 0 && ` ${currentRoll.modifier >= 0 ? '+' : ''}${currentRoll.modifier}`}
              </span>
              {natural === 'nat20' && <span className={styles.natLabel}>CRITICAL!</span>}
              {natural === 'nat1' && <span className={`${styles.natLabel} ${styles.fumbleLabel}`}>FUMBLE!</span>}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.emptyDisplay}
            >
              <Dice6 size={60} />
              <span>Select dice to roll</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dice Selection */}
      <div className={styles.diceSelection}>
        <h3>Select Dice</h3>
        <div className={styles.diceGrid}>
          {(Object.keys(diceCount) as DiceType[]).map(die => (
            <div key={die} className={styles.diceItem}>
              <button
                className={styles.diceBtn}
                style={{ '--dice-color': diceColors[die] } as React.CSSProperties}
                onClick={() => addDie(die)}
                onContextMenu={(e) => { e.preventDefault(); removeDie(die); }}
              >
                <span className={styles.diceLabel}>{die}</span>
              </button>
              {diceCount[die] > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={styles.diceCountBadge}
                >
                  {diceCount[die]}
                </motion.span>
              )}
              <button className={styles.quickRoll} onClick={() => quickRollDie(die)} title={`Quick roll ${die}`}>
                ⚡
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modifiers */}
      <div className={styles.modifiers}>
        <div className={styles.modifierControl}>
          <span>Modifier</span>
          <div className={styles.modifierInput}>
            <button onClick={() => setModifier(m => m - 1)}><Minus size={16} /></button>
            <input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
            />
            <button onClick={() => setModifier(m => m + 1)}><Plus size={16} /></button>
          </div>
        </div>

        <div className={styles.rollOptions}>
          <label className={`${styles.option} ${advantage ? styles.active : ''}`}>
            <input
              type="checkbox"
              checked={advantage}
              onChange={(e) => { setAdvantage(e.target.checked); if (e.target.checked) setDisadvantage(false); }}
            />
            Advantage
          </label>
          <label className={`${styles.option} ${disadvantage ? styles.active : ''}`}>
            <input
              type="checkbox"
              checked={disadvantage}
              onChange={(e) => { setDisadvantage(e.target.checked); if (e.target.checked) setAdvantage(false); }}
            />
            Disadvantage
          </label>
        </div>
      </div>

      {/* Roll Actions */}
      <div className={styles.rollActions}>
        <button className="btn btn-secondary" onClick={clearDice}>
          <RotateCcw size={18} /> Clear
        </button>
        <button
          className="btn btn-gold btn-lg"
          onClick={() => performRoll()}
          disabled={isRolling || !buildFormula()}
        >
          <Dice6 size={20} /> Roll {buildFormula() || 'Dice'}!
        </button>
      </div>

      {/* Custom Roll */}
      <div className={styles.customRoll}>
        <input
          type="text"
          placeholder="Custom formula (e.g., 2d6+4)"
          value={customFormula}
          onChange={(e) => setCustomFormula(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCustomRoll()}
        />
        <button className="btn btn-primary" onClick={handleCustomRoll}>Roll</button>
      </div>

      {/* Roll History */}
      <div className={styles.rollHistory}>
        <h3>Roll History</h3>
        <div className={styles.historyList}>
          {rollHistory.length === 0 ? (
            <p className={styles.emptyHistory}>No rolls yet</p>
          ) : (
            rollHistory.map(roll => (
              <motion.div
                key={roll.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={styles.historyItem}
              >
                <span className={styles.historyTotal}>{roll.total}</span>
                <span className={styles.historyFormula}>{roll.formula}</span>
                <span className={styles.historyTime}>
                  {new Date(roll.timestamp).toLocaleTimeString()}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
