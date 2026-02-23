import React, { useState } from 'react';
import { ShoppingBasket, CheckCircle2, Circle, Trash2, ArrowLeft, Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useShoppingCart } from '../contexts/ShoppingCartContext';

const ShoppingList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, loading, toggleItem, removeItem, clearAll } = useShoppingCart();
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    if (!user) {
        navigate('/login');
        return null;
    }

    const unchecked = items.filter(i => !i.is_checked);
    const checked = items.filter(i => i.is_checked);

    return (
        <div className="flex-1 bg-background min-h-screen pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-6 shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="text-gray-600">
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Danh sách đi chợ</h1>
                    </div>

                    {/* Clear All Button */}
                    {items.length > 0 && (
                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                        >
                            <Trash className="w-3.5 h-3.5" />
                            Xóa tất cả
                        </button>
                    )}
                </div>
                <p className="text-sm text-gray-500">
                    Bạn có {unchecked.length} nguyên liệu cần mua
                </p>
            </div>

            <div className="p-4 space-y-4">
                {items.length > 0 ? (
                    <>
                        {/* Unchecked Items */}
                        <div className="space-y-3">
                            {unchecked.map(item => (
                                <div
                                    key={item.id}
                                    className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-left-2"
                                >
                                    <div
                                        className="flex items-center gap-4 flex-1 cursor-pointer"
                                        onClick={() => toggleItem(item.id, !item.is_checked)}
                                    >
                                        <Circle className="w-6 h-6 text-gray-300 shrink-0" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-gray-900 truncate">
                                                {item.ingredient_master?.name || 'Nguyên liệu'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {item.target_quantity} {item.unit}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors shrink-0 ml-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Checked Items */}
                        {checked.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    Đã mua ({checked.length})
                                </h2>
                                <div className="space-y-3 opacity-60">
                                    {checked.map(item => (
                                        <div
                                            key={item.id}
                                            className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between"
                                        >
                                            <div
                                                className="flex items-center gap-4 flex-1 cursor-pointer"
                                                onClick={() => toggleItem(item.id, !item.is_checked)}
                                            >
                                                <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="font-bold text-gray-400 line-through truncate">
                                                        {item.ingredient_master?.name || 'Nguyên liệu'}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        {item.target_quantity} {item.unit}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-300 hover:bg-red-50 hover:text-red-400 transition-colors shrink-0 ml-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBasket className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Giỏ hàng trống</h3>
                        <p className="text-gray-500 text-sm max-w-[240px] mt-2">
                            Hãy thêm nguyên liệu từ các công thức để chuẩn bị đi chợ nhé!
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-6 px-8 py-3 bg-primary text-white font-bold rounded-full shadow-lg shadow-primary/20"
                        >
                            Khám phá món ngon
                        </button>
                    </div>
                )}
            </div>

            {/* Clear All Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-6 mx-4 w-full max-w-sm shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Trash className="w-7 h-7 text-red-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Xóa toàn bộ danh sách?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Tất cả {items.length} nguyên liệu sẽ bị xóa. Không thể hoàn tác.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-full hover:bg-gray-200 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={async () => {
                                    await clearAll();
                                    setShowClearConfirm(false);
                                }}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors"
                            >
                                Xóa hết
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShoppingList;
