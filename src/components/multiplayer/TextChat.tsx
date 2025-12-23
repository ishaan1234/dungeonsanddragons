'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Dice6, MessageCircle } from 'lucide-react';
import { ChatMessage } from '@/lib/firebase';
import styles from './TextChat.module.css';

interface TextChatProps {
    messages: ChatMessage[];
    onSendMessage: (content: string) => void;
    playerId: string;
    isDM: boolean;
}

export default function TextChat({ messages, onSendMessage, playerId, isDM }: TextChatProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={styles.textChat}>
            <div className={styles.header}>
                <MessageCircle size={16} />
                <span>Party Chat</span>
            </div>

            <div className={styles.messages}>
                {messages.length === 0 ? (
                    <div className={styles.emptyChat}>
                        <MessageCircle size={32} />
                        <p>No messages yet</p>
                        <p className={styles.hint}>Type /roll 1d20 to roll dice!</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((msg) => {
                            // Check if this is a secret roll we shouldn't see
                            const isHidden = msg.isSecret && !isDM && msg.odplayerId !== playerId;

                            return (
                                <motion.div
                                    key={msg.id}
                                    className={`${styles.message} ${styles[msg.type]} ${msg.odplayerId === playerId ? styles.own : ''}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    {msg.type === 'system' ? (
                                        <div className={styles.systemMessage}>
                                            {msg.content}
                                        </div>
                                    ) : msg.type === 'roll' ? (
                                        <div className={styles.rollMessage}>
                                            <div className={styles.messageHeader}>
                                                <span className={styles.playerName}>
                                                    {msg.playerName}
                                                    {msg.isSecret && <span className={styles.secretBadge}> (Secret)</span>}
                                                </span>
                                                <span className={styles.time}>{formatTime(msg.timestamp)}</span>
                                            </div>

                                            {isHidden ? (
                                                <div className={styles.secretRollContent}>
                                                    <Dice6 size={14} />
                                                    <span>Rolled secretly...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className={styles.rollContent}>
                                                        <Dice6 size={14} />
                                                        <span>{msg.content}</span>
                                                    </div>
                                                    {msg.rollResult && (
                                                        <div className={styles.rollResult}>
                                                            <span className={styles.rollTotal}>{msg.rollResult.total}</span>
                                                            <span className={styles.rollFormula}>
                                                                ({msg.rollResult.formula} = [{msg.rollResult.dice.join(', ')}])
                                                            </span>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={styles.textMessage}>
                                            <div className={styles.messageHeader}>
                                                <span className={styles.playerName}>{msg.playerName}</span>
                                                <span className={styles.time}>{formatTime(msg.timestamp)}</span>
                                            </div>
                                            <div className={styles.messageContent}>{msg.content}</div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className={styles.inputArea} onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type message or /roll 1d20..."
                />
                <button type="submit" disabled={!input.trim()}>
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
