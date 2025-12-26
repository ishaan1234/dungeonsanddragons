'use client';

import { Sparkles, Moon, Sun } from 'lucide-react';

interface SpellSlotLevel {
  current: number;
  max: number;
}

interface SpellSlots {
  level1?: SpellSlotLevel;
  level2?: SpellSlotLevel;
  level3?: SpellSlotLevel;
  level4?: SpellSlotLevel;
  level5?: SpellSlotLevel;
  level6?: SpellSlotLevel;
  level7?: SpellSlotLevel;
  level8?: SpellSlotLevel;
  level9?: SpellSlotLevel;
}

interface SpellSlotTrackerProps {
  spellSlots: SpellSlots;
  onSlotChange: (level: number, current: number) => void;
  onShortRest: () => void;
  onLongRest: () => void;
  isWarlock?: boolean;
}

const LEVEL_KEYS = [
  'level1',
  'level2',
  'level3',
  'level4',
  'level5',
  'level6',
  'level7',
  'level8',
  'level9',
] as const;

export default function SpellSlotTracker({
  spellSlots,
  onSlotChange,
  onShortRest,
  onLongRest,
  isWarlock = false,
}: SpellSlotTrackerProps) {
  // Get visible levels (only show levels where character has slots)
  const visibleLevels = LEVEL_KEYS.map((key, index) => ({
    key,
    level: index + 1,
    slots: spellSlots[key],
  })).filter((item) => item.slots && item.slots.max > 0);

  const handlePipClick = (level: number, pipIndex: number, slots: SpellSlotLevel) => {
    const used = slots.max - slots.current;

    // If clicking on a used slot (filled), mark it as available
    // If clicking on an available slot (empty), mark it as used
    if (pipIndex < used) {
      // This pip is currently used/filled, clicking makes it available
      // Reduce used count by 1 (increase current by 1)
      const newCurrent = slots.current + 1;
      onSlotChange(level, newCurrent);
    } else {
      // This pip is currently available/empty, clicking uses it
      // Increase used count (decrease current by 1)
      const newCurrent = slots.current - 1;
      if (newCurrent >= 0) {
        onSlotChange(level, newCurrent);
      }
    }
  };

  if (visibleLevels.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            {isWarlock ? 'Pact Magic' : 'Spell Slots'}
          </h3>
        </div>
      </div>

      {/* Spell Slot Levels */}
      <div className="space-y-3 mb-4">
        {visibleLevels.map(({ key, level, slots }) => {
          if (!slots) return null;
          const used = slots.max - slots.current;

          return (
            <div key={key} className="flex items-center gap-3">
              {/* Level Label */}
              <span className="text-sm font-medium text-slate-300 w-16 shrink-0">
                Level {level}:
              </span>

              {/* Slot Pips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {Array.from({ length: slots.max }).map((_, pipIndex) => {
                  const isUsed = pipIndex < used;

                  return (
                    <button
                      key={pipIndex}
                      onClick={() => handlePipClick(level, pipIndex, slots)}
                      className={`
                        w-5 h-5 rounded-full border-2 transition-all duration-150
                        hover:scale-110 hover:brightness-110
                        focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 focus:ring-offset-slate-800
                        ${isUsed
                          ? 'bg-purple-500 border-purple-400 shadow-[0_0_6px_rgba(168,85,247,0.5)]'
                          : 'bg-transparent border-slate-500 hover:border-purple-400'
                        }
                      `}
                      title={isUsed ? 'Click to recover slot' : 'Click to use slot'}
                      aria-label={`Level ${level} slot ${pipIndex + 1}: ${isUsed ? 'used' : 'available'}`}
                    />
                  );
                })}
              </div>

              {/* Slot Count */}
              <span className="text-xs text-slate-400 ml-auto">
                {slots.current}/{slots.max}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-700">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400" />
          <span>Used</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-transparent border-2 border-slate-500" />
          <span>Available</span>
        </div>
      </div>

      {/* Rest Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onShortRest}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                     bg-amber-600/20 hover:bg-amber-600/30
                     border border-amber-600/50 hover:border-amber-500
                     rounded-lg text-amber-400 text-sm font-medium
                     transition-all duration-150"
          title={isWarlock ? 'Recover all Pact Magic slots' : 'Short rest (1 hour)'}
        >
          <Moon size={16} />
          <span>Short Rest</span>
        </button>

        <button
          onClick={onLongRest}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2
                     bg-blue-600/20 hover:bg-blue-600/30
                     border border-blue-600/50 hover:border-blue-500
                     rounded-lg text-blue-400 text-sm font-medium
                     transition-all duration-150"
          title="Long rest - recover all spell slots (8 hours)"
        >
          <Sun size={16} />
          <span>Long Rest</span>
        </button>
      </div>

      {/* Warlock Note */}
      {isWarlock && (
        <p className="text-xs text-slate-500 mt-3 italic">
          Pact Magic slots recover on a short rest
        </p>
      )}
    </div>
  );
}
