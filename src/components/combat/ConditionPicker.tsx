'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import ConditionBadge, { getAllConditions, getConditionLabel, ConditionType } from './ConditionBadge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import styles from './ConditionPicker.module.css';

interface ConditionPickerProps {
    combatantId: string;
    combatantName: string;
    currentConditions: string[];
    onToggleCondition: (combatantId: string, condition: string) => Promise<void>;
    onClose: () => void;
}

const conditionDescriptions: Record<ConditionType, string> = {
    blinded: "Can't see. Auto-fail checks requiring sight. Attack rolls have disadvantage; attacks against have advantage.",
    charmed: "Can't attack the charmer. Charmer has advantage on social checks.",
    deafened: "Can't hear. Auto-fail checks requiring hearing.",
    frightened: "Disadvantage on checks/attacks while source is visible. Can't willingly move closer.",
    grappled: "Speed becomes 0. Ends if grappler is incapacitated or effect moves target out of reach.",
    incapacitated: "Can't take actions or reactions.",
    invisible: "Impossible to see without special sense. Attacks have advantage; attacks against have disadvantage.",
    paralyzed: "Incapacitated, can't move or speak. Auto-fail STR/DEX saves. Attacks have advantage; melee hits are crits.",
    petrified: "Transformed to stone. Weight x10. Incapacitated. Resistance to all damage. Immune to poison/disease.",
    poisoned: "Disadvantage on attack rolls and ability checks.",
    prone: "Can only crawl. Disadvantage on attacks. Melee attacks have advantage; ranged have disadvantage.",
    restrained: "Speed 0. Attacks have disadvantage; attacks against have advantage. Disadvantage on DEX saves.",
    stunned: "Incapacitated, can't move, can speak only falteringly. Auto-fail STR/DEX saves. Attacks have advantage.",
    unconscious: "Incapacitated, drops items, falls prone. Auto-fail STR/DEX saves. Attacks have advantage; melee crits.",
    exhaustion: "Cumulative levels with increasing penalties. Level 6 causes death.",
};

export default function ConditionPicker({
    combatantId,
    combatantName,
    currentConditions,
    onToggleCondition,
    onClose
}: ConditionPickerProps) {
    const [hoveredCondition, setHoveredCondition] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);

    const allConditions = getAllConditions();

    const handleToggle = async (condition: string) => {
        setIsUpdating(condition);
        try {
            await onToggleCondition(combatantId, condition);
        } finally {
            setIsUpdating(null);
        }
    };

    const isActive = (condition: string) => currentConditions.includes(condition);

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogContent className={styles.dialogContent}>
                <DialogHeader>
                    <DialogTitle className={styles.dialogTitle}>
                        Conditions: {combatantName}
                    </DialogTitle>
                </DialogHeader>

                {currentConditions.length > 0 && (
                    <div className={styles.activeConditions}>
                        <span className={styles.sectionLabel}>Active</span>
                        <div className={styles.activeBadges}>
                            {currentConditions.map(condition => (
                                <ConditionBadge
                                    key={condition}
                                    condition={condition}
                                    size="md"
                                    showLabel
                                    onRemove={() => handleToggle(condition)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className={styles.conditionGrid}>
                    {allConditions.map(condition => {
                        const active = isActive(condition);
                        const updating = isUpdating === condition;

                        return (
                            <button
                                key={condition}
                                className={`${styles.conditionBtn} ${active ? styles.active : ''}`}
                                onClick={() => handleToggle(condition)}
                                onMouseEnter={() => setHoveredCondition(condition)}
                                onMouseLeave={() => setHoveredCondition(null)}
                                disabled={updating}
                            >
                                <ConditionBadge condition={condition} size="md" />
                                <span className={styles.conditionName}>{getConditionLabel(condition)}</span>
                                {active && (
                                    <Check size={14} className={styles.checkIcon} />
                                )}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence mode="wait">
                    {hoveredCondition && (
                        <motion.div
                            className={styles.description}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <AlertCircle size={14} />
                            <p>{conditionDescriptions[hoveredCondition as ConditionType]}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}
