import React from 'react';
import { Search, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
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
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Menu">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
