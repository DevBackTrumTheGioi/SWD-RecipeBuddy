import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from '../hooks/useAuth';

const ShoppingCartContext = createContext(null);

export const useShoppingCart = () => {
    const ctx = useContext(ShoppingCartContext);
    if (!ctx) throw new Error('useShoppingCart must be used within ShoppingCartProvider');
    return ctx;
};

export const ShoppingCartProvider = ({ children }) => {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [flyAnimation, setFlyAnimation] = useState(null);
    const [badgePulse, setBadgePulse] = useState(false);

    const itemCount = items.filter(i => !i.is_checked).length;

    // --- Fetch ---
    const fetchCart = useCallback(async () => {
        if (!user) { setItems([]); return; }
        setLoading(true);
        const { data, error } = await supabase
            .from('shopping_list')
            .select('*, ingredient_master ( name )')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error) setItems(data || []);
        setLoading(false);
    }, [user]);

    // Auto-fetch on login
    useEffect(() => {
        if (user) fetchCart();
        else setItems([]);
    }, [user, fetchCart]);

    // --- Add ---
    const addItem = useCallback(async (ingredientId, quantity, unit, ingredientName) => {
        if (!user) return { error: 'Login required' };
        try {
            const { data, error } = await supabase
                .from('shopping_list')
                .insert({
                    user_id: user.id,
                    ingredient_id: ingredientId,
                    target_quantity: quantity,
                    unit,
                })
                .select('*, ingredient_master ( name )')
                .single();

            if (error) throw error;

            // Optimistic: add to local state with ingredient name
            if (data) {
                // If ingredient_master didn't come back from select, inject it
                if (!data.ingredient_master && ingredientName) {
                    data.ingredient_master = { name: ingredientName };
                }
                setItems(prev => [data, ...prev]);
            }

            // Trigger badge pulse
            setBadgePulse(true);
            setTimeout(() => setBadgePulse(false), 1200);

            return { data };
        } catch (err) {
            return { error: err.message };
        }
    }, [user]);

    // --- Toggle ---
    const toggleItem = useCallback(async (id, isChecked) => {
        setItems(prev =>
            prev.map(item => (item.id === id ? { ...item, is_checked: isChecked } : item))
        );
        await supabase.from('shopping_list').update({ is_checked: isChecked }).eq('id', id);
    }, []);

    // --- Remove single ---
    const removeItem = useCallback(async (id) => {
        setItems(prev => prev.filter(item => item.id !== id));
        await supabase.from('shopping_list').delete().eq('id', id);
    }, []);

    // --- Clear all ---
    const clearAll = useCallback(async () => {
        if (!user) return;
        setItems([]);
        await supabase.from('shopping_list').delete().eq('user_id', user.id);
    }, [user]);

    // --- Fly animation ---
    const triggerFlyAnimation = useCallback((sourceRect, label) => {
        setFlyAnimation({ sourceRect, label, id: Date.now() });
        setTimeout(() => setFlyAnimation(null), 800);
    }, []);

    return (
        <ShoppingCartContext.Provider
            value={{
                items,
                itemCount,
                loading,
                fetchCart,
                addItem,
                toggleItem,
                removeItem,
                clearAll,
                flyAnimation,
                triggerFlyAnimation,
                badgePulse,
            }}
        >
            {children}
        </ShoppingCartContext.Provider>
    );
};
