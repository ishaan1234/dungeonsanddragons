'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Plus,
    Search,
    ChevronRight,
    Heart,
    Shield,
    Sword,
    Sparkles,
    Edit,
    Trash2,
    Eye,
} from 'lucide-react';
import Link from 'next/link';
import { Character } from '@/types';
import { useAppStore } from '@/stores/appStore';
import CharacterCreator from '@/components/character/CharacterCreator';
import CharacterCard from '@/components/character/CharacterCard';

export default function CharactersPage() {
    const { characters } = useAppStore();
    const [showCreator, setShowCreator] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    const filteredCharacters = characters.filter(char =>
        char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.class.toLowerCase().includes(searchQuery.toLowerCase()) ||
        char.race.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="characters-page">
            <motion.header
                className="page-header"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="header-content">
                    <h1><Users size={32} /> Characters</h1>
                    <p>Manage your heroes and their stories</p>
                </div>
                <div className="header-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search characters..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-gold" onClick={() => setShowCreator(true)}>
                        <Plus size={18} /> Create Character
                    </button>
                </div>
            </motion.header>

            <motion.div
                className="characters-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {filteredCharacters.length === 0 ? (
                    <div className="empty-state">
                        <Users size={64} />
                        <h3>No Characters Yet</h3>
                        <p>Create your first character to begin your adventure</p>
                        <button className="btn btn-gold btn-lg" onClick={() => setShowCreator(true)}>
                            <Plus size={20} /> Create Your First Character
                        </button>
                    </div>
                ) : (
                    <div className="characters-grid">
                        {filteredCharacters.map((character, index) => (
                            <motion.div
                                key={character.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <CharacterCard
                                    character={character}
                                    onSelect={() => setSelectedCharacter(character)}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Character Creator Modal */}
            <AnimatePresence>
                {showCreator && (
                    <CharacterCreator onClose={() => setShowCreator(false)} />
                )}
            </AnimatePresence>

            <style jsx>{`
        .characters-page {
          min-height: 100vh;
          padding: 2rem;
        }

        .page-header {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .header-content h1 {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .header-content p {
          color: var(--text-secondary);
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--bg-dark);
          border: 1px solid var(--bg-medium);
          border-radius: var(--radius-md);
          color: var(--text-muted);
        }

        .search-box input {
          border: none;
          background: transparent;
          padding: 0;
          width: 200px;
        }

        .search-box input:focus {
          outline: none;
          box-shadow: none;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          text-align: center;
          background: var(--bg-dark);
          border: 1px solid var(--bg-medium);
          border-radius: var(--radius-xl);
        }

        .empty-state svg {
          color: var(--text-muted);
          opacity: 0.3;
          margin-bottom: 1.5rem;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .characters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .characters-page {
            padding: 1rem;
            padding-top: 4rem;
          }

          .page-header {
            flex-direction: column;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .search-box {
            width: 100%;
          }

          .search-box input {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
}
