'use client';

import {
    Eye, EyeOff, Heart, Ear, EarOff, Ghost, Hand,
    Brain, Sparkles, Skull, Zap, Droplets, PersonStanding,
    Link2, Target, Moon, AlertTriangle
} from 'lucide-react';
import styles from './ConditionBadge.module.css';

export type ConditionType =
    | 'blinded' | 'charmed' | 'deafened' | 'frightened' | 'grappled'
    | 'incapacitated' | 'invisible' | 'paralyzed' | 'petrified' | 'poisoned'
    | 'prone' | 'restrained' | 'stunned' | 'unconscious' | 'exhaustion';

interface ConditionBadgeProps {
    condition: string;
    size?: 'sm' | 'md';
    showLabel?: boolean;
    onRemove?: () => void;
}

const conditionConfig: Record<ConditionType, { icon: React.ElementType; color: string; label: string }> = {
    blinded: { icon: EyeOff, color: 'gray', label: 'Blinded' },
    charmed: { icon: Heart, color: 'pink', label: 'Charmed' },
    deafened: { icon: EarOff, color: 'gray', label: 'Deafened' },
    frightened: { icon: Ghost, color: 'purple', label: 'Frightened' },
    grappled: { icon: Hand, color: 'orange', label: 'Grappled' },
    incapacitated: { icon: Brain, color: 'red', label: 'Incapacitated' },
    invisible: { icon: Sparkles, color: 'cyan', label: 'Invisible' },
    paralyzed: { icon: Zap, color: 'yellow', label: 'Paralyzed' },
    petrified: { icon: Target, color: 'brown', label: 'Petrified' },
    poisoned: { icon: Droplets, color: 'green', label: 'Poisoned' },
    prone: { icon: PersonStanding, color: 'blue', label: 'Prone' },
    restrained: { icon: Link2, color: 'orange', label: 'Restrained' },
    stunned: { icon: AlertTriangle, color: 'yellow', label: 'Stunned' },
    unconscious: { icon: Moon, color: 'darkblue', label: 'Unconscious' },
    exhaustion: { icon: Skull, color: 'red', label: 'Exhaustion' },
};

export default function ConditionBadge({
    condition,
    size = 'sm',
    showLabel = false,
    onRemove
}: ConditionBadgeProps) {
    const config = conditionConfig[condition as ConditionType];

    if (!config) {
        return null;
    }

    const Icon = config.icon;

    return (
        <span
            className={`${styles.badge} ${styles[config.color]} ${styles[size]}`}
            title={config.label}
            onClick={onRemove}
            style={{ cursor: onRemove ? 'pointer' : 'default' }}
        >
            <Icon size={size === 'sm' ? 10 : 14} />
            {showLabel && <span className={styles.label}>{config.label}</span>}
        </span>
    );
}

export function getConditionLabel(condition: string): string {
    const config = conditionConfig[condition as ConditionType];
    return config?.label || condition;
}

export function getAllConditions(): ConditionType[] {
    return Object.keys(conditionConfig) as ConditionType[];
}
