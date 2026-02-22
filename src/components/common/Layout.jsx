import React from 'react';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto md:px-4 md:py-6 relative layout-content">
                {/* On desktop we add padding and max width. On mobile it's fluid. */}
                <div className="w-full h-full bg-white md:rounded-2xl md:shadow-sm overflow-hidden flex flex-col">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
