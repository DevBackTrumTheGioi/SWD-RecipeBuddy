import React, { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Users, Star, ChefHat, Bookmark, Share2, PlayCircle, Plus, MessageCircle, Send } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { useUserActions } from '../hooks/useUserActions';
import { useAuth } from '../hooks/useAuth';
import { useShoppingCart } from '../contexts/ShoppingCartContext';

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getRecipeById } = useRecipes();
    const {
        toggleBookmark, isBookmarked,
        fetchReviews, addReview,
    } = useUserActions();
    const { addItem, triggerFlyAnimation } = useShoppingCart();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ingredients');
    const [bookmarked, setBookmarked] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const [recipeRes, bookmarkStatus, reviewsData] = await Promise.all([
                getRecipeById(id),
                isBookmarked(id),
                fetchReviews(id)
            ]);

            if (recipeRes.data) setRecipe(recipeRes.data);
            setBookmarked(bookmarkStatus);
            setReviews(reviewsData);
            setLoading(false);
        };
        loadData();
    }, [id, getRecipeById, isBookmarked, fetchReviews]);

    const handleToggleBookmark = async () => {
        if (!user) return navigate('/login');
        const res = await toggleBookmark(id);
        if (!res.error) setBookmarked(res.action === 'added');
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!user) return navigate('/login');
        if (!newReview.trim()) return;

        setSubmittingReview(true);
        const res = await addReview(id, rating, newReview);
        if (!res.error) {
            setNewReview('');
            const updatedReviews = await fetchReviews(id);
            setReviews(updatedReviews);
        }
        setSubmittingReview(false);
    };

    const handleAddToMall = async (item, e) => {
        if (!user) return navigate('/login');

        // Capture button position for fly animation
        const btn = e.currentTarget;
        const rect = btn.getBoundingClientRect();
        triggerFlyAnimation(rect, item.ingredient_master?.name);

        await addItem(item.ingredient_id, item.quantity, item.unit, item.ingredient_master?.name);
    };

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
                        <button
                            onClick={handleToggleBookmark}
                            className={`w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm transition-all active:scale-95 ${bookmarked ? 'text-primary' : 'text-gray-800'}`}
                        >
                            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
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
                    <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2 py-1 rounded-md">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{avg_rating || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <MessageCircle className="w-4 h-4" />
                        <span>{reviews.length} đánh giá</span>
                    </div>
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
                    <button
                        className={`flex-1 pb-4 text-center font-bold text-[15px] transition-colors ${activeTab === 'reviews' ? 'text-primary' : 'text-gray-400'}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Nhận xét ({reviews.length})
                    </button>
                    {/* Active Indicator */}
                    <div
                        className="absolute bottom-0 h-0.5 bg-primary rounded-full transition-all duration-300 ease-out"
                        style={{
                            width: '33.33%',
                            left: activeTab === 'ingredients' ? '0%' : activeTab === 'steps' ? '33.33%' : '66.66%'
                        }}
                    ></div>
                </div>

                {/* Tab Content: Ingredients */}
                {activeTab === 'ingredients' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between bg-primary/5 rounded-xl p-3 mb-2">
                            <span className="font-semibold text-gray-800">Cần mua nguyên liệu?</span>
                            <span className="text-xs text-primary font-medium">Lưu vào danh sách đi chợ</span>
                        </div>

                        {(recipe_ingredients || []).map((item, idx) => (
                            <div key={item.id || idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg -mx-2 px-2 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-primary/40"></div>
                                    <span className="font-medium text-gray-800 text-base">{item.ingredient_master?.name}</span>
                                    {item.prep_note && (
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full line-clamp-1 max-w-[150px]">{item.prep_note}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="font-bold text-gray-900 text-right">
                                        {item.quantity} {item.unit}
                                    </div>
                                    <button
                                        onClick={(e) => handleAddToMall(item, e)}
                                        className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
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

                {/* Tab Content: Reviews */}
                {activeTab === 'reviews' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Add Review Form */}
                        {user ? (
                            <div className="bg-gray-50 rounded-2xl p-4">
                                <h3 className="font-bold text-gray-900 mb-3">Để lại nhận xét</h3>
                                <div className="flex gap-1 mb-3">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <button key={s} onClick={() => setRating(s)}>
                                            <Star className={`w-6 h-6 ${rating >= s ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                                        </button>
                                    ))}
                                </div>
                                <form onSubmit={handleAddReview} className="relative">
                                    <textarea
                                        value={newReview}
                                        onChange={(e) => setNewReview(e.target.value)}
                                        placeholder="Bạn thấy món ăn này thế nào?"
                                        className="w-full bg-white rounded-xl p-3 text-sm border border-gray-100 focus:outline-none focus:ring-1 focus:ring-primary min-h-[100px] pb-12"
                                    />
                                    <button
                                        disabled={submittingReview}
                                        className="absolute bottom-3 right-3 bg-primary text-white p-2 rounded-full shadow-md disabled:bg-gray-300"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                <p className="text-gray-500 mb-3">Đăng nhập để chia sẻ cảm nghĩ của bạn</p>
                                <button onClick={() => navigate('/login')} className="px-6 py-2 bg-primary text-white rounded-full font-bold">Đăng nhập</button>
                            </div>
                        )}

                        {/* List Reviews */}
                        <div className="space-y-4">
                            {reviews.length > 0 ? reviews.map(review => (
                                <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <img src={review.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=' + review.profiles?.full_name} className="w-8 h-8 rounded-full" alt="" />
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{review.profiles?.full_name}</p>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} className={`w-3 h-3 ${review.rating >= s ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-[10px] text-gray-400 uppercase">{new Date(review.created_at).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed pl-10">{review.content}</p>
                                </div>
                            )) : (
                                <p className="text-center text-gray-400 py-8">Chưa có đánh giá nào cho món này.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Action Bar (Mobile Sticky) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 md:hidden z-40">
                <button
                    onClick={() => navigate(`/recipe/${id}/cook`)}
                    className="w-full bg-primary text-white font-bold text-lg py-4 rounded-full shadow-lg hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <PlayCircle className="w-6 h-6" />
                    Bắt đầu nấu
                </button>
            </div>
        </div>
    );
};

export default RecipeDetail;
