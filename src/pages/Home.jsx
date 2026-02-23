import React, { useEffect, useState } from 'react';
import { Clock, Users, Star, ChefHat, Search as SearchIcon, Bell, Menu, Sparkles, TrendingUp, Flame } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
    const { recipes, categories, loading, fetchRecipes, fetchCategories } = useRecipes();
    const { user } = useAuth();
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchRecipes({ categoryId: activeCategory });
    }, [activeCategory, fetchRecipes]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Chào buổi sáng';
        if (hour < 18) return 'Chào buổi chiều';
        return 'Chào buổi tối';
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const getCategoryIcon = (name) => {
        const map = {
            'Món Chính': '🍛',
            'Món Khai Vị': '🥗',
            'Tráng Miệng': '🍰',
            'Đồ Uống': '🥤',
            'Món Chay': '🌿',
            'Hải Sản': '🦞',
            'Món Nhanh': '🍔',
            'Ăn Sáng': '🍳',
            'Món Nước': '🍜'
        };
        return map[name] || '🍲';
    };

    // Use the first recipe as "Recipe of the Day" for demo
    const recipeOfTheDay = recipes.length > 0 ? recipes[0] : null;
    const trendingRecipes = recipes.length > 1 ? recipes.slice(1, 11) : [];

    return (
        <div className="flex-1 bg-[#FAFAFA] pb-24">
            {/* Top Bar / Greeting */}
            <header className="px-4 pt-6 pb-2 flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm font-medium tracking-wide">
                        {getGreeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || 'bạn'}!
                    </p>
                    <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
                        Hôm nay nấu gì nhỉ?
                    </h1>
                </div>
                <div className="relative">
                    <button className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gray-700 hover:shadow-md transition-shadow">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
                    </button>
                </div>
            </header>

            {/* Search Bar - High Fidelity */}
            <section className="px-4 mt-6">
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative group transition-all"
                >
                    <div className="absolute inset-0 bg-primary/20 rounded-[24px] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center bg-white rounded-full shadow-sm hover:shadow-md transition-all border border-gray-100 focus-within:border-primary/30 p-1">
                        <div className="pl-4 text-gray-400">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Món ăn, nguyên liệu, phong cách..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent border-none py-3 px-3 text-gray-900 focus:outline-none font-medium placeholder:text-gray-400"
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white p-3 rounded-full shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all active:scale-90"
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            </section>

            {/* Categories Scroll */}
            <section className="mt-8 px-4">
                <div className="flex items-center gap-2 mb-4">
                    <Menu className="w-5 h-5 text-primary" />
                    <h2 className="font-bold text-gray-900">Danh mục món ăn</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`snap-start min-w-[100px] flex flex-col items-center gap-3 p-4 rounded-3xl transition-all ${activeCategory === null
                            ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                            : 'bg-white text-gray-600 shadow-sm hover:shadow-md border border-gray-50'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeCategory === null ? 'bg-white/20' : 'bg-orange-50'}`}>
                            <ChefHat className={`w-6 h-6 ${activeCategory === null ? 'text-white' : 'text-primary'}`} />
                        </div>
                        <span className="text-xs font-bold whitespace-nowrap">Tất cả</span>
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`snap-start min-w-[100px] flex flex-col items-center gap-3 p-4 rounded-3xl transition-all ${activeCategory === cat.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                : 'bg-white text-gray-600 shadow-sm hover:shadow-md border border-gray-50'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeCategory === cat.id ? 'bg-white/20' : 'bg-orange-50'}`}>
                                <span className={`text-xl ${activeCategory === cat.id ? 'filter-none' : 'grayscale'}`}>
                                    {getCategoryIcon(cat.name)}
                                </span>
                            </div>
                            <span className="text-xs font-bold whitespace-nowrap">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Recipe of the Day - Feature Card */}
            {!activeCategory && recipeOfTheDay && (
                <section className="px-4 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            <h2 className="font-bold text-gray-900">Nổi bật hôm nay</h2>
                        </div>
                    </div>
                    <Link
                        to={`/recipe/${recipeOfTheDay.id}`}
                        className="relative block w-full h-56 md:h-80 rounded-3xl overflow-hidden shadow-xl group"
                    >
                        <img
                            src={recipeOfTheDay.cover_image}
                            alt={recipeOfTheDay.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="inline-flex items-center gap-1.5 bg-primary px-3 py-1 rounded-full mb-3 shadow-lg shadow-primary/30">
                                <Flame className="w-3 h-3 text-white" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Hợp để nấu ngay</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white leading-tight mb-2 drop-shadow-md">
                                {recipeOfTheDay.title}
                            </h3>
                            <div className="flex items-center gap-4 text-white/90 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    <span>{recipeOfTheDay.prep_time + recipeOfTheDay.cook_time}p</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="font-bold">{recipeOfTheDay.avg_rating || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </section>
            )}

            {/* Trending / Recommended Feed */}
            <section className="px-4 mt-10">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h2 className="font-bold text-gray-900">Xu hướng cộng đồng</h2>
                    </div>
                    <Link to="/search" className="text-primary text-sm font-bold hover:underline">Xem tất cả</Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="aspect-[4/3] bg-white rounded-2xl animate-pulse"></div>
                        <div className="aspect-[4/3] bg-white rounded-2xl animate-pulse"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-6">
                        {trendingRecipes.map((recipe, idx) => (
                            <Link
                                key={recipe.id}
                                to={`/recipe/${recipe.id}`}
                                className="group flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all group-hover:-translate-y-1">
                                    <img
                                        src={recipe.cover_image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        <span className="text-[10px] font-bold text-gray-700">{recipe.avg_rating || 'N/A'}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight h-10 group-hover:text-primary transition-colors">
                                        {recipe.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                                            <Clock className="w-3 h-3" />
                                            <span>{recipe.prep_time + recipe.cook_time}p</span>
                                        </div>
                                        <span className="text-[10px] text-primary/80 font-bold uppercase tracking-tighter">
                                            {recipe.difficulty === 'easy' ? 'Dễ' : 'Trung b.'}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
