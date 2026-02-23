import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Camera,
    Plus,
    Trash2,
    ChefHat,
    Clock,
    Users,
    Timer,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Send,
    Image as ImageIcon,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useContributeRecipe } from '../hooks/useContributeRecipe';

const DIFFICULTY_OPTIONS = [
    { value: 'easy', label: 'Dễ', emoji: '🟢' },
    { value: 'medium', label: 'Trung bình', emoji: '🟡' },
    { value: 'hard', label: 'Khó', emoji: '🔴' },
];

const UNIT_OPTIONS = ['g', 'kg', 'ml', 'lít', 'thìa', 'muỗng', 'quả', 'củ', 'lát', 'nhánh', 'bó', 'gói', 'hộp', 'lon'];

const FORM_STEPS = [
    { title: 'Thông tin cơ bản', icon: ChefHat },
    { title: 'Nguyên liệu', icon: Clock },
    { title: 'Các bước nấu', icon: Timer },
];

const ContributeRecipe = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [submitted, setSubmitted] = useState(false);

    const {
        loading,
        error,
        currentFormStep,
        nextFormStep,
        prevFormStep,
        validateStep,

        basicInfo,
        updateBasicInfo,
        setCoverImage,

        ingredients,
        addIngredient,
        removeIngredient,
        updateIngredient,

        recipeSteps,
        addStep,
        removeStep,
        updateStep,

        submitRecipe,
    } = useContributeRecipe();

    // Auth guard
    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);

    const handleNext = () => {
        if (validateStep()) nextFormStep();
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;
        const result = await submitRecipe();
        if (!result.error) setSubmitted(true);
    };

    // Success screen
    if (submitted) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-screen bg-[#FAFAFA]">
                <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" strokeWidth={2} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2 font-quicksand">
                    Gửi thành công! 🎉
                </h1>
                <p className="text-gray-500 mb-8 max-w-sm">
                    Công thức của bạn đã được gửi và đang chờ kiểm duyệt. Chúng tôi sẽ thông báo khi được duyệt.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-bold hover:bg-gray-200 transition-colors"
                    >
                        Về trang chủ
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors"
                    >
                        Đóng góp thêm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-[#FAFAFA] min-h-screen pb-32">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" strokeWidth={2} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-900 font-quicksand">
                        Đóng góp công thức
                    </h1>
                    <div className="w-10" />
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 px-6 pb-3">
                    {FORM_STEPS.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = idx === currentFormStep;
                        const isDone = idx < currentFormStep;
                        return (
                            <div key={idx} className="flex items-center gap-2">
                                <div
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isActive
                                            ? 'bg-primary text-white'
                                            : isDone
                                                ? 'bg-primary/10 text-primary'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                                    <span className="hidden sm:inline">{step.title}</span>
                                    <span className="sm:hidden">{idx + 1}</span>
                                </div>
                                {idx < FORM_STEPS.length - 1 && (
                                    <div className={`w-6 h-0.5 rounded-full ${isDone ? 'bg-primary' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-medium">
                    {error}
                </div>
            )}

            {/* Form Content */}
            <div className="px-4 pt-6 max-w-2xl mx-auto">
                {/* Step 1: Basic Info */}
                {currentFormStep === 0 && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Cover Image */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Ảnh bìa
                            </label>
                            <label className="block cursor-pointer">
                                {basicInfo.coverPreview ? (
                                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100">
                                        <img
                                            src={basicInfo.coverPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                            <Camera className="w-8 h-8 text-white" strokeWidth={2} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white aspect-video flex flex-col items-center justify-center text-gray-400 hover:border-primary/50 hover:text-primary transition-colors">
                                        <ImageIcon className="w-10 h-10 mb-2" strokeWidth={1.5} />
                                        <span className="text-sm font-medium">Chọn ảnh bìa</span>
                                        <span className="text-xs text-gray-300 mt-1">JPG, PNG, WebP · Max 5MB</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    className="hidden"
                                    onChange={(e) => setCoverImage(e.target.files[0])}
                                />
                            </label>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Tên món ăn <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={basicInfo.title}
                                onChange={(e) => updateBasicInfo('title', e.target.value)}
                                placeholder="VD: Phở Bò Hà Nội"
                                className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Mô tả <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={basicInfo.description}
                                onChange={(e) => updateBasicInfo('description', e.target.value)}
                                placeholder="Giới thiệu ngắn về món ăn..."
                                rows={3}
                                className="w-full px-4 py-3 bg-white rounded-2xl border border-gray-100 text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm resize-none"
                            />
                        </div>

                        {/* Time & Servings Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                                    Sơ chế (phút)
                                </label>
                                <input
                                    type="number"
                                    value={basicInfo.prep_time}
                                    onChange={(e) => updateBasicInfo('prep_time', e.target.value)}
                                    min={0}
                                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-100 text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                                    Nấu (phút)
                                </label>
                                <input
                                    type="number"
                                    value={basicInfo.cook_time}
                                    onChange={(e) => updateBasicInfo('cook_time', e.target.value)}
                                    min={0}
                                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-100 text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                                    Khẩu phần
                                </label>
                                <input
                                    type="number"
                                    value={basicInfo.base_servings}
                                    onChange={(e) => updateBasicInfo('base_servings', e.target.value)}
                                    min={1}
                                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-100 text-center font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 mb-1.5">
                                    Độ khó
                                </label>
                                <select
                                    value={basicInfo.difficulty}
                                    onChange={(e) => updateBasicInfo('difficulty', e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white rounded-xl border border-gray-100 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
                                >
                                    {DIFFICULTY_OPTIONS.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.emoji} {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Ingredients */}
                {currentFormStep === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <p className="text-sm text-gray-500 font-medium">
                            Liệt kê tất cả nguyên liệu cần thiết.
                        </p>

                        {ingredients.map((ing, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-400 uppercase">
                                        Nguyên liệu {idx + 1}
                                    </span>
                                    {ingredients.length > 1 && (
                                        <button
                                            onClick={() => removeIngredient(idx)}
                                            className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                        </button>
                                    )}
                                </div>

                                <input
                                    type="text"
                                    value={ing.name}
                                    onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                                    placeholder="Tên nguyên liệu (VD: Thịt bò)"
                                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white"
                                />

                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        value={ing.quantity}
                                        onChange={(e) =>
                                            updateIngredient(idx, 'quantity', e.target.value)
                                        }
                                        placeholder="Số lượng"
                                        className="flex-1 px-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white"
                                    />
                                    <select
                                        value={ing.unit}
                                        onChange={(e) =>
                                            updateIngredient(idx, 'unit', e.target.value)
                                        }
                                        className="w-24 px-2 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white"
                                    >
                                        {UNIT_OPTIONS.map((u) => (
                                            <option key={u} value={u}>
                                                {u}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    value={ing.prep_note}
                                    onChange={(e) =>
                                        updateIngredient(idx, 'prep_note', e.target.value)
                                    }
                                    placeholder="Ghi chú (VD: thái lát mỏng)"
                                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white"
                                />
                            </div>
                        ))}

                        <button
                            onClick={addIngredient}
                            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2} />
                            Thêm nguyên liệu
                        </button>
                    </div>
                )}

                {/* Step 3: Steps */}
                {currentFormStep === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <p className="text-sm text-gray-500 font-medium">
                            Mô tả từng bước nấu. Thêm hẹn giờ nếu cần.
                        </p>

                        {recipeSteps.map((step, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                                            {idx + 1}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase">
                                            Bước {idx + 1}
                                        </span>
                                    </div>
                                    {recipeSteps.length > 1 && (
                                        <button
                                            onClick={() => removeStep(idx)}
                                            className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                                        </button>
                                    )}
                                </div>

                                <textarea
                                    value={step.content}
                                    onChange={(e) => updateStep(idx, 'content', e.target.value)}
                                    placeholder="Mô tả bước nấu..."
                                    rows={3}
                                    className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white resize-none mb-3"
                                />

                                <div className="flex items-center gap-2">
                                    <Timer className="w-4 h-4 text-gray-400" strokeWidth={2} />
                                    <input
                                        type="number"
                                        value={step.timer_seconds || ''}
                                        onChange={(e) =>
                                            updateStep(idx, 'timer_seconds', e.target.value)
                                        }
                                        placeholder="Hẹn giờ (giây)"
                                        min={0}
                                        className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white"
                                    />
                                    {step.timer_seconds > 0 && (
                                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                                            {Math.floor(step.timer_seconds / 60)}p {step.timer_seconds % 60}s
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addStep}
                            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-400 flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-colors"
                        >
                            <Plus className="w-4 h-4" strokeWidth={2} />
                            Thêm bước
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 z-40">
                <div className="flex gap-3 max-w-2xl mx-auto">
                    {currentFormStep > 0 && (
                        <button
                            onClick={prevFormStep}
                            className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
                        >
                            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
                        </button>
                    )}

                    {currentFormStep < 2 ? (
                        <button
                            onClick={handleNext}
                            className="flex-1 h-14 bg-primary text-white font-bold text-lg rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors active:scale-95"
                        >
                            Tiếp theo
                            <ChevronRight className="w-5 h-5" strokeWidth={2} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 h-14 bg-primary text-white font-bold text-lg rounded-full shadow-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors active:scale-95 disabled:bg-gray-300"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang gửi...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" strokeWidth={2} />
                                    Gửi công thức
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContributeRecipe;
