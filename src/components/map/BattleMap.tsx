'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { MapState } from '@/lib/firebase';
import styles from './BattleMap.module.css';

interface BattleMapProps {
    map: MapState;
    isDM: boolean;
    onCellClick?: (x: number, y: number) => void;
    brushSize?: number;
}

export default function BattleMap({ map, isDM, onCellClick, brushSize = 1 }: BattleMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
    const [isMouseDown, setIsMouseDown] = useState(false);
    const lastCellRef = useRef<{ x: number; y: number } | null>(null);

    const { gridWidth, gridHeight, cellSize, fogGrid } = map;

    // Calculate canvas dimensions
    const canvasWidth = gridWidth * cellSize;
    const canvasHeight = gridHeight * cellSize;

    // Draw the map
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Draw grid
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const isRevealed = fogGrid[y]?.[x] ?? false;
                const cellX = x * cellSize;
                const cellY = y * cellSize;

                // Draw cell background
                if (isRevealed) {
                    // Revealed cell - light transparent grid
                    ctx.fillStyle = 'rgba(60, 60, 80, 0.3)';
                } else {
                    // Hidden cell - dark fog
                    ctx.fillStyle = isDM ? 'rgba(10, 10, 15, 0.85)' : 'rgba(0, 0, 0, 0.95)';
                }
                ctx.fillRect(cellX, cellY, cellSize, cellSize);

                // Draw grid lines
                ctx.strokeStyle = 'rgba(100, 100, 120, 0.4)';
                ctx.lineWidth = 1;
                ctx.strokeRect(cellX, cellY, cellSize, cellSize);

                // DM indicator for hidden cells
                if (isDM && !isRevealed) {
                    ctx.fillStyle = 'rgba(139, 92, 246, 0.15)';
                    ctx.fillRect(cellX + 2, cellY + 2, cellSize - 4, cellSize - 4);
                }
            }
        }

        // Draw hover effect for DM
        if (isDM && hoveredCell) {
            const brushOffset = Math.floor(brushSize / 2);
            for (let dy = 0; dy < brushSize; dy++) {
                for (let dx = 0; dx < brushSize; dx++) {
                    const cellX = hoveredCell.x - brushOffset + dx;
                    const cellY = hoveredCell.y - brushOffset + dy;

                    if (cellX >= 0 && cellX < gridWidth && cellY >= 0 && cellY < gridHeight) {
                        ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
                        ctx.fillRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
                        ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
                        ctx.lineWidth = 2;
                        ctx.strokeRect(cellX * cellSize, cellY * cellSize, cellSize, cellSize);
                    }
                }
            }
        }
    }, [canvasWidth, canvasHeight, gridWidth, gridHeight, cellSize, fogGrid, isDM, hoveredCell, brushSize]);

    // Redraw when state changes
    useEffect(() => {
        draw();
    }, [draw]);

    // Get cell coordinates from mouse position
    const getCellFromEvent = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.floor((e.clientX - rect.left) * scaleX / cellSize);
        const y = Math.floor((e.clientY - rect.top) * scaleY / cellSize);

        if (x >= 0 && x < gridWidth && y >= 0 && y < gridHeight) {
            return { x, y };
        }
        return null;
    }, [cellSize, gridWidth, gridHeight]);

    // Handle cell click with brush
    const handleCellInteraction = useCallback((x: number, y: number) => {
        if (!onCellClick) return;

        const brushOffset = Math.floor(brushSize / 2);
        for (let dy = 0; dy < brushSize; dy++) {
            for (let dx = 0; dx < brushSize; dx++) {
                const cellX = x - brushOffset + dx;
                const cellY = y - brushOffset + dy;

                if (cellX >= 0 && cellX < gridWidth && cellY >= 0 && cellY < gridHeight) {
                    onCellClick(cellX, cellY);
                }
            }
        }
    }, [onCellClick, brushSize, gridWidth, gridHeight]);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDM) return;

        setIsMouseDown(true);
        const cell = getCellFromEvent(e);
        if (cell) {
            lastCellRef.current = cell;
            handleCellInteraction(cell.x, cell.y);
        }
    }, [isDM, getCellFromEvent, handleCellInteraction]);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const cell = getCellFromEvent(e);
        setHoveredCell(cell);

        // Paint while dragging
        if (isDM && isMouseDown && cell) {
            const lastCell = lastCellRef.current;
            if (!lastCell || lastCell.x !== cell.x || lastCell.y !== cell.y) {
                lastCellRef.current = cell;
                handleCellInteraction(cell.x, cell.y);
            }
        }
    }, [isDM, isMouseDown, getCellFromEvent, handleCellInteraction]);

    const handleMouseUp = useCallback(() => {
        setIsMouseDown(false);
        lastCellRef.current = null;
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredCell(null);
        setIsMouseDown(false);
        lastCellRef.current = null;
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className={styles.canvas}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            />
            {!isDM && (
                <div className={styles.fogOverlay}>
                    {/* Additional atmospheric effect for players */}
                </div>
            )}
        </div>
    );
}
