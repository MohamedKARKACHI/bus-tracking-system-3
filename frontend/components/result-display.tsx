"use client";

import React from 'react';
import { DetectionResponse } from '@/lib/api-anpr';

interface ResultDisplayProps {
    result: DetectionResponse | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
    if (!result) {
        return (
            <div className="result-card">
                <h2>Detection Results</h2>
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6c757d' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔍</div>
                    <p style={{ fontSize: '1.2rem', marginBottom: '5px' }}>No plate detected yet</p>
                    <small>Point camera at a Moroccan license plate</small>
                </div>
            </div>
        );
    }

    const formatTimestamp = (timestamp?: number) => {
        if (!timestamp) return '';
        return new Date(timestamp * 1000).toLocaleTimeString();
    };

    return (
        <div className="result-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h2 style={{ margin: 0 }}>Detection Results</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        background: '#d4edda',
                        color: '#155724'
                    }}>
                        ✓ Detected
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                        {formatTimestamp(result.timestamp)}
                    </span>
                </div>
            </div>

            <div className="plate-display">
                <div className="plate-section">
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Serial
                    </label>
                    <div className="plate-value">{result.serial || '?'}</div>
                </div>
                <div className="plate-divider">|</div>
                <div className="plate-section">
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Letter
                    </label>
                    <div className="plate-value arabic">{result.letter || '?'}</div>
                </div>
                <div className="plate-divider">|</div>
                <div className="plate-section">
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginBottom: '8px', textTransform: 'uppercase' }}>
                        Region
                    </label>
                    <div className="plate-value">{result.region || '?'}</div>
                </div>
            </div>

            <div style={{ padding: '20px', background: 'var(--muted)', borderRadius: '10px', textAlign: 'center' }}>
                <strong style={{ display: 'block', marginBottom: '10px', color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
                    Complete Result:
                </strong>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--foreground)', fontFamily: 'monospace' }}>
                    {result.fullResult}
                </div>
            </div>
        </div>
    );
};

export default ResultDisplay;
