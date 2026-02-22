import { useState, useCallback } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from './useAuth';

export const useUserActions = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // --- BOOKMARKS ---
    const toggleBookmark = async (recipeId) => {
        if (!user) return { error: 'Login required' };

        setLoading(true);
        try {
            // Check if exists
            const { data: existing } = await supabase
                .from('bookmarks')
                .select('*')
                .eq('user_id', user.id)
                .eq('recipe_id', recipeId)
                .single();

            if (existing) {
                const { error } = await supabase
                    .from('bookmarks')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('recipe_id', recipeId);
                if (error) throw error;
                return { action: 'removed' };
            } else {
                const { error } = await supabase
                    .from('bookmarks')
                    .insert({ user_id: user.id, recipe_id: recipeId });
                if (error) throw error;
                return { action: 'added' };
            }
        } catch (err) {
            console.error('Bookmark error:', err);
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    };

    const isBookmarked = async (recipeId) => {
        if (!user) return false;
        const { data } = await supabase
            .from('bookmarks')
            .select('recipe_id')
            .eq('user_id', user.id)
            .eq('recipe_id', recipeId)
            .single();
        return !!data;
    };

    const fetchBookmarkedRecipes = async () => {
        if (!user) return [];
        const { data, error } = await supabase
            .from('bookmarks')
            .select(`
        recipe_id,
        recipes (*)
      `)
            .eq('user_id', user.id);

        if (error) {
            console.error('Fetch bookmarks error:', error);
            return [];
        }
        return data.map(b => b.recipes);
    };

    // --- REVIEWS ---
    const addReview = async (recipeId, rating, content) => {
        if (!user) return { error: 'Login required' };
        try {
            const { data, error } = await supabase
                .from('reviews')
                .insert({
                    user_id: user.id,
                    recipe_id: recipeId,
                    rating,
                    content
                })
                .select()
                .single();

            if (error) throw error;
            return { data };
        } catch (err) {
            return { error: err.message };
        }
    };

    const fetchReviews = async (recipeId) => {
        const { data, error } = await supabase
            .from('reviews')
            .select(`
        *,
        profiles ( full_name, avatar_url )
      `)
            .eq('recipe_id', recipeId)
            .eq('is_hidden', false)
            .order('created_at', { ascending: false });

        if (error) return [];
        return data;
    };

    // --- SHOPPING LIST ---
    const addToShoppingList = async (ingredientId, quantity, unit) => {
        if (!user) return { error: 'Login required' };
        try {
            const { data, error } = await supabase
                .from('shopping_list')
                .insert({
                    user_id: user.id,
                    ingredient_id: ingredientId,
                    target_quantity: quantity,
                    unit
                })
                .select()
                .single();
            if (error) throw error;
            return { data };
        } catch (err) {
            return { error: err.message };
        }
    };

    const fetchShoppingList = async () => {
        if (!user) return [];
        const { data, error } = await supabase
            .from('shopping_list')
            .select(`
        *,
        ingredient_master ( name )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) return [];
        return data;
    };

    const toggleShoppingItem = async (id, isChecked) => {
        const { error } = await supabase
            .from('shopping_list')
            .update({ is_checked: isChecked })
            .eq('id', id);
        return { error };
    };

    return {
        loading,
        toggleBookmark,
        isBookmarked,
        fetchBookmarkedRecipes,
        addReview,
        fetchReviews,
        addToShoppingList,
        fetchShoppingList,
        toggleShoppingItem
    };
};
