import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Bookmark, Settings, ChefHat, ChevronRight } from 'lucide-react';

const Dashboard = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    // Protect route
    if (!user) {
        navigate('/login', { replace: true });
        return null;
    }

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="flex-1 bg-[#FAFAFA] flex flex-col p-4">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 flex items-center gap-4">
                {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full" />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                            {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </span>
                    </div>
                )}
                <div>
                    <h1 className="text-xl font-bold text-gray-900">{user.user_metadata?.full_name || 'Người dùng mới'}</h1>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>
            </div>

            {/* Action Menu */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <Bookmark className="w-5 h-5" />
                        </div>
                        <span className="font-medium text-gray-700">Sổ tay món ngon</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

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
                className="mt-auto w-full bg-white border border-red-200 text-red-500 font-bold py-4 rounded-full shadow-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            >
                <LogOut className="w-5 h-5" /> Đăng xuất
            </button>
        </div>
    );
};

export default Dashboard;
