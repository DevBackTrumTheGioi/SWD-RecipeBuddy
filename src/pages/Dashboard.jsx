import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useUserActions } from '../hooks/useUserActions';
import { LogOut, Bookmark, Settings, ChefHat, ChevronRight, ShoppingCart, Star } from 'lucide-react';

const Dashboard = () => {
    const { user, loading: authLoading, signOut } = useAuth();
    const navigate = useNavigate();
    const { fetchBookmarkedRecipes } = useUserActions();
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Wait for auth session to be restored before checking user
        if (authLoading) return;

        if (!user) {
            navigate('/login', { replace: true });
            return;
        }

        const loadSaved = async () => {
            const data = await fetchBookmarkedRecipes();
            setSavedRecipes(data);
            setLoading(false);
        };
        loadSaved();
    }, [user, authLoading, navigate, fetchBookmarkedRecipes]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="flex-1 bg-[#FAFAFA] flex flex-col p-4 pb-24">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full ring-2 ring-primary/20" />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                            {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                    </div>
                )}
                <div>
                    <h1 className="text-xl font-bold text-gray-900">{user?.user_metadata?.full_name || 'Người dùng mới'}</h1>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
            </div>

            {/* Stats / Quick Actions Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                    onClick={() => navigate('/shopping-list')}
                    className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 border border-gray-50 active:scale-95 transition-transform"
                >
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <ShoppingCart className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">Đi chợ</span>
                </button>
                <div className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center gap-2 border border-gray-50">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <Star className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-gray-800">{savedRecipes.length} Đã lưu</span>
                </div>
            </div>

            {/* Saved Recipes Section */}
            <h2 className="text-lg font-bold text-gray-900 mb-4 px-1">Món ngon đã lưu</h2>
            <div className="space-y-4 mb-8">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : savedRecipes.length > 0 ? (
                    savedRecipes.map(recipe => (
                        <div
                            key={recipe.id}
                            onClick={() => navigate(`/recipe/${recipe.id}`)}
                            className="bg-white p-3 rounded-2xl shadow-sm flex gap-4 active:scale-98 transition-transform cursor-pointer border border-gray-50"
                        >
                            <img src={recipe.cover_image} className="w-20 h-20 rounded-xl object-cover shrink-0" alt="" />
                            <div className="flex flex-col justify-center py-1">
                                <h3 className="font-bold text-gray-900 line-clamp-1">{recipe.title}</h3>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span className="text-xs font-bold text-gray-600">{recipe.avg_rating || 'N/A'}</span>
                                    <span className="text-gray-300 mx-1">•</span>
                                    <span className="text-xs text-gray-400">{recipe.prep_time + recipe.cook_time} phút</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-100">
                        <Bookmark className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Chưa có công thức nào được lưu vào sổ tay.</p>
                    </div>
                )}
            </div>

            {/* Actions Menu */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <ChefHat className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-700">Công thức của tôi</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                            <Settings className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-700">Cài đặt tài khoản</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
            </div>

            <button
                onClick={handleSignOut}
                className="mt-auto w-full bg-white border border-red-100 text-red-500 font-bold py-4 rounded-full shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2 active:scale-95"
            >
                <LogOut className="w-5 h-5" /> Đăng xuất
            </button>
        </div>
    );
};

export default Dashboard;
