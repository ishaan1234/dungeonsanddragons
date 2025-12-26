'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Swords, Save } from 'lucide-react';
import { Spell, SpellSchool, DamageType, DiceType } from '@/types';
import { addCustomSpell } from '@/lib/firebase'; // Ensure this is exported now
import { classes } from '@/data/classes'; // To get list of classes
import { spellSchools } from '@/data/spells';

interface SpellCreatorProps {
    sessionCode: string;
    onClose: () => void;
}

export default function SpellCreator({ sessionCode, onClose }: SpellCreatorProps) {
    const [name, setName] = useState('');
    const [level, setLevel] = useState(1);
    const [school, setSchool] = useState<SpellSchool>('evocation');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [castingTime, setCastingTime] = useState('1 action');
    const [range, setRange] = useState('60 feet');
    const [duration, setDuration] = useState('Instantaneous');
    const [description, setDescription] = useState('');

    // Damage/Healing
    const [hasDamage, setHasDamage] = useState(false);
    const [damageDice, setDamageDice] = useState('1d8');
    const [damageType, setDamageType] = useState<DamageType>('fire');

    const [hasHealing, setHasHealing] = useState(false);
    const [healingDice, setHealingDice] = useState('1d8');

    const toggleClass = (clsId: string) => {
        setSelectedClasses(prev =>
            prev.includes(clsId) ? prev.filter(c => c !== clsId) : [...prev, clsId]
        );
    };

    const handleCreate = async () => {
        if (!name || !description) return;

        const spell: Spell = {
            id: `custom_${Date.now()}`,
            name,
            level,
            school,
            castingTime,
            range,
            duration,
            components: { verbal: true, somatic: true }, // Simplified
            description,
            classes: selectedClasses.length > 0 ? selectedClasses : ['any'], // 'any' for all classes
            damage: hasDamage ? { dice: damageDice, type: damageType } : undefined,
            healing: hasHealing ? healingDice : undefined,
        };

        try {
            await addCustomSpell(sessionCode, spell);
            onClose();
        } catch (error) {
            console.error("Failed to create spell:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[1100] p-4">
            <motion.div
                className="w-full max-w-2xl bg-[#1a1b1e] border border-white/10 rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#151618]">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Plus size={20} className="text-gold-400" />
                        Create Custom Spell
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Spell Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full bg-[#0f1012] border border-white/10 rounded p-2 text-white focus:border-gold-500 outline-none"
                                placeholder="e.g. Arcane Beam"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Level</label>
                            <select
                                value={level}
                                onChange={e => setLevel(parseInt(e.target.value))}
                                className="w-full bg-[#0f1012] border border-white/10 rounded p-2 text-white"
                            >
                                <option value={0}>Cantrip</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(l => <option key={l} value={l}>Level {l}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">School</label>
                            <select
                                value={school}
                                onChange={e => setSchool(e.target.value as SpellSchool)}
                                className="w-full bg-[#0f1012] border border-white/10 rounded p-2 text-white capitalize"
                            >
                                {spellSchools.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Casting Time</label>
                            <input
                                type="text"
                                value={castingTime}
                                onChange={e => setCastingTime(e.target.value)}
                                className="w-full bg-[#0f1012] border border-white/10 rounded p-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Range</label>
                            <input
                                type="text"
                                value={range}
                                onChange={e => setRange(e.target.value)}
                                className="w-full bg-[#0f1012] border border-white/10 rounded p-2 text-white"
                            />
                        </div>
                    </div>

                    {/* Classes */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Available to Classes (Leave empty for All)</label>
                        <div className="flex flex-wrap gap-2">
                            {classes.map(cls => (
                                <button
                                    key={cls.id}
                                    onClick={() => toggleClass(cls.id)}
                                    className={`px-3 py-1 rounded text-sm border transition-colors ${selectedClasses.includes(cls.id)
                                            ? 'bg-purple-900/40 border-purple-500 text-purple-200'
                                            : 'bg-[#0f1012] border-white/10 text-gray-400 hover:border-white/30'
                                        }`}
                                >
                                    {cls.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Effects */}
                    <div className="space-y-4 border-t border-white/10 pt-4">
                        <h3 className="text-sm font-semibold text-gray-300">Effects</h3>

                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={hasDamage}
                                    onChange={e => { setHasDamage(e.target.checked); if (e.target.checked) setHasHealing(false); }}
                                    className="accent-red-500"
                                />
                                <span className={hasDamage ? 'text-red-400' : 'text-gray-500'}>Deals Damage</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={hasHealing}
                                    onChange={e => { setHasHealing(e.target.checked); if (e.target.checked) setHasDamage(false); }}
                                    className="accent-green-500"
                                />
                                <span className={hasHealing ? 'text-green-400' : 'text-gray-500'}>Restores Health</span>
                            </label>
                        </div>

                        {hasDamage && (
                            <div className="flex gap-4 p-4 bg-red-900/10 rounded border border-red-900/20">
                                <div>
                                    <label className="block text-xs text-red-400 mb-1">Dice Formula</label>
                                    <input
                                        type="text"
                                        value={damageDice}
                                        onChange={e => setDamageDice(e.target.value)}
                                        className="bg-[#0f1012] border border-red-900/30 rounded p-1 text-white w-24"
                                        placeholder="1d8"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs text-red-400 mb-1">Type</label>
                                    <select
                                        value={damageType}
                                        onChange={e => setDamageType(e.target.value as DamageType)}
                                        className="w-full bg-[#0f1012] border border-red-900/30 rounded p-1 text-white capitalize"
                                    >
                                        {['acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic', 'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'].map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        {hasHealing && (
                            <div className="flex gap-4 p-4 bg-green-900/10 rounded border border-green-900/20">
                                <div>
                                    <label className="block text-xs text-green-400 mb-1">Healing Dice</label>
                                    <input
                                        type="text"
                                        value={healingDice}
                                        onChange={e => setHealingDice(e.target.value)}
                                        className="bg-[#0f1012] border border-green-900/30 rounded p-1 text-white w-24"
                                        placeholder="1d8"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-[#0f1012] border border-white/10 rounded p-2 text-white focus:border-gold-500 outline-none resize-none"
                            placeholder="Describe what the spell does..."
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 bg-[#151618] flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={!name || !description}
                        className="px-6 py-2 rounded bg-gold-600 hover:bg-gold-500 text-black font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={18} /> Create Spell
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
