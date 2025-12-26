'use client';

import { useState } from 'react';
import { Heart, Shield, Plus, Minus } from 'lucide-react';
import styles from './HPManager.module.css';

interface HPManagerProps {
    currentHP: number;
    maxHP: number;
    temporaryHP: number;
    onHPChange: (newHP: number) => void;
    onTempHPChange: (newTempHP: number) => void;
}

export default function HPManager({
    currentHP,
    maxHP,
    temporaryHP,
    onHPChange,
    onTempHPChange,
}: HPManagerProps) {
    const [customValue, setCustomValue] = useState<string>('');

    const hpPercent = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));

    const getHpBarColor = () => {
        if (hpPercent > 50) return 'bg-green-500';
        if (hpPercent > 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const handleQuickChange = (amount: number) => {
        const newHP = Math.max(0, Math.min(maxHP, currentHP + amount));
        onHPChange(newHP);
    };

    const handleDamage = () => {
        const value = parseInt(customValue, 10);
        if (isNaN(value) || value <= 0) return;

        let remainingDamage = value;

        // Temporary HP absorbs damage first
        if (temporaryHP > 0) {
            if (temporaryHP >= remainingDamage) {
                onTempHPChange(temporaryHP - remainingDamage);
                setCustomValue('');
                return;
            } else {
                remainingDamage -= temporaryHP;
                onTempHPChange(0);
            }
        }

        // Apply remaining damage to current HP
        const newHP = Math.max(0, currentHP - remainingDamage);
        onHPChange(newHP);
        setCustomValue('');
    };

    const handleHeal = () => {
        const value = parseInt(customValue, 10);
        if (isNaN(value) || value <= 0) return;

        const newHP = Math.min(maxHP, currentHP + value);
        onHPChange(newHP);
        setCustomValue('');
    };

    const handleTempHPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (isNaN(value)) {
            onTempHPChange(0);
        } else {
            onTempHPChange(Math.max(0, value));
        }
    };

    const quickButtons = [
        { amount: -10, label: '-10' },
        { amount: -5, label: '-5' },
        { amount: -1, label: '-1' },
        { amount: 1, label: '+1' },
        { amount: 5, label: '+5' },
        { amount: 10, label: '+10' },
    ];

    return (
        <div className={styles.container}>
            {/* HP Display */}
            <div className="flex items-center gap-2 mb-2">
                <Heart size={18} className="text-red-500" />
                <span className="text-sm font-medium text-gray-300">Hit Points</span>
            </div>

            {/* HP Numbers and Bar */}
            <div className="mb-3">
                <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-2xl font-bold text-white">{currentHP}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-lg text-gray-300">{maxHP}</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ${getHpBarColor()}`}
                        style={{ width: `${hpPercent}%` }}
                    />
                </div>
            </div>

            {/* Temporary HP */}
            <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-yellow-500" />
                <span className="text-sm text-gray-400">Temp HP:</span>
                <input
                    type="number"
                    value={temporaryHP}
                    onChange={handleTempHPChange}
                    min={0}
                    className={styles.tempHpInput}
                />
            </div>

            {/* Quick Buttons */}
            <div className="flex flex-wrap gap-1 mb-3">
                {quickButtons.map((btn) => (
                    <button
                        key={btn.amount}
                        onClick={() => handleQuickChange(btn.amount)}
                        className={`
                            px-2 py-1 text-sm font-medium rounded
                            transition-colors duration-150
                            ${btn.amount < 0
                                ? 'bg-red-900/50 text-red-300 hover:bg-red-800/60'
                                : 'bg-green-900/50 text-green-300 hover:bg-green-800/60'
                            }
                        `}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {/* Custom Damage/Heal */}
            <div className="flex gap-2">
                <input
                    type="number"
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                    placeholder="Amount"
                    min={1}
                    className={styles.customInput}
                />
                <button
                    onClick={handleDamage}
                    disabled={!customValue || parseInt(customValue, 10) <= 0}
                    className={`
                        flex items-center gap-1 px-3 py-1.5 rounded font-medium text-sm
                        bg-red-600 text-white hover:bg-red-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors duration-150
                    `}
                >
                    <Minus size={14} />
                    Damage
                </button>
                <button
                    onClick={handleHeal}
                    disabled={!customValue || parseInt(customValue, 10) <= 0}
                    className={`
                        flex items-center gap-1 px-3 py-1.5 rounded font-medium text-sm
                        bg-green-600 text-white hover:bg-green-500
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-colors duration-150
                    `}
                >
                    <Plus size={14} />
                    Heal
                </button>
            </div>
        </div>
    );
}
