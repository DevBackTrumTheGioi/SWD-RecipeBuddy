import { useState, useCallback } from 'react';
import { supabase } from '../api/supabase';

export const useRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCategories = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('tags')
                .select('*')
                .eq('type', 'meal_type')
                .order('name');

            if (error) throw error;
            setCategories(data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    }, []);

    const fetchRecipes = useCallback(async ({ categoryId, searchQuery, limit = 10 } = {}) => {
        setLoading(true);
        setError(null);
        try {
            let query = supabase
                .from('recipes')
                .select(`
          *,
          profiles:author_id ( full_name, avatar_url )
        `)
                .eq('status', 'published')
                .order('created_at', { ascending: false })
                .limit(limit);

            if (searchQuery) {
                query = query.ilike('title', `%${searchQuery}%`);
            }

            const { data, error: recipesError } = await query;
            if (recipesError) throw recipesError;

            // Filter by category if provided (requires join logic, handled simpler for now or via RPC)
            // Since it's a many-to-many, simpler to filter locally if data size is small, 
            // or use a view/rpc for complex queries in production.
            let finalData = data;

            if (categoryId) {
                const { data: tagData, error: tagError } = await supabase
                    .from('recipe_tags')
                    .select('recipe_id')
                    .eq('tag_id', categoryId);

                if (!tagError && tagData) {
                    const recipeIds = tagData.map(t => t.recipe_id);
                    finalData = finalData.filter(r => recipeIds.includes(r.id));
                }
            }

            setRecipes(finalData || []);
        } catch (err) {
            console.error('Error fetching recipes:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const getRecipeById = async (id) => {
        try {
            const { data, error } = await supabase
                .from('recipes')
                .select(`
          *,
          profiles:author_id ( full_name, avatar_url ),
          recipe_ingredients ( id, quantity, unit, prep_note, ingredient_master (name) ),
          recipe_steps ( id, step_order, content, timer_seconds )
        `)
                .eq('id', id)
                .single();

            if (error) throw error;

            // Sort steps
            if (data && data.recipe_steps) {
                data.recipe_steps.sort((a, b) => a.step_order - b.step_order);
            }

            return { data, error: null };
        } catch (err) {
            console.error('Error fetching recipe details:', err);
            return { data: null, error: err.message };
        }
    };

    return {
        recipes,
        categories,
        loading,
        error,
        fetchRecipes,
        fetchCategories,
        getRecipeById
    };
};
