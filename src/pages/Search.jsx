import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { Search as SearchIcon, Filter, Clock, ChefHat, Star } from 'lucide-react';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [searchInput, setSearchInput] = useState(initialQuery);
    const { recipes, categories, loading, fetchRecipes, fetchCategories } = useRecipes();

    const [activeCategory, setActiveCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        fetchRecipes({
            searchQuery: initialQuery,
            categoryId: activeCategory,
            limit: 50 // Fetch more for search results
        });
    }, [initialQuery, activeCategory, fetchRecipes]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchInput.trim()) {
            setSearchParams({ q: searchInput });
        } else {
            setSearchParams({});
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-[#FAFAFA]">
            {/* Search Header */}
            <div className="bg-white px-4 py-6 shadow-sm sticky top-16 z-40">
                <form onSubmit={handleSearchSubmit} className="relative flex gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Tìm công thức, nguyên liệu..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-full py-3 px-5 pl-11 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                        />
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                        type="button"
                        className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
                    >
                        <Filter className="w-5 h-5" />
                    </button>
                </form>

                {/* Quick Filters */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === null
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
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
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results */}
            <div className="p-4">
                <p className="text-gray-500 mb-4 text-sm font-medium">
                    {loading ? 'Đang tìm kiếm...' : `Tìm thấy ${recipes.length} kết quả ${initialQuery ? `cho "${initialQuery}"` : ''}`}
                </p>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100"></div>
                        ))}
                    </div>
                ) : recipes.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recipes.map((recipe) => (
                            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex gap-4 hover:shadow-md transition-shadow group">
                                <img
                                    src={recipe.cover_image}
                                    alt={recipe.title}
                                    className="w-24 h-24 rounded-xl object-cover bg-gray-100 shrink-0"
                                />
                                <div className="flex-1 min-w-0 py-1 flex flex-col justify-center">
                                    <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                                        {recipe.title}
                                    </h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
                                        {recipe.avg_rating > 0 && (
                                            <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <span>{recipe.avg_rating}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{recipe.prep_time + recipe.cook_time}p</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <SearchIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Không tìm thấy món nào</h3>
                        <p className="text-gray-500 text-sm">Thử thay đổi từ khóa hoặc bộ lọc xem sao nhé.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
