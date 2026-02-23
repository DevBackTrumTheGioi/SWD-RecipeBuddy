import { useState, useCallback } from 'react';
import { supabase } from '../api/supabase';
import { useAuth } from './useAuth';
import { compressImage, validateImage } from '../utils/imageUtils';

/**
 * Custom hook for the Contribute Recipe multi-step form.
 * Manages form state, image upload, and recipe submission.
 */
export const useContributeRecipe = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [currentFormStep, setCurrentFormStep] = useState(0);
    const [error, setError] = useState(null);

    // Step 1: Basic info
    const [basicInfo, setBasicInfo] = useState({
        title: '',
        description: '',
        coverImage: null,
        coverPreview: '',
        prep_time: 15,
        cook_time: 30,
        difficulty: 'easy',
        base_servings: 2,
    });

    // Step 2: Ingredients
    const [ingredients, setIngredients] = useState([
        { name: '', quantity: '', unit: 'g', prep_note: '' },
    ]);

    // Step 3: Steps
    const [recipeSteps, setRecipeSteps] = useState([
        { content: '', timer_seconds: 0 },
    ]);

    // --- Form step navigation ---
    const goToFormStep = useCallback((step) => {
        if (step >= 0 && step <= 2) setCurrentFormStep(step);
    }, []);

    const nextFormStep = useCallback(() => {
        setCurrentFormStep((prev) => Math.min(prev + 1, 2));
    }, []);

    const prevFormStep = useCallback(() => {
        setCurrentFormStep((prev) => Math.max(prev - 1, 0));
    }, []);

    // --- Basic info handlers ---
    const updateBasicInfo = useCallback((field, value) => {
        setBasicInfo((prev) => ({ ...prev, [field]: value }));
    }, []);

    const setCoverImage = useCallback((file) => {
        if (!file) return;
        const validation = validateImage(file);
        if (!validation.valid) {
            setError(validation.error);
            return;
        }
        setError(null);
        const preview = URL.createObjectURL(file);
        setBasicInfo((prev) => ({
            ...prev,
            coverImage: file,
            coverPreview: preview,
        }));
    }, []);

    // --- Ingredient handlers ---
    const addIngredient = useCallback(() => {
        setIngredients((prev) => [
            ...prev,
            { name: '', quantity: '', unit: 'g', prep_note: '' },
        ]);
    }, []);

    const removeIngredient = useCallback((index) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateIngredient = useCallback((index, field, value) => {
        setIngredients((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    }, []);

    // --- Step handlers ---
    const addStep = useCallback(() => {
        setRecipeSteps((prev) => [...prev, { content: '', timer_seconds: 0 }]);
    }, []);

    const removeStep = useCallback((index) => {
        setRecipeSteps((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const updateStep = useCallback((index, field, value) => {
        setRecipeSteps((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    }, []);

    // --- Validation ---
    const validateStep = useCallback(() => {
        setError(null);

        if (currentFormStep === 0) {
            if (!basicInfo.title.trim()) {
                setError('Vui lòng nhập tên công thức.');
                return false;
            }
            if (!basicInfo.description.trim()) {
                setError('Vui lòng nhập mô tả.');
                return false;
            }
        }

        if (currentFormStep === 1) {
            const validIngredients = ingredients.filter(
                (i) => i.name.trim() && i.quantity
            );
            if (validIngredients.length === 0) {
                setError('Cần ít nhất 1 nguyên liệu.');
                return false;
            }
        }

        if (currentFormStep === 2) {
            const validSteps = recipeSteps.filter((s) => s.content.trim());
            if (validSteps.length === 0) {
                setError('Cần ít nhất 1 bước nấu.');
                return false;
            }
        }

        return true;
    }, [currentFormStep, basicInfo, ingredients, recipeSteps]);

    // --- Image upload ---
    const uploadImage = useCallback(
        async (file) => {
            if (!user || !file) return null;

            const compressed = await compressImage(file);
            const fileName = `${user.id}/${Date.now()}.webp`;

            const { data, error: uploadError } = await supabase.storage
                .from('recipe-images')
                .upload(fileName, compressed, {
                    contentType: 'image/webp',
                    upsert: false,
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('recipe-images')
                .getPublicUrl(data.path);

            return urlData.publicUrl;
        },
        [user]
    );

    // --- Submit recipe ---
    const submitRecipe = useCallback(async () => {
        if (!user) {
            setError('Vui lòng đăng nhập.');
            return { error: 'Not authenticated' };
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Upload cover image
            let coverUrl = null;
            if (basicInfo.coverImage) {
                coverUrl = await uploadImage(basicInfo.coverImage);
            }

            // 2. Insert recipe
            const { data: recipeData, error: recipeError } = await supabase
                .from('recipes')
                .insert({
                    author_id: user.id,
                    title: basicInfo.title.trim(),
                    description: basicInfo.description.trim(),
                    cover_image: coverUrl,
                    prep_time: parseInt(basicInfo.prep_time) || 0,
                    cook_time: parseInt(basicInfo.cook_time) || 0,
                    difficulty: basicInfo.difficulty,
                    base_servings: parseInt(basicInfo.base_servings) || 2,
                    status: 'pending',
                })
                .select()
                .single();

            if (recipeError) throw recipeError;

            const recipeId = recipeData.id;

            // 3. Insert ingredients
            const validIngredients = ingredients.filter(
                (i) => i.name.trim() && i.quantity
            );

            for (const ing of validIngredients) {
                // Upsert ingredient_master
                let { data: existingIng } = await supabase
                    .from('ingredient_master')
                    .select('id')
                    .ilike('name', ing.name.trim())
                    .single();

                if (!existingIng) {
                    const { data: newIng, error: ingError } = await supabase
                        .from('ingredient_master')
                        .insert({ name: ing.name.trim() })
                        .select()
                        .single();
                    if (ingError) throw ingError;
                    existingIng = newIng;
                }

                await supabase.from('recipe_ingredients').insert({
                    recipe_id: recipeId,
                    ingredient_id: existingIng.id,
                    quantity: parseFloat(ing.quantity) || 0,
                    unit: ing.unit || '',
                    prep_note: ing.prep_note || '',
                });
            }

            // 4. Insert steps
            const validSteps = recipeSteps.filter((s) => s.content.trim());
            for (let i = 0; i < validSteps.length; i++) {
                await supabase.from('recipe_steps').insert({
                    recipe_id: recipeId,
                    step_order: i + 1,
                    content: validSteps[i].content.trim(),
                    timer_seconds: parseInt(validSteps[i].timer_seconds) || null,
                });
            }

            return { data: recipeData, error: null };
        } catch (err) {
            console.error('Submit recipe error:', err);
            setError(err.message || 'Có lỗi xảy ra khi gửi công thức.');
            return { error: err.message };
        } finally {
            setLoading(false);
        }
    }, [user, basicInfo, ingredients, recipeSteps, uploadImage]);

    return {
        loading,
        error,
        currentFormStep,
        goToFormStep,
        nextFormStep,
        prevFormStep,
        validateStep,

        basicInfo,
        updateBasicInfo,
        setCoverImage,

        ingredients,
        addIngredient,
        removeIngredient,
        updateIngredient,

        recipeSteps,
        addStep,
        removeStep,
        updateStep,

        submitRecipe,
    };
};
