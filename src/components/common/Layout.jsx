import React from 'react';
import Header from './Header';
import Footer from './Footer';
import BottomNav from './BottomNav';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    // Hide footer on mobile for cleaner look if navigation is bottom
    // Some pages might want to hide header/footer
    const isAuthPage = location.pathname === '/login';

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-sans overflow-x-hidden">
            {!isAuthPage && (
                <div className="hidden md:block">
                    <Header />
                </div>
            )}

            <main className="flex-1 w-full max-w-7xl mx-auto md:px-4 md:py-6 relative layout-content flex flex-col">
                <div className="flex-1 w-full h-full bg-white md:rounded-2xl md:shadow-sm overflow-hidden flex flex-col min-h-0">
                    {children}
                </div>
            </main>

            {!isAuthPage && (
                <>
                    <div className="hidden md:block">
                        <Footer />
                    </div>
                    <BottomNav />
                </>
            )}
        </div>
    );
};

export default Layout;
