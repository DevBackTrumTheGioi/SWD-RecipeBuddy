import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ChefHat } from 'lucide-react';

const Login = () => {
    const { signInWithGoogle, user, loading } = useAuth();
    const navigate = useNavigate();

    // If already logged in, redirect to home
    useEffect(() => {
        if (!loading && user) {
            navigate('/', { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (user) return null;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md text-center border border-gray-100">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="w-8 h-8 text-primary" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Chào mừng đến với RecipeBuddy</h1>
                <p className="text-gray-500 mb-8">Đăng nhập để lưu và chia sẻ hàng ngàn công thức nấu ăn ngon mỗi ngày.</p>

                <button
                    onClick={signInWithGoogle}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                    Tiếp tục với Google
                </button>

                <p className="mt-6 text-sm text-gray-400">
                    Bằng việc đăng nhập, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
                </p>
            </div>
        </div>
    );
};

export default Login;
