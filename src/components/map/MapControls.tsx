'use client';

import { useState } from 'react';
import { Map, Eye, EyeOff, Grid, Maximize, Plus } from 'lucide-react';
import { MapState } from '@/lib/firebase';
import styles from './MapControls.module.css';

interface MapControlsProps {
    map: MapState | undefined;
    onCreateMap: (width: number, height: number, cellSize: number) => void;
    onRevealAll: () => void;
    onHideAll: () => void;
    brushSize: number;
    onBrushSizeChange: (size: number) => void;
}

export default function MapControls({
    map,
    onCreateMap,
    onRevealAll,
    onHideAll,
    brushSize,
    onBrushSizeChange
}: MapControlsProps) {
    const [gridWidth, setGridWidth] = useState(20);
    const [gridHeight, setGridHeight] = useState(15);
    const [cellSize, setCellSize] = useState(30);

    const handleCreateMap = () => {
        onCreateMap(gridWidth, gridHeight, cellSize);
    };

    if (!map) {
        return (
            <div className={styles.controls}>
                <div className={styles.header}>
                    <Map size={18} />
                    <h3>Create Battle Map</h3>
                </div>

                <div className={styles.createForm}>
                    <div className={styles.inputGroup}>
                        <label>
                            <Grid size={14} />
                            Width (cells)
                        </label>
                        <input
                            type="number"
                            value={gridWidth}
                            onChange={(e) => setGridWidth(Math.max(5, Math.min(50, parseInt(e.target.value) || 5)))}
                            min={5}
                            max={50}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <Grid size={14} />
                            Height (cells)
                        </label>
                        <input
                            type="number"
                            value={gridHeight}
                            onChange={(e) => setGridHeight(Math.max(5, Math.min(50, parseInt(e.target.value) || 5)))}
                            min={5}
                            max={50}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>
                            <Maximize size={14} />
                            Cell Size (px)
                        </label>
                        <input
                            type="number"
                            value={cellSize}
                            onChange={(e) => setCellSize(Math.max(20, Math.min(60, parseInt(e.target.value) || 30)))}
                            min={20}
                            max={60}
                        />
                    </div>

                    <button className={styles.createBtn} onClick={handleCreateMap}>
                        <Plus size={16} />
                        Create Map
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.controls}>
            <div className={styles.header}>
                <Map size={18} />
                <h3>Map Controls</h3>
            </div>

            <div className={styles.mapInfo}>
                <span>{map.gridWidth} x {map.gridHeight} grid</span>
                <span>{map.cellSize}px cells</span>
            </div>

            <div className={styles.section}>
                <label className={styles.sectionLabel}>Brush Size</label>
                <div className={styles.brushOptions}>
                    {[1, 2, 3].map((size) => (
                        <button
                            key={size}
                            className={`${styles.brushBtn} ${brushSize === size ? styles.active : ''}`}
                            onClick={() => onBrushSizeChange(size)}
                        >
                            {size}x{size}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <label className={styles.sectionLabel}>Quick Actions</label>
                <div className={styles.actionButtons}>
                    <button className={styles.actionBtn} onClick={onRevealAll}>
                        <Eye size={16} />
                        Reveal All
                    </button>
                    <button className={styles.actionBtn} onClick={onHideAll}>
                        <EyeOff size={16} />
                        Hide All
                    </button>
                </div>
            </div>

            <div className={styles.hint}>
                <p>Click or drag on the map to toggle fog visibility.</p>
            </div>
        </div>
    );
}
