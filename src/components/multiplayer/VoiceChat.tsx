'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Phone, PhoneOff, Users } from 'lucide-react';
import styles from './VoiceChat.module.css';

interface Participant {
    id: string;
    name: string;
    isSpeaking: boolean;
    isMuted: boolean;
}

interface VoiceChatProps {
    sessionCode: string;
    playerId: string;
    playerName: string;
    participants: { id: string; name: string }[];
}

export default function VoiceChat({ sessionCode, playerId, playerName, participants }: VoiceChatProps) {
    const [isConnected, setIsConnected] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isDeafened, setIsDeafened] = useState(false);
    const [speakingUsers, setSpeakingUsers] = useState<Set<string>>(new Set());
    const [error, setError] = useState<string | null>(null);

    const localStreamRef = useRef<MediaStream | null>(null);
    const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);

    // Initialize audio context for voice detection
    const initializeAudio = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            localStreamRef.current = stream;

            // Set up audio analysis for speaking detection
            audioContextRef.current = new AudioContext();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);

            // Check if user is speaking
            const checkSpeaking = () => {
                if (!analyserRef.current) return;
                const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
                analyserRef.current.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

                if (average > 30) {
                    setSpeakingUsers(prev => new Set([...prev, playerId]));
                } else {
                    setSpeakingUsers(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(playerId);
                        return newSet;
                    });
                }
            };

            const intervalId = setInterval(checkSpeaking, 100);

            setIsConnected(true);
            setError(null);

            return () => {
                clearInterval(intervalId);
                stream.getTracks().forEach(track => track.stop());
            };
        } catch (err) {
            setError('Could not access microphone. Please check permissions.');
            console.error('Audio initialization error:', err);
        }
    }, [playerId]);

    const toggleMute = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = isMuted;
            });
            setIsMuted(!isMuted);
        }
    }, [isMuted]);

    const toggleDeafen = useCallback(() => {
        setIsDeafened(!isDeafened);
        // In a real implementation, this would mute incoming audio
    }, [isDeafened]);

    const connect = useCallback(async () => {
        await initializeAudio();
    }, [initializeAudio]);

    const disconnect = useCallback(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        peerConnectionsRef.current.forEach(pc => pc.close());
        peerConnectionsRef.current.clear();
        setIsConnected(false);
        setSpeakingUsers(new Set());
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return (
        <div className={styles.voiceChat}>
            <div className={styles.header}>
                <Users size={16} />
                <span>Voice Chat</span>
                <span className={styles.participantCount}>
                    {participants.length} in call
                </span>
            </div>

            <div className={styles.participants}>
                {participants.map(participant => (
                    <div
                        key={participant.id}
                        className={`${styles.participant} ${speakingUsers.has(participant.id) ? styles.speaking : ''}`}
                    >
                        <div className={styles.avatar}>
                            {participant.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={styles.name}>{participant.name}</span>
                        {participant.id === playerId && isMuted && (
                            <MicOff size={12} className={styles.mutedIcon} />
                        )}
                    </div>
                ))}
            </div>

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            <div className={styles.controls}>
                {!isConnected ? (
                    <button className={`${styles.controlBtn} ${styles.connect}`} onClick={connect}>
                        <Phone size={18} />
                        Join Voice
                    </button>
                ) : (
                    <>
                        <button
                            className={`${styles.controlBtn} ${isMuted ? styles.active : ''}`}
                            onClick={toggleMute}
                            title={isMuted ? 'Unmute' : 'Mute'}
                        >
                            {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                        </button>
                        <button
                            className={`${styles.controlBtn} ${isDeafened ? styles.active : ''}`}
                            onClick={toggleDeafen}
                            title={isDeafened ? 'Undeafen' : 'Deafen'}
                        >
                            {isDeafened ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </button>
                        <button
                            className={`${styles.controlBtn} ${styles.disconnect}`}
                            onClick={disconnect}
                            title="Leave Voice"
                        >
                            <PhoneOff size={18} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
