import React, { useEffect, useState } from 'react';
import { Clock, Users, Star, ChefHat, Search as SearchIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';

const Home = () => {
    const { recipes, categories, loading, fetchRecipes, fetchCategories } = useRecipes();
    const [activeCategory, setActiveCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchRecipes({ categoryId: activeCategory });
    }, [activeCategory, fetchRecipes]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="flex-1 flex flex-col pb-8">
            {/* Hero Section */}
            <section className="px-4 py-8 bg-white shadow-sm md:rounded-b-2xl">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    Hôm nay bạn muốn <br />
                    <span className="text-primary">nấu món gì?</span>
                </h1>

                {/* Search Bar - Quick access on home */}
                <form onSubmit={handleSearchSubmit} className="mt-6 relative">
                    <input
                        type="text"
                        placeholder="Tìm món ăn, nguyên liệu..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-full py-3 px-5 pl-11 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                    />
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </form>

                {/* Categories */}
                <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === null
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        Tất cả
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat.id
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </section>

            {/* Recommended Feed */}
            <section className="px-4 mt-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        {activeCategory ? 'Kết quả mọc cho danh mục' : 'Gợi ý cho bạn'}
                    </h2>
                    <Link to="/search" className="text-sm font-medium text-primary hover:text-primary/80">Xem tất cả</Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="bg-gray-100 rounded-2xl aspect-[4/3] animate-pulse"></div>
                        ))}
                    </div>
                ) : recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipes.map((recipe) => (
                            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-primary/20 transition-all">
                                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                                    <img
                                        src={recipe.cover_image}
                                        alt={recipe.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                        loading="lazy"
                                    />
                                    {recipe.avg_rating > 0 && (
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 space-x-1 rounded-full flex items-center shadow-sm">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-bold text-gray-700">{recipe.avg_rating}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                        {recipe.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                            <Clock className="w-4 h-4" />
                                            <span className="font-medium">{(recipe.prep_time || 0) + (recipe.cook_time || 0)}p</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                                            <ChefHat className="w-4 h-4" />
                                            <span className="font-medium capitalize">{
                                                recipe.difficulty === 'easy' ? 'Dễ' :
                                                    recipe.difficulty === 'medium' ? 'Trung bình' : 'Khó'
                                            }</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">Chưa có công thức nào trong danh mục này.</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
