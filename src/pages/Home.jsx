import React from 'react';
import { Clock, Users, Star, ChefHat } from 'lucide-react';
import { Link } from 'react-router-dom';

const DUMMY_CATEGORIES = ['Ăn sáng', 'Món chính', 'Ăn vặt', 'Đồ uống', 'Healthy'];
const DUMMY_RECIPES = [
    {
        id: 1,
        title: 'Phở Bò Gia Truyền Nam Định',
        image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb438?auto=format&fit=crop&q=80&w=800',
        time: '45 phút',
        difficulty: 'Trung bình',
        rating: 4.8
    },
    {
        id: 2,
        title: 'Cơm Tấm Sườn Bì Chả',
        image: 'https://images.unsplash.com/photo-1626200419188-f56cedeb2d05?auto=format&fit=crop&q=80&w=800',
        time: '30 phút',
        difficulty: 'Dễ',
        rating: 4.9
    },
    {
        id: 3,
        title: 'Bún Chả Hà Nội',
        image: 'https://images.unsplash.com/photo-1614275069929-277cb7974415?auto=format&fit=crop&q=80&w=800',
        time: '40 phút',
        difficulty: 'Trung bình',
        rating: 4.7
    }
];

const Home = () => {
    return (
        <div className="flex-1 flex flex-col pb-8">
            {/* Hero Section */}
            <section className="px-4 py-6 bg-white shadow-sm md:rounded-b-2xl">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    Hôm nay bạn muốn <br />
                    <span className="text-primary">nấu món gì?</span>
                </h1>

                {/* Categories */}
                <div className="mt-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                    {DUMMY_CATEGORIES.map((cat, idx) => (
                        <button
                            key={idx}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${idx === 0
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* Recommended Feed */}
            <section className="px-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Gợi ý cho bạn</h2>
                    <button className="text-sm font-medium text-primary hover:text-primary/80">Xem thêm</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {DUMMY_RECIPES.map((recipe) => (
                        <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="group block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative aspect-[4/3] overflow-hidden">
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 space-x-1 rounded-full flex items-center shadow-sm">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-bold">{recipe.rating}</span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                    {recipe.title}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{recipe.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ChefHat className="w-4 h-4" />
                                        <span>{recipe.difficulty}</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
