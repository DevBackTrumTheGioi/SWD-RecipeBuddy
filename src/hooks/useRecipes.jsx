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

    const fetchRecipes = useCallback(async ({ categoryId, searchQuery, maxTime = 120, difficulty, ingredients = [], limit = 10 } = {}) => {
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

            // Filter by difficulty at the database level if present
            // Handle case mismatch by converting to lowercase assuming DB uses 'easy', 'medium', 'hard'
            if (difficulty) {
                let diffParam = '';
                if (difficulty === 'Dễ') diffParam = 'easy';
                else if (difficulty === 'Trung bình') diffParam = 'medium';
                else if (difficulty === 'Khó') diffParam = 'hard';
                else diffParam = difficulty;

                if (diffParam) {
                    query = query.eq('difficulty', diffParam);
                }
            }

            const { data, error: recipesError } = await query;
            if (recipesError) throw recipesError;

            // Filter by category if provided (requires join logic, handled simpler for now or via RPC)
            // Since it's a many-to-many, simpler to filter locally if data size is small, 
            // or use a view/rpc for complex queries in production.
            let finalData = data || [];

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

            // Client-side filtering for complex relations (Category, Ingredients, Time)
            // Time filter
            if (maxTime && maxTime < 120) {
                finalData = finalData.filter(r => ((r.prep_time || 0) + (r.cook_time || 0)) <= maxTime);
            }

            // Ingredients filter
            if (ingredients && ingredients.length > 0) {
                // Fetch recipe IDs that have all/any of these ingredients
                // Since `recipe_ingredients` is a relation, and we might not have it loaded, we query it.
                // We'll search by ingredient master name.
                const { data: ingData, error: ingError } = await supabase
                    .from('recipe_ingredients')
                    .select('recipe_id, ingredient_master!inner(name)');

                if (!ingError && ingData) {
                    // Match any ingredient the user typed
                    const matchedRecipeIds = new Set();
                    const filterIngsLower = ingredients.map(ing => ing.toLowerCase());

                    ingData.forEach(item => {
                        if (item.ingredient_master && item.ingredient_master.name) {
                            const dbNameLower = item.ingredient_master.name.toLowerCase();
                            // If any selected ingredient string is included in the DB ingredient name
                            if (filterIngsLower.some(fi => dbNameLower.includes(fi) || fi.includes(dbNameLower))) {
                                matchedRecipeIds.add(item.recipe_id);
                            }
                        }
                    });
                    finalData = finalData.filter(r => matchedRecipeIds.has(r.id));
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
          recipe_ingredients ( id, ingredient_id, quantity, unit, prep_note, ingredient_master (name) ),
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
