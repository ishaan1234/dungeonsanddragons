'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Check, Dice6, RefreshCw } from 'lucide-react';
import { Character, AbilityScores, AbilityScore } from '@/types';
import { races, getRaceById, getSubraceById } from '@/data/races';
import { classes, getClassById, calculateProficiencyBonus, getHitDieMax } from '@/data/classes';
import { useAppStore } from '@/stores/appStore';
import { rollAbilityScore, STANDARD_ARRAY, POINT_BUY_COSTS, POINT_BUY_TOTAL } from '@/lib/dice';

interface CharacterCreatorProps {
  onClose: () => void;
}

const steps = ['Basics', 'Race', 'Class', 'Abilities', 'Background', 'Review'];
const abilityNames: AbilityScore[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

const backgrounds = [
  { id: 'acolyte', name: 'Acolyte', description: 'You have spent your life in the service of a temple.' },
  { id: 'criminal', name: 'Criminal', description: 'You are an experienced criminal with a history of breaking the law.' },
  { id: 'folk-hero', name: 'Folk Hero', description: 'You come from a humble social rank, but you are destined for so much more.' },
  { id: 'noble', name: 'Noble', description: 'You understand wealth, power, and privilege.' },
  { id: 'sage', name: 'Sage', description: 'You spent years learning the lore of the multiverse.' },
  { id: 'soldier', name: 'Soldier', description: 'War has been your life for as long as you care to remember.' },
  { id: 'outlander', name: 'Outlander', description: 'You grew up in the wilds, far from civilization.' },
  { id: 'hermit', name: 'Hermit', description: 'You lived in seclusion for a formative part of your life.' },
];

export default function CharacterCreator({ onClose }: CharacterCreatorProps) {
  const { addCharacter, userName } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);

  // Form state
  const [name, setName] = useState('');
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedSubrace, setSelectedSubrace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBackground, setSelectedBackground] = useState('');
  const [abilityMethod, setAbilityMethod] = useState<'standard' | 'pointbuy' | 'roll'>('standard');
  const [abilityScores, setAbilityScores] = useState<AbilityScores>({
    strength: 10, dexterity: 10, constitution: 10,
    intelligence: 10, wisdom: 10, charisma: 10,
  });
  const [standardArrayAssigned, setStandardArrayAssigned] = useState<Record<AbilityScore, number | null>>({
    strength: null, dexterity: null, constitution: null,
    intelligence: null, wisdom: null, charisma: null,
  });
  const [pointBuyScores, setPointBuyScores] = useState<AbilityScores>({
    strength: 8, dexterity: 8, constitution: 8,
    intelligence: 8, wisdom: 8, charisma: 8,
  });
  const [backstory, setBackstory] = useState('');

  // Derived values
  const raceData = useMemo(() => getRaceById(selectedRace), [selectedRace]);
  const subraceData = useMemo(() => selectedSubrace ? getSubraceById(selectedRace, selectedSubrace) : null, [selectedRace, selectedSubrace]);
  const classData = useMemo(() => getClassById(selectedClass), [selectedClass]);

  const pointsSpent = useMemo(() => {
    return abilityNames.reduce((sum, ability) => sum + (POINT_BUY_COSTS[pointBuyScores[ability]] || 0), 0);
  }, [pointBuyScores]);

  const pointsRemaining = POINT_BUY_TOTAL - pointsSpent;

  // Handle standard array assignment
  const remainingStandardValues = useMemo(() => {
    const assigned = Object.values(standardArrayAssigned).filter(v => v !== null) as number[];
    return STANDARD_ARRAY.filter(v => !assigned.includes(v));
  }, [standardArrayAssigned]);

  const assignStandardValue = (ability: AbilityScore, value: number) => {
    setStandardArrayAssigned(prev => {
      const newAssigned = { ...prev };
      // Clear if selecting same value
      if (prev[ability] === value) {
        newAssigned[ability] = null;
      } else {
        // Clear this value from any other ability
        Object.keys(newAssigned).forEach(key => {
          if (newAssigned[key as AbilityScore] === value) {
            newAssigned[key as AbilityScore] = null;
          }
        });
        newAssigned[ability] = value;
      }
      return newAssigned;
    });
  };

  const rollNewScores = () => {
    const newScores: AbilityScores = {
      strength: rollAbilityScore().total,
      dexterity: rollAbilityScore().total,
      constitution: rollAbilityScore().total,
      intelligence: rollAbilityScore().total,
      wisdom: rollAbilityScore().total,
      charisma: rollAbilityScore().total,
    };
    setAbilityScores(newScores);
  };

  const adjustPointBuy = (ability: AbilityScore, delta: number) => {
    setPointBuyScores(prev => {
      const newValue = prev[ability] + delta;
      if (newValue < 8 || newValue > 15) return prev;
      const newScores = { ...prev, [ability]: newValue };
      const newPointsSpent = abilityNames.reduce((sum, ab) => sum + (POINT_BUY_COSTS[newScores[ab]] || 0), 0);
      if (newPointsSpent > POINT_BUY_TOTAL) return prev;
      return newScores;
    });
  };

  // Get final ability scores with racial bonuses
  const getFinalScores = (): AbilityScores => {
    let base: AbilityScores;

    if (abilityMethod === 'standard') {
      base = { ...abilityScores };
      abilityNames.forEach(ability => {
        base[ability] = standardArrayAssigned[ability] || 10;
      });
    } else if (abilityMethod === 'pointbuy') {
      base = { ...pointBuyScores };
    } else {
      base = { ...abilityScores };
    }

    // Apply racial bonuses
    if (raceData?.abilityScoreIncreases) {
      Object.entries(raceData.abilityScoreIncreases).forEach(([ability, bonus]) => {
        base[ability as AbilityScore] += bonus;
      });
    }
    if (subraceData?.abilityScoreIncreases) {
      Object.entries(subraceData.abilityScoreIncreases).forEach(([ability, bonus]) => {
        base[ability as AbilityScore] += bonus;
      });
    }

    return base;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return name.trim().length > 0;
      case 1: return selectedRace.length > 0;
      case 2: return selectedClass.length > 0;
      case 3:
        if (abilityMethod === 'standard') {
          return Object.values(standardArrayAssigned).every(v => v !== null);
        }
        return true;
      case 4: return selectedBackground.length > 0;
      default: return true;
    }
  };

  const handleCreate = () => {
    const finalScores = getFinalScores();
    const conMod = Math.floor((finalScores.constitution - 10) / 2);
    const hitDieMax = classData ? getHitDieMax(classData.hitDie) : 10;
    const maxHp = hitDieMax + conMod;

    const character: Character = {
      id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      playerName: userName,
      race: selectedRace,
      subrace: selectedSubrace || undefined,
      class: selectedClass,
      level: 1,
      experiencePoints: 0,
      background: selectedBackground,
      alignment: 'true neutral',
      abilityScores: finalScores,
      maxHitPoints: maxHp,
      currentHitPoints: maxHp,
      temporaryHitPoints: 0,
      armorClass: 10 + Math.floor((finalScores.dexterity - 10) / 2),
      initiative: Math.floor((finalScores.dexterity - 10) / 2),
      speed: raceData?.speed || 30,
      proficiencyBonus: calculateProficiencyBonus(1),
      skillProficiencies: [],
      savingThrowProficiencies: classData?.savingThrowProficiencies || [],
      languages: raceData?.languages || ['Common'],
      features: [],
      equipment: [],
      inventory: [],
      currency: { copper: 0, silver: 0, electrum: 0, gold: 0, platinum: 0 },
      conditions: [],
      deathSaves: { successes: 0, failures: 0 },
      backstory,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    addCharacter(character);
    onClose();
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <div className="modal-header">
          <h2>Create Character</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="steps-indicator">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <span className="step-number">{index < currentStep ? <Check size={14} /> : index + 1}</span>
              <span className="step-label">{step}</span>
            </div>
          ))}
        </div>

        <div className="modal-body">
          <AnimatePresence mode="wait">
            {/* Step 0: Basics */}
            {currentStep === 0 && (
              <motion.div key="basics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-content">
                <h3>Basic Information</h3>
                <div className="form-group">
                  <label htmlFor="char-name">Character Name</label>
                  <input
                    type="text"
                    id="char-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your character's name"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}

            {/* Step 1: Race */}
            {currentStep === 1 && (
              <motion.div key="race" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-content">
                <h3>Choose Your Race</h3>
                <div className="selection-grid">
                  {races.map(race => (
                    <button
                      key={race.id}
                      className={`selection-card ${selectedRace === race.id ? 'selected' : ''}`}
                      onClick={() => { setSelectedRace(race.id); setSelectedSubrace(''); }}
                    >
                      <span className="selection-name">{race.name}</span>
                      <span className="selection-desc">{race.description.slice(0, 80)}...</span>
                    </button>
                  ))}
                </div>
                {raceData?.subraces && raceData.subraces.length > 0 && (
                  <div className="subrace-selection">
                    <h4>Choose Subrace</h4>
                    <div className="selection-row">
                      {raceData.subraces.map(sub => (
                        <button
                          key={sub.id}
                          className={`selection-btn ${selectedSubrace === sub.id ? 'selected' : ''}`}
                          onClick={() => setSelectedSubrace(sub.id)}
                        >
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Class */}
            {currentStep === 2 && (
              <motion.div key="class" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-content">
                <h3>Choose Your Class</h3>
                <div className="selection-grid">
                  {classes.map(cls => (
                    <button
                      key={cls.id}
                      className={`selection-card ${selectedClass === cls.id ? 'selected' : ''}`}
                      onClick={() => setSelectedClass(cls.id)}
                    >
                      <span className="selection-name">{cls.name}</span>
                      <span className="selection-meta">Hit Die: {cls.hitDie}</span>
                      <span className="selection-desc">{cls.description.slice(0, 60)}...</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Ability Scores */}
            {currentStep === 3 && (
              <motion.div key="abilities" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-content">
                <h3>Ability Scores</h3>
                <div className="ability-methods">
                  <button className={`method-btn ${abilityMethod === 'standard' ? 'active' : ''}`} onClick={() => setAbilityMethod('standard')}>Standard Array</button>
                  <button className={`method-btn ${abilityMethod === 'pointbuy' ? 'active' : ''}`} onClick={() => setAbilityMethod('pointbuy')}>Point Buy</button>
                  <button className={`method-btn ${abilityMethod === 'roll' ? 'active' : ''}`} onClick={() => setAbilityMethod('roll')}>Roll</button>
                </div>

                {abilityMethod === 'standard' && (
                  <div className="standard-array">
                    <p className="hint">Assign values: {STANDARD_ARRAY.join(', ')}</p>
                    <div className="ability-assignment">
                      {abilityNames.map(ability => (
                        <div key={ability} className="ability-row">
                          <span className="ability-name">{ability.slice(0, 3).toUpperCase()}</span>
                          <div className="value-options">
                            {STANDARD_ARRAY.map(value => (
                              <button
                                key={value}
                                className={`value-btn ${standardArrayAssigned[ability] === value ? 'selected' : ''} ${!remainingStandardValues.includes(value) && standardArrayAssigned[ability] !== value ? 'disabled' : ''}`}
                                onClick={() => assignStandardValue(ability, value)}
                                disabled={!remainingStandardValues.includes(value) && standardArrayAssigned[ability] !== value}
                              >
                                {value}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {abilityMethod === 'pointbuy' && (
                  <div className="point-buy">
                    <p className="hint">Points remaining: <strong>{pointsRemaining}</strong></p>
                    <div className="ability-inputs">
                      {abilityNames.map(ability => (
                        <div key={ability} className="ability-input-row">
                          <span className="ability-name">{ability.slice(0, 3).toUpperCase()}</span>
                          <button onClick={() => adjustPointBuy(ability, -1)}>-</button>
                          <span className="ability-value">{pointBuyScores[ability]}</span>
                          <button onClick={() => adjustPointBuy(ability, 1)}>+</button>
                          <span className="cost">({POINT_BUY_COSTS[pointBuyScores[ability]]} pts)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {abilityMethod === 'roll' && (
                  <div className="roll-method">
                    <button className="btn btn-secondary" onClick={rollNewScores}>
                      <Dice6 size={16} /> Roll 4d6 Drop Lowest
                    </button>
                    <div className="rolled-scores">
                      {abilityNames.map(ability => (
                        <div key={ability} className="rolled-score">
                          <span className="ability-name">{ability.slice(0, 3).toUpperCase()}</span>
                          <span className="ability-value">{abilityScores[ability]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Background */}
            {currentStep === 4 && (
              <motion.div key="background" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-content">
                <h3>Choose Background</h3>
                <div className="selection-grid small">
                  {backgrounds.map(bg => (
                    <button
                      key={bg.id}
                      className={`selection-card ${selectedBackground === bg.id ? 'selected' : ''}`}
                      onClick={() => setSelectedBackground(bg.id)}
                    >
                      <span className="selection-name">{bg.name}</span>
                      <span className="selection-desc">{bg.description}</span>
                    </button>
                  ))}
                </div>
                <div className="form-group">
                  <label htmlFor="backstory">Backstory (Optional)</label>
                  <textarea
                    id="backstory"
                    value={backstory}
                    onChange={(e) => setBackstory(e.target.value)}
                    placeholder="Write your character's history..."
                    rows={4}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="step-content">
                <h3>Review Your Character</h3>
                <div className="review-summary">
                  <div className="review-item"><strong>Name:</strong> {name}</div>
                  <div className="review-item"><strong>Race:</strong> {raceData?.name} {subraceData ? `(${subraceData.name})` : ''}</div>
                  <div className="review-item"><strong>Class:</strong> {classData?.name}</div>
                  <div className="review-item"><strong>Background:</strong> {backgrounds.find(b => b.id === selectedBackground)?.name}</div>
                  <div className="review-abilities">
                    <strong>Ability Scores (with racial bonuses):</strong>
                    <div className="abilities-preview">
                      {abilityNames.map(ability => (
                        <span key={ability}>{ability.slice(0, 3).toUpperCase()}: {getFinalScores()[ability]}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentStep(s => s - 1)}
            disabled={currentStep === 0}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          {currentStep < steps.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={!canProceed()}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button className="btn btn-gold" onClick={handleCreate}>
              <Check size={16} /> Create Character
            </button>
          )}
        </div>
      </motion.div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          background: var(--bg-dark);
          border: 1px solid var(--bg-medium);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--bg-medium);
        }

        .modal-header h2 {
          font-size: 1.25rem;
        }

        .steps-indicator {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: var(--bg-darker);
          border-bottom: 1px solid var(--bg-medium);
          overflow-x: auto;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          color: var(--text-muted);
          white-space: nowrap;
        }

        .step.active {
          background: var(--primary-600);
          color: white;
        }

        .step.completed {
          color: var(--success);
        }

        .step-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          background: var(--bg-medium);
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .step.active .step-number {
          background: rgba(255, 255, 255, 0.2);
        }

        .step.completed .step-number {
          background: var(--success);
          color: white;
        }

        .modal-body {
          flex: 1;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .step-content h3 {
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .selection-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .selection-grid.small {
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        }

        .selection-card {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding: 1rem;
          background: var(--bg-darker);
          border: 2px solid var(--bg-medium);
          border-radius: var(--radius-md);
          text-align: left;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .selection-card:hover {
          border-color: var(--primary-500);
        }

        .selection-card.selected {
          border-color: var(--primary-500);
          background: rgba(139, 92, 246, 0.1);
        }

        .selection-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .selection-meta {
          font-size: 0.75rem;
          color: var(--primary-400);
        }

        .selection-desc {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .subrace-selection {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--bg-medium);
        }

        .subrace-selection h4 {
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .selection-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .selection-btn {
          padding: 0.5rem 1rem;
          background: var(--bg-darker);
          border: 1px solid var(--bg-medium);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .selection-btn:hover, .selection-btn.selected {
          border-color: var(--primary-500);
          color: var(--primary-400);
        }

        .ability-methods {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .method-btn {
          flex: 1;
          padding: 0.75rem;
          background: var(--bg-darker);
          border: 1px solid var(--bg-medium);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .method-btn:hover, .method-btn.active {
          border-color: var(--primary-500);
          color: var(--primary-400);
        }

        .hint {
          margin-bottom: 1rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .ability-assignment, .ability-inputs {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .ability-row, .ability-input-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .ability-name {
          width: 40px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .value-options {
          display: flex;
          gap: 0.5rem;
        }

        .value-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-darker);
          border: 1px solid var(--bg-medium);
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .value-btn:hover:not(.disabled), .value-btn.selected {
          border-color: var(--primary-500);
          color: var(--primary-400);
        }

        .value-btn.selected {
          background: var(--primary-600);
          color: white;
        }

        .value-btn.disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .ability-input-row button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-medium);
          border: none;
          border-radius: var(--radius-sm);
          color: var(--text-primary);
          cursor: pointer;
        }

        .ability-input-row button:hover {
          background: var(--primary-600);
        }

        .ability-value {
          width: 40px;
          text-align: center;
          font-weight: 600;
          font-size: 1.25rem;
        }

        .cost {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        .roll-method {
          text-align: center;
        }

        .roll-method .btn {
          margin-bottom: 1.5rem;
        }

        .rolled-scores {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .rolled-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          background: var(--bg-darker);
          border-radius: var(--radius-md);
          min-width: 60px;
        }

        .rolled-score .ability-value {
          font-family: var(--font-display);
          font-size: 1.5rem;
          color: var(--gold-400);
        }

        .review-summary {
          background: var(--bg-darker);
          border-radius: var(--radius-md);
          padding: 1.5rem;
        }

        .review-item {
          margin-bottom: 0.75rem;
          color: var(--text-secondary);
        }

        .review-item strong {
          color: var(--text-primary);
        }

        .review-abilities {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--bg-medium);
        }

        .abilities-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .abilities-preview span {
          padding: 0.5rem 1rem;
          background: var(--bg-medium);
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
        }

        .modal-footer {
          display: flex;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--bg-medium);
          background: var(--bg-darker);
        }

        @media (max-width: 600px) {
          .steps-indicator {
            justify-content: flex-start;
          }

          .step-label {
            display: none;
          }

          .selection-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  );
}
