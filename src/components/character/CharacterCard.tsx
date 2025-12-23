'use client';

import { motion } from 'framer-motion';
import { Heart, Shield, Zap, Eye, Edit, Trash2, ChevronRight } from 'lucide-react';
import { Character } from '@/types';
import { getClassById, calculateProficiencyBonus } from '@/data/classes';
import { getRaceById } from '@/data/races';

interface CharacterCardProps {
    character: Character;
    onSelect?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const classColors: Record<string, string> = {
    barbarian: '#e53e3e',
    bard: '#9f7aea',
    cleric: '#faf089',
    druid: '#48bb78',
    fighter: '#ed8936',
    monk: '#38b2ac',
    paladin: '#ffd700',
    ranger: '#68d391',
    rogue: '#4a5568',
    sorcerer: '#f56565',
    warlock: '#9f7aea',
    wizard: '#63b3ed',
};

export default function CharacterCard({ character, onSelect, onEdit, onDelete }: CharacterCardProps) {
    const classData = getClassById(character.class);
    const raceData = getRaceById(character.race);
    const classColor = classColors[character.class] || 'var(--primary-500)';

    const getModifier = (score: number) => {
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : mod.toString();
    };

    const hpPercentage = (character.currentHitPoints / character.maxHitPoints) * 100;

    return (
        <motion.div
            className="character-card"
            whileHover={{ y: -4 }}
            style={{ '--class-color': classColor } as React.CSSProperties}
        >
            <div className="card-header">
                <div className="portrait">
                    {character.portrait ? (
                        <img src={character.portrait} alt={character.name} />
                    ) : (
                        <span className="portrait-placeholder">
                            {character.name.charAt(0).toUpperCase()}
                        </span>
                    )}
                    <span className="level-badge">Lv. {character.level}</span>
                </div>
                <div className="info">
                    <h3 className="name">{character.name}</h3>
                    <p className="class-race">
                        {raceData?.name || character.race} {classData?.name || character.class}
                    </p>
                </div>
            </div>

            <div className="card-body">
                {/* HP Bar */}
                <div className="hp-section">
                    <div className="hp-info">
                        <Heart size={16} className="hp-icon" />
                        <span>{character.currentHitPoints} / {character.maxHitPoints}</span>
                        {character.temporaryHitPoints > 0 && (
                            <span className="temp-hp">+{character.temporaryHitPoints}</span>
                        )}
                    </div>
                    <div className="hp-bar">
                        <div
                            className="hp-fill"
                            style={{
                                width: `${Math.min(hpPercentage, 100)}%`,
                                background: hpPercentage > 50 ? 'var(--success)' : hpPercentage > 25 ? 'var(--warning)' : 'var(--danger)'
                            }}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="stats-row">
                    <div className="stat">
                        <Shield size={16} />
                        <span className="stat-value">{character.armorClass}</span>
                        <span className="stat-label">AC</span>
                    </div>
                    <div className="stat">
                        <Zap size={16} />
                        <span className="stat-value">{getModifier(character.abilityScores.dexterity)}</span>
                        <span className="stat-label">Init</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{character.speed}</span>
                        <span className="stat-label">Speed</span>
                    </div>
                </div>

                {/* Ability Scores */}
                <div className="abilities-grid">
                    {Object.entries(character.abilityScores).map(([ability, score]) => (
                        <div key={ability} className="ability">
                            <span className="ability-name">{ability.slice(0, 3).toUpperCase()}</span>
                            <span className="ability-mod">{getModifier(score)}</span>
                            <span className="ability-score">{score}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="card-footer">
                <button className="action-btn" onClick={onSelect} title="View Details">
                    <Eye size={16} />
                </button>
                <button className="action-btn" onClick={onEdit} title="Edit Character">
                    <Edit size={16} />
                </button>
                <button className="action-btn delete" onClick={onDelete} title="Delete Character">
                    <Trash2 size={16} />
                </button>
                <button className="btn btn-sm btn-primary" onClick={onSelect}>
                    View <ChevronRight size={14} />
                </button>
            </div>

            <style jsx>{`
        .character-card {
          background: var(--bg-dark);
          border: 1px solid var(--bg-medium);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-fast);
        }

        .character-card:hover {
          border-color: var(--class-color);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, var(--bg-darker), var(--bg-dark));
          border-bottom: 1px solid var(--bg-medium);
        }

        .portrait {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-medium);
          flex-shrink: 0;
        }

        .portrait img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .portrait-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--class-color);
          background: linear-gradient(135deg, var(--bg-medium), var(--bg-light));
        }

        .level-badge {
          position: absolute;
          bottom: -4px;
          right: -4px;
          padding: 0.125rem 0.375rem;
          background: var(--class-color);
          color: white;
          font-size: 0.625rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
        }

        .info {
          flex: 1;
          min-width: 0;
        }

        .name {
          font-size: 1.125rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .class-race {
          font-size: 0.875rem;
          color: var(--class-color);
        }

        .card-body {
          padding: 1.25rem;
        }

        .hp-section {
          margin-bottom: 1rem;
        }

        .hp-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .hp-icon {
          color: var(--danger);
        }

        .temp-hp {
          color: var(--info);
          font-size: 0.75rem;
        }

        .hp-bar {
          height: 6px;
          background: var(--bg-darker);
          border-radius: 3px;
          overflow: hidden;
        }

        .hp-fill {
          height: 100%;
          transition: width var(--transition-normal);
        }

        .stats-row {
          display: flex;
          justify-content: space-around;
          padding: 0.75rem 0;
          margin-bottom: 1rem;
          border-top: 1px solid var(--bg-medium);
          border-bottom: 1px solid var(--bg-medium);
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          color: var(--text-secondary);
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .stat-label {
          font-size: 0.625rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .abilities-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 0.5rem;
        }

        .ability {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem 0.25rem;
          background: var(--bg-darker);
          border-radius: var(--radius-sm);
        }

        .ability-name {
          font-size: 0.625rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .ability-mod {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .ability-score {
          font-size: 0.625rem;
          color: var(--text-muted);
        }

        .card-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--bg-darker);
          border-top: 1px solid var(--bg-medium);
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: transparent;
          border: 1px solid var(--bg-medium);
          border-radius: var(--radius-sm);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .action-btn:hover {
          background: var(--bg-medium);
          color: var(--text-primary);
        }

        .action-btn.delete:hover {
          background: var(--danger);
          border-color: var(--danger);
          color: white;
        }

        .card-footer .btn {
          margin-left: auto;
        }
      `}</style>
        </motion.div>
    );
}
