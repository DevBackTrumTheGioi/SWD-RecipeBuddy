import React from 'react';
import { Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-primary font-bold text-xl tracking-tight">
                    RecipeBuddy
                </Link>
                <div className="flex items-center gap-4 text-gray-700">
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
                        <Search className="w-5 h-5" />
                    </button>

                    <Link
                        to={user ? "/dashboard" : "/login"}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Profile"
                    >
                        {user?.user_metadata?.avatar_url ? (
                            <img src={user.user_metadata.avatar_url} alt="Ava" className="w-6 h-6 rounded-full border border-gray-200" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
