'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Text, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import styles from './Dice3D.module.css';

interface DiceProps {
    type: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
    result?: number;
    isRolling: boolean;
    color?: string;
    position?: [number, number, number];
}

// Individual 3D Die component
function Die({ type, result, isRolling, color = '#8b5cf6', position = [0, 0, 0] }: DiceProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [randomRotation] = useState(() => ({
        x: Math.random() * Math.PI * 2,
        y: Math.random() * Math.PI * 2,
        z: Math.random() * Math.PI * 2,
    }));

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        if (isRolling) {
            // Fast spinning while rolling
            meshRef.current.rotation.x += delta * 8;
            meshRef.current.rotation.y += delta * 10;
            meshRef.current.rotation.z += delta * 6;

            // Slight bounce
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 15) * 0.1 + position[1];
        } else {
            // Settle to final position
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, randomRotation.x, delta * 3);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, randomRotation.y, delta * 3);
            meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, randomRotation.z, delta * 3);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1], delta * 5);
        }
    });

    // Different geometries for different dice types
    const getGeometry = () => {
        switch (type) {
            case 'd4':
                return <tetrahedronGeometry args={[0.7]} />;
            case 'd6':
                return <boxGeometry args={[0.8, 0.8, 0.8]} />;
            case 'd8':
                return <octahedronGeometry args={[0.6]} />;
            case 'd10':
            case 'd100':
                return <dodecahedronGeometry args={[0.55]} />;
            case 'd12':
                return <dodecahedronGeometry args={[0.6]} />;
            case 'd20':
                return <icosahedronGeometry args={[0.65]} />;
            default:
                return <icosahedronGeometry args={[0.65]} />;
        }
    };

    return (
        <group position={position}>
            <mesh ref={meshRef} castShadow>
                {getGeometry()}
                <meshStandardMaterial
                    color={color}
                    metalness={0.3}
                    roughness={0.4}
                    emissive={color}
                    emissiveIntensity={isRolling ? 0.3 : 0.1}
                />
            </mesh>

            {/* Result number floating above (when not rolling) */}
            {!isRolling && result !== undefined && (
                <Text
                    position={[0, 1.2, 0]}
                    fontSize={0.5}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    font="/fonts/Cinzel-Bold.ttf"
                >
                    {result}
                </Text>
            )}
        </group>
    );
}

// Main Scene with dice
function DiceScene({ dice, isRolling }: { dice: DiceProps[], isRolling: boolean }) {
    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 3, 5]} fov={50} />
            <ambientLight intensity={0.4} />
            <spotLight
                position={[5, 10, 5]}
                angle={0.3}
                penumbra={0.5}
                intensity={1}
                castShadow
            />
            <pointLight position={[-5, 5, -5]} intensity={0.3} color="#fbbf24" />

            {dice.map((die, index) => (
                <Die
                    key={index}
                    type={die.type}
                    result={die.result}
                    isRolling={isRolling}
                    color={die.color}
                    position={die.position || [index * 1.5 - (dice.length - 1) * 0.75, 0, 0]}
                />
            ))}

            {/* Ground plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#1a1a2e" opacity={0.8} transparent />
            </mesh>

            <Environment preset="night" />
        </>
    );
}

interface Dice3DProps {
    diceToRoll: { type: DiceProps['type']; count: number }[];
    results?: number[];
    onRollComplete?: () => void;
}

export default function Dice3D({ diceToRoll, results, onRollComplete }: Dice3DProps) {
    const [isRolling, setIsRolling] = useState(false);
    const [displayResults, setDisplayResults] = useState<number[]>([]);

    // Build dice array from props
    const diceArray: DiceProps[] = [];
    const colors = ['#8b5cf6', '#ef4444', '#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#06b6d4'];

    let colorIndex = 0;
    diceToRoll.forEach(({ type, count }) => {
        for (let i = 0; i < count; i++) {
            diceArray.push({
                type,
                result: displayResults[diceArray.length],
                isRolling,
                color: colors[colorIndex % colors.length],
            });
            colorIndex++;
        }
    });

    useEffect(() => {
        if (results && results.length > 0) {
            // Start rolling animation
            setIsRolling(true);
            setDisplayResults([]);

            // Stop rolling after animation
            const timer = setTimeout(() => {
                setIsRolling(false);
                setDisplayResults(results);
                onRollComplete?.();
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [results, onRollComplete]);

    if (diceArray.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>Select dice to roll</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Canvas shadows>
                <Suspense fallback={null}>
                    <DiceScene dice={diceArray} isRolling={isRolling} />
                </Suspense>
            </Canvas>

            {isRolling && (
                <div className={styles.rollingOverlay}>
                    <span>Rolling...</span>
                </div>
            )}

            {!isRolling && displayResults.length > 0 && (
                <div className={styles.resultDisplay}>
                    <span className={styles.total}>
                        Total: {displayResults.reduce((a, b) => a + b, 0)}
                    </span>
                </div>
            )}
        </div>
    );
}
