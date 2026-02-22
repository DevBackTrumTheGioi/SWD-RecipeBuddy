import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} RecipeBuddy. All rights reserved.</p>
                <p className="mt-2 text-xs">Cùng bạn nấu những bữa ăn ngon.</p>
            </div>
        </footer>
    );
};

export default Footer;
