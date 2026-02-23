import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Bookmark, User, ShoppingBag } from 'lucide-react';

const BottomNav = () => {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex justify-around items-center py-3 px-2 z-50 md:hidden pb-safe">
            <NavLink
                to="/"
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-gray-400'}`}
            >
                {({ isActive }) => (
                    <>
                        <Home className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
                    </>
                )}
            </NavLink>

            <NavLink
                to="/search"
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-gray-400'}`}
            >
                {({ isActive }) => (
                    <>
                        <Search className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Tìm kiếm</span>
                    </>
                )}
            </NavLink>

            <div className="relative -mt-8">
                <NavLink
                    to="/shopping-list"
                    className={({ isActive }) => `w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-lg shadow-primary/30 border-4 border-white transition-transform active:scale-90 ${isActive ? 'scale-110' : ''}`}
                >
                    <ShoppingBag className="w-6 h-6" />
                </NavLink>
            </div>

            <NavLink
                to="/dashboard"
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-gray-400'}`}
            >
                {({ isActive }) => (
                    <>
                        <Bookmark className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Đã lưu</span>
                    </>
                )}
            </NavLink>

            {/* Note: In a real app we might want separate routes for Profile vs Dashboard, but for now we point to /dashboard */}
            <NavLink
                to="/dashboard"
                className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary scale-110' : 'text-gray-400'}`}
            >
                {({ isActive }) => (
                    <>
                        <User className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Tôi</span>
                    </>
                )}
            </NavLink>
        </nav>
    );
};

export default BottomNav;
