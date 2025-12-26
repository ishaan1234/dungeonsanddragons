'use client';

import { useState, useRef, useEffect } from 'react';
import { Dices, Plus, Minus } from 'lucide-react';
import { quickRoll, executeRoll, formatRollResult, checkNatural } from '@/lib/dice';
import { DiceType, DiceRoll } from '@/types';
import styles from './QuickDiceRoller.module.css';

interface QuickDiceRollerProps {
    rolledBy: string;
    onRoll: (message: string) => void;
}

const DICE_TYPES: DiceType[] = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];

export default function QuickDiceRoller({ rolledBy, onRoll }: QuickDiceRollerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [modifier, setModifier] = useState(0);
    const [lastRoll, setLastRoll] = useState<DiceRoll | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRoll = (die: DiceType) => {
        const roll = quickRoll(die, modifier, rolledBy);
        setLastRoll(roll);

        const natural = checkNatural(roll);
        let message = `🎲 rolled ${roll.formula}: ${formatRollResult(roll)}`;
        if (natural === 'nat20') message += ' ✨ NAT 20!';
        if (natural === 'nat1') message += ' 💀 NAT 1!';

        onRoll(message);
    };

    const handleCustomRoll = (formula: string) => {
        const roll = executeRoll(formula, rolledBy);
        setLastRoll(roll);

        const natural = checkNatural(roll);
        let message = `🎲 rolled ${roll.formula}: ${formatRollResult(roll)}`;
        if (natural === 'nat20') message += ' ✨ NAT 20!';
        if (natural === 'nat1') message += ' 💀 NAT 1!';

        onRoll(message);
    };

    return (
        <div className={styles.container} ref={dropdownRef}>
            <button
                className="btn btn-secondary btn-sm text-xs md:text-sm"
                onClick={() => setIsOpen(!isOpen)}
                title="Quick Dice Roller"
            >
                <Dices size={14} className="md:w-4 md:h-4" />
                <span className="hidden md:inline">Dice</span>
            </button>

            {isOpen && (
                <div className={styles.dropdown}>
                    <div className={styles.header}>
                        <Dices size={16} />
                        <span>Quick Roll</span>
                    </div>

                    <div className={styles.diceGrid}>
                        {DICE_TYPES.map((die) => (
                            <button
                                key={die}
                                className={styles.dieButton}
                                onClick={() => handleRoll(die)}
                            >
                                {die}
                            </button>
                        ))}
                    </div>

                    <div className={styles.modifierRow}>
                        <span className={styles.modLabel}>Modifier:</span>
                        <button
                            className={styles.modBtn}
                            onClick={() => setModifier(m => m - 1)}
                        >
                            <Minus size={12} />
                        </button>
                        <span className={styles.modValue}>
                            {modifier >= 0 ? `+${modifier}` : modifier}
                        </span>
                        <button
                            className={styles.modBtn}
                            onClick={() => setModifier(m => m + 1)}
                        >
                            <Plus size={12} />
                        </button>
                    </div>

                    <div className={styles.quickRolls}>
                        <button
                            className={styles.quickBtn}
                            onClick={() => handleCustomRoll('2d6')}
                        >
                            2d6
                        </button>
                        <button
                            className={styles.quickBtn}
                            onClick={() => handleCustomRoll('4d6k3')}
                            title="4d6 keep highest 3"
                        >
                            4d6k3
                        </button>
                        <button
                            className={styles.quickBtn}
                            onClick={() => handleCustomRoll('1d20+1d4')}
                            title="Guidance"
                        >
                            d20+d4
                        </button>
                    </div>

                    {lastRoll && (
                        <div className={styles.lastRoll}>
                            <span className={styles.lastLabel}>Last:</span>
                            <span className={styles.lastResult}>
                                {lastRoll.formula} = <strong>{lastRoll.total}</strong>
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
