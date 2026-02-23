import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '../api/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const hasSession = useRef(false);

    useEffect(() => {
        // Lấy session hiện tại
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            hasSession.current = !!session?.user;
            setLoading(false);
        };

        getSession();

        // Lắng nghe thay đổi trạng thái đăng nhập
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setUser(session?.user ?? null);
                setLoading(false);

                // Show toast on sign in (only if it's a fresh login, not page reload)
                if (event === 'SIGNED_IN' && !hasSession.current) {
                    const name = session?.user?.user_metadata?.full_name || 'bạn';
                    setToast(`Chào mừng ${name}! Đăng nhập thành công 🎉`);
                    setTimeout(() => setToast(null), 3500);
                }
                hasSession.current = !!session?.user;

                if (event === 'SIGNED_OUT') {
                    hasSession.current = false;
                }
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        signInWithGoogle: async () => {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
        },
        signOut: async () => {
            await supabase.auth.signOut();
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in duration-500">
                    <div className="bg-white border border-green-200 text-gray-800 px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 font-bold text-sm">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
                        </div>
                        {toast}
                    </div>
                </div>
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
