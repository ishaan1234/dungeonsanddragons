'use client';

import { useState, useEffect } from 'react';
import { Save, Trash2, Plus, StickyNote } from 'lucide-react';

interface Note {
    id: string;
    title: string;
    content: string;
    updatedAt: number;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem('dnd_session_notes');
        if (saved) {
            setNotes(JSON.parse(saved));
        } else {
            createNote();
        }
    }, []);

    const saveNotes = (newNotes: Note[]) => {
        setNotes(newNotes);
        localStorage.setItem('dnd_session_notes', JSON.stringify(newNotes));
    };

    const createNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: 'New Session Note',
            content: '',
            updatedAt: Date.now(),
        };
        const newNotes = [newNote, ...notes];
        saveNotes(newNotes);
        setActiveNoteId(newNote.id);
    };

    const updateNote = (id: string, updates: Partial<Note>) => {
        const newNotes = notes.map(note =>
            note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
        );
        saveNotes(newNotes);
    };

    const deleteNote = (id: string) => {
        const newNotes = notes.filter(n => n.id !== id);
        saveNotes(newNotes);
        if (activeNoteId === id) {
            setActiveNoteId(newNotes[0]?.id || null);
        }
    };

    const activeNote = notes.find(n => n.id === activeNoteId);

    return (
        <div style={{ padding: '2rem', height: '100vh', display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <StickyNote color="var(--gold-400)" /> Session Notes
                </h1>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2rem', flex: 1, minHeight: 0 }}>
                {/* Sidebar */}
                <div style={{
                    background: 'var(--bg-dark)',
                    borderRadius: '1rem',
                    border: '1px solid var(--bg-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    <button
                        onClick={createNote}
                        style={{
                            padding: '1rem',
                            background: 'var(--bg-medium)',
                            border: 'none',
                            color: 'var(--primary-400)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            fontWeight: 600
                        }}
                    >
                        <Plus size={18} /> New Note
                    </button>

                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {notes.map(note => (
                            <div
                                key={note.id}
                                onClick={() => setActiveNoteId(note.id)}
                                style={{
                                    padding: '1rem',
                                    borderBottom: '1px solid var(--bg-medium)',
                                    cursor: 'pointer',
                                    background: activeNoteId === note.id ? 'var(--bg-darker)' : 'transparent',
                                    borderLeft: activeNoteId === note.id ? '4px solid var(--primary-500)' : '4px solid transparent',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{note.title || 'Untitled'}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {new Date(note.updatedAt).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div style={{
                    background: 'var(--bg-dark)',
                    borderRadius: '1rem',
                    border: '1px solid var(--bg-medium)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden'
                }}>
                    {activeNote ? (
                        <>
                            <div style={{
                                padding: '1rem',
                                borderBottom: '1px solid var(--bg-medium)',
                                display: 'flex',
                                gap: '1rem'
                            }}>
                                <input
                                    value={activeNote.title}
                                    onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                                    placeholder="Note Title"
                                    style={{
                                        fontSize: '1.5rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--text-primary)',
                                        flex: 1,
                                        fontFamily: 'var(--font-display)'
                                    }}
                                />
                                <button
                                    onClick={() => deleteNote(activeNote.id)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'var(--danger)',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        borderRadius: '0.5rem'
                                    }}
                                    title="Delete Note"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <textarea
                                value={activeNote.content}
                                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                                placeholder="Write your session notes here..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '1.5rem',
                                    color: 'var(--text-secondary)',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                    resize: 'none',
                                    outline: 'none'
                                }}
                            />
                        </>
                    ) : (
                        <div style={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-muted)'
                        }}>
                            Select or create a note to start writing
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
