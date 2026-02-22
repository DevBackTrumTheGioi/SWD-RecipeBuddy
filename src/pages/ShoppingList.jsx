import React, { useEffect, useState } from 'react';
import { ShoppingBasket, CheckCircle2, Circle, Trash2, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserActions } from '../hooks/useUserActions';
import { useAuth } from '../hooks/useAuth';

const ShoppingList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { fetchShoppingList, toggleShoppingItem } = useUserActions();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadItems();
    }, [user, navigate]);

    const loadItems = async () => {
        const data = await fetchShoppingList();
        setItems(data);
        setLoading(false);
    };

    const handleToggle = async (id, currentStatus) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, is_checked: !currentStatus } : item
        ));
        await toggleShoppingItem(id, !currentStatus);
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-background min-h-screen pb-24">
            <div className="bg-white px-4 py-6 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => navigate(-1)} className="text-gray-600">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Danh sách đi chợ</h1>
                </div>
                <p className="text-sm text-gray-500">Bạn có {items.filter(i => !i.is_checked).length} nguyên liệu cần mua</p>
            </div>

            <div className="p-4 space-y-4">
                {items.length > 0 ? (
                    <>
                        {/* Unchecked Items */}
                        <div className="space-y-3">
                            {items.filter(i => !i.is_checked).map(item => (
                                <div
                                    key={item.id}
                                    className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-left-2"
                                    onClick={() => handleToggle(item.id, item.is_checked)}
                                >
                                    <div className="flex items-center gap-4">
                                        <Circle className="w-6 h-6 text-gray-300" />
                                        <div>
                                            <p className="font-bold text-gray-900">{item.ingredient_master?.name}</p>
                                            <p className="text-sm text-gray-500">{item.target_quantity} {item.unit}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Checked Items */}
                        {items.some(i => i.is_checked) && (
                            <div className="mt-8">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Đã mua</h2>
                                <div className="space-y-3 opacity-60">
                                    {items.filter(i => i.is_checked).map(item => (
                                        <div
                                            key={item.id}
                                            className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between"
                                            onClick={() => handleToggle(item.id, item.is_checked)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <CheckCircle2 className="w-6 h-6 text-primary" />
                                                <div>
                                                    <p className="font-bold text-gray-400 line-through">{item.ingredient_master?.name}</p>
                                                    <p className="text-sm text-gray-400">{item.target_quantity} {item.unit}</p>
                                                </div>
                                            </div>
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
        </div>
    );
};

export default ShoppingList;
