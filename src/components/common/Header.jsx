import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ShoppingCart, X, Trash2, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';

const Header = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { items, itemCount, badgePulse, clearAll } = useShoppingCart();
    const [showCart, setShowCart] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const cartRef = useRef(null);

    // Close popover on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (cartRef.current && !cartRef.current.contains(e.target)) {
                setShowCart(false);
            }
        };
        if (showCart) document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showCart]);

    const handleClearAll = async () => {
        await clearAll();
        setShowClearConfirm(false);
    };

    const uncheckedItems = items.filter(i => !i.is_checked);

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-primary font-bold text-xl tracking-tight">
                    RecipeBuddy
                </Link>
                <div className="flex items-center gap-2 text-gray-700">
                    <Link
                        to="/search"
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Search"
                    >
                        <Search className="w-5 h-5" />
                    </Link>

                    {/* Cart Icon with Badge & Popover */}
                    <div className="relative" ref={cartRef}>
                        <button
                            onClick={() => setShowCart(!showCart)}
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Shopping Cart"
                            id="desktop-cart-icon"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {itemCount > 0 && (
                                <span
                                    className={`absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 ring-2 ring-white transition-all ${badgePulse
                                            ? 'animate-bounce scale-125 shadow-lg shadow-primary/50'
                                            : ''
                                        }`}
                                >
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* Cart Popover */}
                        {showCart && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-900 text-sm">
                                        Giỏ đi chợ ({itemCount})
                                    </h3>
                                    <button
                                        onClick={() => setShowCart(false)}
                                        className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                <div className="max-h-64 overflow-y-auto">
                                    {uncheckedItems.length > 0 ? (
                                        uncheckedItems.slice(0, 8).map(item => (
                                            <div
                                                key={item.id}
                                                className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                    <span className="text-sm font-medium text-gray-800 truncate">
                                                        {item.ingredient_master?.name || 'Nguyên liệu'}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-bold text-gray-400 shrink-0 ml-2">
                                                    {item.target_quantity} {item.unit}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-8 text-center text-sm text-gray-400">
                                            Giỏ hàng trống
                                        </div>
                                    )}
                                    {uncheckedItems.length > 8 && (
                                        <div className="px-4 py-2 text-xs text-gray-400 text-center">
                                            +{uncheckedItems.length - 8} nguyên liệu khác
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                {items.length > 0 && (
                                    <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-100 bg-gray-50">
                                        <button
                                            onClick={() => {
                                                setShowCart(false);
                                                navigate('/shopping-list');
                                            }}
                                            className="flex-1 text-xs font-bold text-primary flex items-center justify-center gap-1 py-1.5 hover:bg-primary/5 rounded-lg transition-colors"
                                        >
                                            <ExternalLink className="w-3 h-3" />
                                            Xem tất cả
                                        </button>
                                        <div className="w-px h-4 bg-gray-200" />
                                        <button
                                            onClick={() => setShowClearConfirm(true)}
                                            className="flex-1 text-xs font-bold text-red-400 flex items-center justify-center gap-1 py-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Xóa tất cả
                                        </button>
                                    </div>
                                )}

                                {/* Clear confirm */}
                                {showClearConfirm && (
                                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-2xl">
                                        <p className="text-sm font-bold text-gray-900 mb-1">Xóa tất cả?</p>
                                        <p className="text-xs text-gray-500 mb-4">Không thể hoàn tác.</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowClearConfirm(false)}
                                                className="px-4 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-full"
                                            >
                                                Hủy
                                            </button>
                                            <button
                                                onClick={handleClearAll}
                                                className="px-4 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full"
                                            >
                                                Xóa hết
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

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
