import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Timer,
    Check,
    X,
} from 'lucide-react';
import { useRecipes } from '../hooks/useRecipes';
import { useCookingMode } from '../hooks/useCookingMode';
import CookingTimer from '../components/common/CookingTimer';

const CookingMode = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getRecipeById } = useRecipes();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTimer, setShowTimer] = useState(false);
    const [showExitConfirm, setShowExitConfirm] = useState(false);

    const scrollContainerRef = useRef(null);

    // Load recipe data
    useEffect(() => {
        const load = async () => {
            const { data } = await getRecipeById(id);
            if (data) setRecipe(data);
            setLoading(false);
        };
        load();
    }, [id, getRecipeById]);

    const steps = recipe?.recipe_steps || [];

    const {
        currentStep,
        totalSteps,
        currentStepData,
        nextStep,
        prevStep,
        goToStep,
        isFirstStep,
        isLastStep,
        progress,
        timerSeconds,
        timerInitial,
        timerRunning,
        timerComplete,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
    } = useCookingMode(steps);

    // Scroll to current step
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const stepEl = container.children[currentStep];
            if (stepEl) {
                stepEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [currentStep]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                nextStep();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevStep();
            } else if (e.key === 'Escape') {
                setShowExitConfirm(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextStep, prevStep]);

    const handleExit = () => {
        navigate(`/recipe/${id}`);
    };

    const handleTimerToggle = () => {
        if (!showTimer && currentStepData?.timer_seconds) {
            startTimer(currentStepData.timer_seconds);
        }
        setShowTimer(!showTimer);
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!recipe || steps.length === 0) {
        return (
            <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50 text-white">
                <p className="text-lg mb-4">Không có bước nấu ăn nào.</p>
                <button
                    onClick={handleExit}
                    className="px-6 py-2 bg-primary text-white rounded-full font-bold"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col overflow-hidden select-none">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
                <button
                    onClick={() => setShowExitConfirm(true)}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" strokeWidth={2} />
                </button>

                <div className="text-center">
                    <p className="text-white/50 text-xs font-medium uppercase tracking-widest">
                        Đang nấu
                    </p>
                    <p className="text-white font-bold text-sm truncate max-w-[200px]">
                        {recipe.title}
                    </p>
                </div>

                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Progress Bar */}
            <div className="px-4 pb-4 shrink-0">
                <div className="flex items-center justify-between text-white/40 text-xs font-medium mb-2">
                    <span>Bước {currentStep + 1}/{totalSteps}</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Step Dots */}
            <div className="flex justify-center gap-1.5 px-4 pb-4 shrink-0">
                {steps.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToStep(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep
                                ? 'w-6 bg-primary'
                                : idx < currentStep
                                    ? 'w-2 bg-primary/40'
                                    : 'w-2 bg-white/20'
                            }`}
                    />
                ))}
            </div>

            {/* Main Step Content */}
            <div className="flex-1 flex items-center justify-center px-6 py-4 overflow-hidden">
                <div className="w-full max-w-lg">
                    {/* Step Card */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
                        {/* Step Number */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-xl font-bold shrink-0">
                                {currentStepData?.step_order || currentStep + 1}
                            </div>
                            <div className="h-px flex-1 bg-white/10" />
                        </div>

                        {/* Step Content */}
                        <p className="text-white text-lg leading-relaxed font-medium font-quicksand">
                            {currentStepData?.content}
                        </p>

                        {/* Timer Button (if step has timer) */}
                        {currentStepData?.timer_seconds > 0 && (
                            <button
                                onClick={handleTimerToggle}
                                className="mt-6 inline-flex items-center gap-2 bg-primary/15 text-primary px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary/25 transition-colors"
                            >
                                <Timer className="w-4 h-4" strokeWidth={2} />
                                <span>
                                    Hẹn giờ: {Math.floor(currentStepData.timer_seconds / 60)} phút{' '}
                                    {currentStepData.timer_seconds % 60 > 0
                                        ? `${currentStepData.timer_seconds % 60}s`
                                        : ''}
                                </span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation Footer */}
            <div className="px-6 pb-8 pt-4 shrink-0">
                <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
                    <button
                        onClick={prevStep}
                        disabled={isFirstStep}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${isFirstStep
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <ChevronLeft className="w-6 h-6" strokeWidth={2} />
                    </button>

                    {isLastStep ? (
                        <button
                            onClick={handleExit}
                            className="flex-1 h-14 bg-emerald-500 text-white font-bold text-lg rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors active:scale-95"
                        >
                            <Check className="w-6 h-6" strokeWidth={2} />
                            Hoàn thành
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className="flex-1 h-14 bg-primary text-white font-bold text-lg rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors active:scale-95"
                        >
                            Bước tiếp
                            <ChevronRight className="w-6 h-6" strokeWidth={2} />
                        </button>
                    )}

                    <button
                        onClick={nextStep}
                        disabled={isLastStep}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95 ${isLastStep
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        <ChevronRight className="w-6 h-6" strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Timer Modal */}
            {showTimer && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60">
                    <div className="bg-white rounded-3xl p-8 mx-4 w-full max-w-sm shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Đồng hồ hẹn giờ</h3>
                            <button
                                onClick={() => setShowTimer(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X className="w-4 h-4" strokeWidth={2} />
                            </button>
                        </div>

                        <CookingTimer
                            durationSeconds={timerInitial}
                            seconds={timerSeconds}
                            isRunning={timerRunning}
                            isComplete={timerComplete}
                            onStart={() => startTimer(currentStepData?.timer_seconds || 60)}
                            onPause={pauseTimer}
                            onResume={resumeTimer}
                            onReset={resetTimer}
                        />
                    </div>
                </div>
            )}

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-60">
                    <div className="bg-white rounded-3xl p-6 mx-4 w-full max-w-sm shadow-2xl text-center">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Thoát chế độ nấu?</h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Tiến trình nấu ăn hiện tại sẽ không được lưu.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowExitConfirm(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Tiếp tục nấu
                            </button>
                            <button
                                onClick={handleExit}
                                className="flex-1 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors"
                            >
                                Thoát
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CookingMode;
