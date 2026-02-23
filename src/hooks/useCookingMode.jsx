import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for Cooking Mode logic.
 * Manages step navigation, wake lock, and countdown timer.
 */
export const useCookingMode = (steps = []) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [wakeLockActive, setWakeLockActive] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [timerRunning, setTimerRunning] = useState(false);
    const [timerInitial, setTimerInitial] = useState(0);

    const wakeLockRef = useRef(null);
    const timerRef = useRef(null);

    const totalSteps = steps.length;

    // --- Step Navigation ---
    const nextStep = useCallback(() => {
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
    }, [totalSteps]);

    const prevStep = useCallback(() => {
        setCurrentStep((prev) => Math.max(prev - 1, 0));
    }, []);

    const goToStep = useCallback(
        (n) => {
            if (n >= 0 && n < totalSteps) setCurrentStep(n);
        },
        [totalSteps]
    );

    // --- Wake Lock ---
    const requestWakeLock = useCallback(async () => {
        try {
            if ('wakeLock' in navigator) {
                wakeLockRef.current = await navigator.wakeLock.request('screen');
                setWakeLockActive(true);

                wakeLockRef.current.addEventListener('release', () => {
                    setWakeLockActive(false);
                });
            }
        } catch (err) {
            console.warn('Wake Lock not supported or denied:', err);
        }
    }, []);

    const releaseWakeLock = useCallback(() => {
        if (wakeLockRef.current) {
            wakeLockRef.current.release();
            wakeLockRef.current = null;
            setWakeLockActive(false);
        }
    }, []);

    // Re-acquire wake lock on visibility change (tab back into focus)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !wakeLockRef.current) {
                requestWakeLock();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        requestWakeLock();

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            releaseWakeLock();
        };
    }, [requestWakeLock, releaseWakeLock]);

    // --- Timer ---
    const startTimer = useCallback((seconds) => {
        clearInterval(timerRef.current);
        setTimerInitial(seconds);
        setTimerSeconds(seconds);
        setTimerRunning(true);
    }, []);

    const pauseTimer = useCallback(() => {
        setTimerRunning(false);
    }, []);

    const resumeTimer = useCallback(() => {
        if (timerSeconds > 0) setTimerRunning(true);
    }, [timerSeconds]);

    const resetTimer = useCallback(() => {
        clearInterval(timerRef.current);
        setTimerSeconds(timerInitial);
        setTimerRunning(false);
    }, [timerInitial]);

    // Timer tick
    useEffect(() => {
        if (timerRunning && timerSeconds > 0) {
            timerRef.current = setInterval(() => {
                setTimerSeconds((prev) => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current);
                        setTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [timerRunning, timerSeconds]);

    // Cleanup on unmount
    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return {
        // Steps
        currentStep,
        totalSteps,
        currentStepData: steps[currentStep] || null,
        nextStep,
        prevStep,
        goToStep,
        isFirstStep: currentStep === 0,
        isLastStep: currentStep === totalSteps - 1,
        progress: totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0,

        // Wake Lock
        wakeLockActive,

        // Timer
        timerSeconds,
        timerInitial,
        timerRunning,
        timerComplete: timerInitial > 0 && timerSeconds === 0 && !timerRunning,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
    };
};
