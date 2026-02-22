import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Users, Star, ChefHat, Bookmark, Share2, PlayCircle, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getRecipeById } = useRecipes();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ingredients');

    useEffect(() => {
        const fetchRecipe = async () => {
            const { data } = await getRecipeById(id);
            if (data) {
                setRecipe(data);
            }
            setLoading(false);
        };
        fetchRecipe();
    }, [id, getRecipeById]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                <ChefHat className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy công thức</h2>
                <button onClick={() => navigate(-1)} className="text-primary font-medium hover:underline">Quay lại</button>
            </div>
        );
    }

    const {
        title, cover_image, description, prep_time, cook_time,
        difficulty, base_servings, avg_rating, profiles,
        recipe_ingredients, recipe_steps
    } = recipe;

    return (
        <div className="flex-1 bg-white pb-24">
            {/* Header / Hero Image */}
            <div className="relative h-72 md:h-96 w-full">
                <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm transition-transform active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex gap-2">
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm transition-transform active:scale-95">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm transition-transform active:scale-95">
                            <Bookmark className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <img
                    src={cover_image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            {/* Main Content Info */}
            <div className="px-4 pt-6 -mt-10 relative bg-white rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
                    {title}
                </h1>

                {profiles && (
                    <div className="flex items-center gap-2 mb-4">
                        <img src={profiles.avatar_url || 'https://ui-avatars.com/api/?name=' + profiles.full_name} alt={profiles.full_name} className="w-6 h-6 rounded-full" />
                        <span className="text-sm font-medium text-gray-600">bởi {profiles.full_name}</span>
                    </div>
                )}

                <div className="flex items-center gap-4 text-sm font-medium mb-6">
                    {avg_rating > 0 && (
                        <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
                            <Star className="w-4 h-4 fill-current" />
                            <span>{avg_rating}</span>
                        </div>
                    )}
                </div>

                <p className="text-gray-600 leading-relaxed mb-6">
                    {description}
                </p>

                {/* Stats Grid */}
                <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-4 mb-8">
                    <div className="flex flex-col items-center gap-1 w-1/3">
                        <Clock className="w-6 h-6 text-primary mb-1" />
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Thời gian</span>
                        <span className="font-bold text-gray-900">{(prep_time || 0) + (cook_time || 0)}p</span>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="flex flex-col items-center gap-1 w-1/3">
                        <ChefHat className="w-6 h-6 text-primary mb-1" />
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Độ khó</span>
                        <span className="font-bold text-gray-900 capitalize">
                            {difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                        </span>
                    </div>
                    <div className="w-px h-10 bg-gray-200"></div>
                    <div className="flex flex-col items-center gap-1 w-1/3">
                        <Users className="w-6 h-6 text-primary mb-1" />
                        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Khẩu phần</span>
                        <span className="font-bold text-gray-900">{base_servings} người</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 mb-6 relative">
                    <button
                        className={`flex-1 pb-4 text-center font-bold text-[15px] transition-colors ${activeTab === 'ingredients' ? 'text-primary' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('ingredients')}
                    >
                        Nguyên liệu ({recipe_ingredients?.length || 0})
                    </button>
                    <button
                        className={`flex-1 pb-4 text-center font-bold text-[15px] transition-colors ${activeTab === 'steps' ? 'text-primary' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('steps')}
                    >
                        Cách làm ({recipe_steps?.length || 0})
                    </button>
                    {/* Active Indicator */}
                    <div
                        className="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out"
                        style={{
                            width: '50%',
                            left: activeTab === 'ingredients' ? '0%' : '50%'
                        }}
                    ></div>
                </div>

                {/* Tab Content: Ingredients */}
                {activeTab === 'ingredients' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between bg-primary/5 rounded-xl p-3 mb-2">
                            <span className="font-semibold text-gray-800">Thêm tất cả vào danh sách chợ</span>
                            <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>

                        {(recipe_ingredients || []).map((item, idx) => (
                            <div key={item.id || idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg -mx-2 px-2 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                                    <span className="font-medium text-gray-800 text-base">{item.ingredient_master?.name}</span>
                                    {item.prep_note && (
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{item.prep_note}</span>
                                    )}
                                </div>
                                <div className="font-bold text-gray-900">
                                    {item.quantity} {item.unit}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tab Content: Steps */}
                {activeTab === 'steps' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {(recipe_steps || []).map((step, idx) => (
                            <div key={step.id || idx} className="flex gap-4">
                                <div className="flex flex-col items-center">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20 shrink-0">
                                        {step.step_order}
                                    </div>
                                    {idx !== (recipe_steps || []).length - 1 && (
                                        <div className="w-px h-full bg-gray-200 my-2"></div>
                                    )}
                                </div>
                                <div className="pb-6 w-full">
                                    <p className="text-gray-800 leading-relaxed font-medium">
                                        {step.content}
                                    </p>

                                    {step.timer_seconds && (
                                        <div className="mt-3 inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg text-sm font-bold w-fit cursor-pointer hover:bg-orange-100 transition-colors">
                                            <PlayCircle className="w-4 h-4" />
                                            <span>Hẹn giờ: {Math.floor(step.timer_seconds / 60)} phút</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Action Bar (Mobile Sticky) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 md:hidden z-40">
                <button className="w-full bg-primary text-white font-bold text-lg py-4 rounded-full shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <PlayCircle className="w-6 h-6" />
                    Bắt đầu nấu
                </button>
            </div>
        </div>
    );
};

export default RecipeDetail;
