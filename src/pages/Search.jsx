import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { Search as SearchIcon, Filter, Clock, ChefHat, Star, ArrowLeft, SlidersHorizontal, LayoutGrid, List, SearchX, X, ChevronDown, Plus } from 'lucide-react';

// --- Filter Sidebar Component ---
const FilterSidebar = ({
    isMobile,
    onClose,
    categories,
    activeCategory,
    setActiveCategory,
    ingredientInput,
    setIngredientInput,
    handleAddIngredient,
    selectedIngredients,
    handleRemoveIngredient,
    selectedDifficulty,
    setSelectedDifficulty,
    maxTime,
    setMaxTime,
    handleClearFilters,
    recipesCount
}) => (
    <div className="flex flex-col h-full bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between sticky top-0 bg-white z-10">
            <div className="flex items-center gap-2 text-gray-900 font-bold">
                <Filter className="w-5 h-5 text-primary" />
                <span className="text-lg">Bộ lọc</span>
            </div>
            {isMobile ? (
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleClearFilters}
                        className="text-sm font-bold text-primary hover:underline"
                    >
                        Xóa lọc
                    </button>
                    <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-700 rounded-full active:scale-95 transition-all hover:rotate-90">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleClearFilters}
                    className="text-sm font-bold text-primary hover:underline transition-all"
                >
                    Xóa lọc
                </button>
            )}
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
            {/* Danh mục */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Danh mục</h3>
                <div className="space-y-1">
                    <label className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                        <input
                            type="radio"
                            name="category"
                            checked={activeCategory === null}
                            onChange={() => setActiveCategory(null)}
                            className="w-4 h-4 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                        />
                        <span className={`text-sm font-medium transition-colors ${activeCategory === null ? 'text-primary font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>Tất cả danh mục</span>
                    </label>
                    {categories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors group">
                            <input
                                type="radio"
                                name="category"
                                checked={activeCategory === cat.id}
                                onChange={() => setActiveCategory(cat.id)}
                                className="w-4 h-4 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
                            />
                            <span className={`text-sm font-medium transition-colors ${activeCategory === cat.id ? 'text-primary font-bold' : 'text-gray-600 group-hover:text-gray-900'}`}>{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Phân loại theo nguyên liệu */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Nguyên liệu</h3>
                <div className="relative mb-3 group">
                    <input
                        type="text"
                        placeholder="Nhập và nhấn Enter..."
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        onKeyDown={handleAddIngredient}
                        className="w-full bg-gray-50 border border-transparent text-gray-900 rounded-xl py-2 px-3 pr-10 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm placeholder:text-gray-400"
                    />
                    <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); handleAddIngredient({ key: 'Enter', preventDefault: () => { } }); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:text-primary/70 p-1.5 bg-primary/10 rounded-lg active:scale-95 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                {/* Ingredient Tags */}
                {selectedIngredients.length > 0 && (
                    <div className="flex flex-wrap gap-2 animate-in fade-in duration-300">
                        {selectedIngredients.map(ing => (
                            <span key={ing} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 text-sm font-bold rounded-xl border border-gray-200/80 shadow-sm">
                                {ing}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveIngredient(ing)}
                                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Độ khó */}
            <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Độ khó</h3>
                <div className="flex flex-wrap gap-2">
                    {['Dễ', 'Trung bình', 'Khó'].map(level => {
                        const isActive = selectedDifficulty === level;
                        return (
                            <button
                                key={level}
                                onClick={() => setSelectedDifficulty(isActive ? null : level)}
                                className={`px-4 py-2 border rounded-xl text-sm font-bold transition-all active:scale-95 ${isActive ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200 text-gray-600 hover:border-primary/40 hover:bg-primary/5 hover:text-primary'}`}
                            >
                                {level}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Thời gian nấu */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Thời gian nấu</h3>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">Dưới {maxTime}p</span>
                </div>
                <div className="space-y-4 px-1">
                    <input
                        type="range"
                        min="5"
                        max="120"
                        step="5"
                        value={maxTime}
                        onChange={(e) => setMaxTime(Number(e.target.value))}
                        className="w-full h-2.5 bg-gray-100 rounded-[10px] appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-[11px] font-extrabold text-gray-400 tracking-wider">
                        <span>5P</span>
                        <span>120P</span>
                    </div>
                </div>
            </div>
        </div>

        {isMobile && (
            <div className="p-4 border-t border-gray-50 bg-white">
                <button
                    onClick={onClose}
                    className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all text-sm uppercase tracking-wide"
                >
                    Áp dụng kết quả ({recipesCount})
                </button>
            </div>
        )}
    </div>
);

const Search = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [searchInput, setSearchInput] = useState(initialQuery);
    const { recipes, categories, loading, fetchRecipes, fetchCategories } = useRecipes();

    const [activeCategory, setActiveCategory] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // States for advanced filtering
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [ingredientInput, setIngredientInput] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState(null);
    const [maxTime, setMaxTime] = useState(120);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Auto-search logic (debounce)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const currentQuery = searchParams.get('q') || '';
            if (searchInput !== currentQuery) {
                if (searchInput.trim()) {
                    setSearchParams(prev => {
                        prev.set('q', searchInput.trim());
                        return prev;
                    });
                } else if (currentQuery) {
                    setSearchParams(prev => {
                        prev.delete('q');
                        return prev;
                    });
                }
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchInput, searchParams, setSearchParams]);

    useEffect(() => {
        fetchRecipes({
            searchQuery: initialQuery,
            categoryId: activeCategory,
            ingredients: selectedIngredients,
            difficulty: selectedDifficulty,
            maxTime: maxTime,
            limit: 50
        });
    }, [initialQuery, activeCategory, selectedIngredients, selectedDifficulty, maxTime, fetchRecipes]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const currentQuery = searchParams.get('q') || '';
        if (searchInput.trim() !== currentQuery) {
            if (searchInput.trim()) {
                setSearchParams(prev => {
                    prev.set('q', searchInput.trim());
                    return prev;
                });
            } else {
                setSearchParams(prev => {
                    prev.delete('q');
                    return prev;
                });
            }
        }
        // Remove focus from input to hide soft keyboard on mobile
        document.activeElement?.blur();
    };

    const handleAddIngredient = (e) => {
        if (e.key === 'Enter' && ingredientInput.trim()) {
            e.preventDefault();
            const trimmed = ingredientInput.trim();
            if (trimmed && !selectedIngredients.includes(trimmed)) {
                setSelectedIngredients([...selectedIngredients, trimmed]);
            }
            setIngredientInput('');
        }
    };

    const handleRemoveIngredient = (ing) => {
        setSelectedIngredients(selectedIngredients.filter(i => i !== ing));
    };

    const handleClearFilters = () => {
        setSearchInput('');
        setSearchParams({});
        setActiveCategory(null);
        setSelectedIngredients([]);
        setIngredientInput('');
        setSelectedDifficulty(null);
        setMaxTime(120);
    };

    // --- Filter Sidebar Component ---


    return (
        <div className="flex-1 flex flex-col bg-[#FAFAFA] min-h-screen pb-24 md:pb-8">
            {/* Standardized Search Header */}
            <div className="bg-white/80 backdrop-blur-md px-4 md:px-8 py-5 border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-center gap-4">
                    {/* Search Bar Group */}
                    <div className="flex items-center gap-3 flex-1">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 text-gray-700 active:scale-95 transition-all md:hidden"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-2xl group">
                            <div className="absolute inset-0 bg-primary/10 rounded-[24px] blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity hidden md:block"></div>
                            <div className="relative flex items-center bg-gray-50 md:bg-white rounded-2xl md:rounded-[24px] border border-transparent md:border-gray-100 focus-within:border-primary/30 p-1 md:shadow-sm">
                                <div className="pl-4 text-gray-400">
                                    <SearchIcon className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Tìm món ăn yêu thích, nguyên liệu..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="flex-1 bg-transparent border-none py-2.5 px-3 text-gray-900 focus:outline-none font-bold placeholder:text-gray-400 placeholder:font-medium text-sm md:text-base"
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={() => { setSearchInput(''); setSearchParams(prev => { prev.delete('q'); return prev; }); }}
                                        className="mr-2 text-gray-400 hover:text-gray-600 p-2"
                                    >
                                        <SearchX className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </form>
                        {/* Mobile Filter Trigger */}
                        <button
                            onClick={() => setShowMobileFilters(true)}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/5 text-primary md:hidden shrink-0 border border-primary/10"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    {/* View Controls (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center justify-between border-l border-gray-100 pl-6 gap-6">
                        <div className="text-sm">
                            Hỗ trợ: <span className="font-bold text-gray-900">{recipes.length}</span> công thức
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-2xl p-1 shrink-0">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-6 md:py-8 flex gap-8">

                {/* Desktop Sidebar Filter */}
                <aside className="hidden md:block w-72 shrink-0">
                    <div className="sticky top-28 h-[calc(100vh-8rem)]">
                        <FilterSidebar
                            isMobile={false}
                            categories={categories}
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                            ingredientInput={ingredientInput}
                            setIngredientInput={setIngredientInput}
                            handleAddIngredient={handleAddIngredient}
                            selectedIngredients={selectedIngredients}
                            handleRemoveIngredient={handleRemoveIngredient}
                            selectedDifficulty={selectedDifficulty}
                            setSelectedDifficulty={setSelectedDifficulty}
                            maxTime={maxTime}
                            setMaxTime={setMaxTime}
                            handleClearFilters={handleClearFilters}
                            recipesCount={recipes.length}
                        />
                    </div>
                </aside>

                {/* Mobile Filter Modal */}
                <div className={`fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden flex justify-end ${showMobileFilters ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className={`w-4/5 max-w-sm h-full shadow-2xl transition-transform duration-300 transform ${showMobileFilters ? 'translate-x-0' : 'translate-x-full'}`}>
                        <FilterSidebar
                            isMobile={true}
                            onClose={() => setShowMobileFilters(false)}
                            categories={categories}
                            activeCategory={activeCategory}
                            setActiveCategory={setActiveCategory}
                            ingredientInput={ingredientInput}
                            setIngredientInput={setIngredientInput}
                            handleAddIngredient={handleAddIngredient}
                            selectedIngredients={selectedIngredients}
                            handleRemoveIngredient={handleRemoveIngredient}
                            selectedDifficulty={selectedDifficulty}
                            setSelectedDifficulty={setSelectedDifficulty}
                            maxTime={maxTime}
                            setMaxTime={setMaxTime}
                            handleClearFilters={handleClearFilters}
                            recipesCount={recipes.length}
                        />
                    </div>
                </div>

                {/* Results Container */}
                <main className="flex-1 min-w-0">
                    <div className="md:hidden flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-900">
                            {loading ? 'Đang tìm...' : `${recipes.length} Kết quả`}
                        </h2>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>
                                <LayoutGrid className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-400'}`}>
                                <List className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                            {[1, 2, 3, 4, 5, 6].map(n => (
                                <div key={n} className={`bg-white rounded-3xl animate-pulse border border-gray-50 ${viewMode === 'grid' ? 'aspect-[4/3]' : 'h-32'}`}></div>
                            ))}
                        </div>
                    ) : recipes.length > 0 ? (
                        <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6" : "space-y-4"}>
                            {recipes.map((recipe, idx) => (
                                <Link
                                    key={recipe.id}
                                    to={`/recipe/${recipe.id}`}
                                    className={`bg-white rounded-[28px] shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all group animate-in fade-in slide-in-from-bottom-3 duration-500`}
                                    style={{ animationDelay: `${idx * 50}ms` }}
                                >
                                    <div className={viewMode === 'grid' ? "flex flex-col h-full" : "flex p-3 gap-4"}>
                                        <div className={`relative overflow-hidden shrink-0 ${viewMode === 'grid' ? "aspect-[4/3]" : "w-32 h-32 md:w-56 md:h-44 rounded-[20px]"}`}>
                                            <img
                                                src={recipe.cover_image}
                                                alt={recipe.title}
                                                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out`}
                                            />
                                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors"></div>
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span className="text-[11px] font-extrabold text-gray-800">{recipe.avg_rating || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className={viewMode === 'grid' ? "p-4 flex flex-col flex-1" : "flex-1 py-2 pr-2 flex flex-col"}>
                                            <div className="flex gap-2 mb-2">
                                                {recipe.tags && recipe.tags.slice(0, 1).map(t => (
                                                    <span key={t.id} className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                        {t.name}
                                                    </span>
                                                ))}
                                            </div>

                                            <h3 className={`font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight ${viewMode === 'grid' ? 'text-sm md:text-base' : 'text-base md:text-xl'}`}>
                                                {recipe.title}
                                            </h3>

                                            <p className={`text-gray-500 text-sm mt-2 line-clamp-2 hidden ${viewMode === 'list' ? 'md:block' : ''}`}>
                                                {recipe.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-auto pt-4">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-wide">
                                                    <Clock className="w-4 h-4 text-primary/70" />
                                                    <span>{recipe.prep_time + recipe.cook_time}p</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <ChefHat className="w-4 h-4 text-gray-400" />
                                                    <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{recipe.difficulty === 'easy' ? 'Dễ' : 'TB'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-50 h-full min-h-[50vh]">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-xl group hover:scale-110 transition-transform">
                                <SearchX className="w-10 h-10 text-primary opacity-50" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Không có kết quả</h3>
                            <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
                                Chúng mình không tìm thấy món nào khớp với lọc của bạn. Đừng lo, hãy thử tùy chọn danh mục khác nhé!
                            </p>
                            <button
                                onClick={handleClearFilters}
                                className="mt-8 px-8 py-3.5 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 active:scale-95 transition-all text-sm uppercase tracking-wide hover:bg-primary/90"
                            >
                                Xóa toàn bộ bộ lọc
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Search;
