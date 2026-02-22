import React, { useState } from 'react';
import { ArrowLeft, Clock, ChefHat, Users, Heart, Share2, CheckCircle2, Circle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const DUMMY_RECIPE = {
    title: 'Phở Bò Gia Truyền Nam Định',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb438?auto=format&fit=crop&q=80&w=1200',
    description: 'Món phở truyền thống đậm đà bản sắc Việt Nam với nước xương hầm ngọt thanh và bánh phở dai mềm.',
    time: '3 giờ',
    difficulty: 'Khó',
    servings: 4,
    author: 'Bếp Trưởng Nam',
    ingredients: [
        { id: 1, name: 'Xương ống bò', amount: '1 kg' },
        { id: 2, name: 'Thịt bò (nạm, gầu)', amount: '500g' },
        { id: 3, name: 'Bánh phở tươi', amount: '1 kg' },
        { id: 4, name: 'Gừng, hành tím nướng', amount: '100g' },
        { id: 5, name: 'Thảo quả, hoa hồi, quế', amount: '20g' },
    ],
    steps: [
        { id: 1, content: 'Sơ chế xương bò: Rửa sạch xương, chần qua nước sôi 5 phút để khử mùi hôi. Rửa lại bằng nước lạnh.' },
        { id: 2, content: 'Hầm xương: Cho xương vào nồi áp suất cùng 3 lít nước. Hầm trong 2 tiếng cùng gừng và hành tím nướng.' },
        { id: 3, content: 'Rang gia vị: Rang sơ thảo quả, hoa hồi, quế cho thơm rồi cho bọc mùng vào nồi nước dùng hầm thêm 1 tiếng.' },
        { id: 4, content: 'Thái thịt và chuẩn bị bánh phở: Thịt bò luộc chín thái mỏng. Bánh phở chần qua nước sôi.' },
        { id: 5, content: 'Trình bày: Cho bánh phở ra bát, xếp thịt lên trên, chan nước dùng nóng hổi. Ăn kèm quẩy và hành lá.' },
    ]
};

const RecipeDetail = () => {
    const { id } = useParams();
    const [checkedIngredients, setCheckedIngredients] = useState(new Set());

    const toggleIngredient = (ingId) => {
        const newSet = new Set(checkedIngredients);
        if (newSet.has(ingId)) newSet.delete(ingId);
        else newSet.add(ingId);
        setCheckedIngredients(newSet);
    };

    return (
        <div className="flex-1 bg-[#FAFAFA] pb-24 md:pb-8">
            {/* Mobile Header Overlay */}
            <div className="md:hidden absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
                <Link to="/" className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex gap-2">
                    <button className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Hero Image */}
            <div className="relative w-full aspect-square md:aspect-[21/9] max-h-[500px]">
                <img
                    src={DUMMY_RECIPE.image}
                    alt={DUMMY_RECIPE.title}
                    className="w-full h-full object-cover md:rounded-t-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:rounded-t-2xl"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h1 className="text-3xl font-bold mb-2 leading-tight">{DUMMY_RECIPE.title}</h1>
                    <p className="text-gray-200 line-clamp-2">{DUMMY_RECIPE.description}</p>
                </div>
            </div>

            <div className="px-4 md:px-8 max-w-4xl mx-auto -mt-4 relative z-10">
                {/* Info Stats */}
                <div className="bg-white rounded-2xl shadow-sm p-4 flex justify-between items-center mb-6">
                    <div className="flex flex-col items-center">
                        <Clock className="w-6 h-6 text-primary mb-1" />
                        <span className="text-sm font-medium text-gray-600">{DUMMY_RECIPE.time}</span>
                    </div>
                    <div className="w-px h-10 bg-gray-100"></div>
                    <div className="flex flex-col items-center">
                        <ChefHat className="w-6 h-6 text-primary mb-1" />
                        <span className="text-sm font-medium text-gray-600">{DUMMY_RECIPE.difficulty}</span>
                    </div>
                    <div className="w-px h-10 bg-gray-100"></div>
                    <div className="flex flex-col items-center">
                        <Users className="w-6 h-6 text-primary mb-1" />
                        <span className="text-sm font-medium text-gray-600">{DUMMY_RECIPE.servings} người</span>
                    </div>
                </div>

                {/* Ingredients Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Nguyên liệu</h2>
                    <div className="bg-white rounded-2xl shadow-sm p-2">
                        {DUMMY_RECIPE.ingredients.map((ing, idx) => {
                            const checked = checkedIngredients.has(ing.id);
                            return (
                                <div
                                    key={ing.id}
                                    onClick={() => toggleIngredient(ing.id)}
                                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${checked ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        {checked ? (
                                            <CheckCircle2 className="w-5 h-5 text-primary" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-300" />
                                        )}
                                        <span className={`text-gray-800 ${checked ? 'line-through text-gray-500' : ''}`}>
                                            {ing.name}
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-sm font-medium">{ing.amount}</span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Steps Section */}
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Cách làm</h2>
                    <div className="space-y-4">
                        {DUMMY_RECIPE.steps.map((step, idx) => (
                            <div key={step.id} className="bg-white rounded-2xl shadow-sm p-5 flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                                    {idx + 1}
                                </div>
                                <p className="text-gray-700 leading-relaxed pt-1">
                                    {step.content}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>

            {/* Floating Action CTA - Mobile */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-100 md:hidden z-20">
                <button className="w-full bg-primary text-white font-bold py-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    <ChefHat className="w-5 h-5" /> Bắt đầu nấu ngay
                </button>
            </div>
        </div>
    );
};

export default RecipeDetail;
