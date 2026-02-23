import React, { useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * CookingTimer — Circular SVG countdown with audio alert.
 * @param {{ durationSeconds: number, seconds: number, isRunning: boolean, isComplete: boolean, onStart: () => void, onPause: () => void, onResume: () => void, onReset: () => void }} props
 */
const CookingTimer = ({
    durationSeconds,
    seconds,
    isRunning,
    isComplete,
    onStart,
    onPause,
    onResume,
    onReset,
}) => {
    const audioContextRef = useRef(null);

    // Format time as MM:SS
    const formatTime = (s) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // SVG circle math
    const size = 180;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = durationSeconds > 0 ? seconds / durationSeconds : 0;
    const dashOffset = circumference * (1 - progress);

    // Audio beep on complete
    const playBeep = useCallback(() => {
        try {
            const ctx = audioContextRef.current || new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = ctx;

            // Play 3 short beeps
            [0, 0.2, 0.4].forEach((delay) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 880;
                osc.type = 'sine';
                gain.gain.value = 0.3;
                osc.start(ctx.currentTime + delay);
                osc.stop(ctx.currentTime + delay + 0.15);
            });
        } catch (err) {
            console.warn('Audio not supported:', err);
        }
    }, []);

    useEffect(() => {
        if (isComplete) playBeep();
    }, [isComplete, playBeep]);

    const handlePlayPause = () => {
        if (isComplete) {
            onReset();
            return;
        }
        if (isRunning) {
            onPause();
        } else if (seconds === durationSeconds || seconds === 0) {
            onStart();
        } else {
            onResume();
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Circular Progress */}
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="rgba(255,126,103,0.15)"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={isComplete ? '#10B981' : '#FF7E67'}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>

                {/* Time display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                        className={`text-4xl font-bold font-quicksand ${isComplete ? 'text-emerald-500' : 'text-gray-900'
                            }`}
                    >
                        {formatTime(seconds)}
                    </span>
                    {isComplete && (
                        <span className="text-sm font-medium text-emerald-500 mt-1">
                            Hoàn thành!
                        </span>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePlayPause}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${isComplete
                            ? 'bg-emerald-500 text-white'
                            : isRunning
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-primary text-white'
                        }`}
                >
                    {isRunning ? (
                        <Pause className="w-6 h-6" strokeWidth={2} />
                    ) : (
                        <Play className="w-6 h-6 ml-0.5" strokeWidth={2} />
                    )}
                </button>

                <button
                    onClick={onReset}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors active:scale-95"
                >
                    <RotateCcw className="w-5 h-5" strokeWidth={2} />
                </button>
            </div>
        </div>
    );
};

export default CookingTimer;
