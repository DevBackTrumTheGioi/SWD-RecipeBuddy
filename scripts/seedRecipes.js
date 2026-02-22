import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define target URLs to scrape
const targetUrls = [
    'https://www.dienmayxanh.com/vao-bep/cach-nau-pho-bo-nam-dinh-chuan-vi-thom-ngon-nhu-ngoai-hang-08960',
    'https://www.dienmayxanh.com/vao-bep/cach-lam-bun-cha-ha-noi-truyen-thong-dam-da-thom-ngon-nuc-mui-01804',
    'https://www.dienmayxanh.com/vao-bep/2-cach-lam-com-tam-suon-bi-cha-thom-ngon-dam-da-ngay-tai-nha-01740',
    'https://www.dienmayxanh.com/vao-bep/cach-nau-bun-bo-hue-chuan-vi-don-gian-ngon-nhu-ngoai-hang-06041',
    'https://www.dienmayxanh.com/vao-bep/cach-lam-banh-xeo-mien-tay-mem-ngon-vang-ruom-don-gian-tai-nha-11497',
];

// Helper to get raw HTML quickly
async function getHtml(url) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--disable-gpu']
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const html = await page.content();
    await browser.close();
    return html;
}

// Scrapper specific for Dien May Xanh
async function scrapeDMXRecipe(url) {
    try {
        console.log(`Scraping: ${url}`);
        const html = await getHtml(url);
        const $ = cheerio.load(html);

        const title = $('h1.title').text().trim() || $('h1').first().text().trim();
        let cover_image = $('.detail-content img').first().attr('data-src') || $('.detail-content img').first().attr('src');
        if (!cover_image) {
            cover_image = $('meta[property="og:image"]').attr('content');
        }

        const description = $('.info-box p').first().text().trim() || $('meta[name="description"]').attr('content');

        const timeText = $('.time-recipe').text().trim() || '60 phút';
        const difficultyText = $('.level-recipe').text().trim() || 'Trung bình';
        const prep_time = parseInt(timeText.replace(/\D/g, '')) || 30; // minutes mock

        const ingredients = [];
        $('.info-ingredient li').each((i, el) => {
            let text = $(el).text().trim();
            // clean text
            text = text.replace(/Mua ngay.*/, '').trim();
            if (text) ingredients.push(text);
        });

        const steps = [];
        $('.wrap-step-recipe .step-item').each((i, el) => {
            const stepTitle = $(el).find('h3').text().trim();
            const stepContent = $(el).find('.content-step').text().trim();
            if (stepContent) {
                // Remove redundant titles from content
                steps.push(stepContent.replace(stepTitle, '').trim());
            }
        });

        return {
            title,
            cover_image,
            description,
            prep_time: Math.floor(prep_time * 0.3),
            cook_time: Math.floor(prep_time * 0.7),
            base_servings: 4,
            difficulty: difficultyText.toLowerCase().includes('dễ') ? 'easy' : difficultyText.toLowerCase().includes('khó') ? 'hard' : 'medium',
            ingredients,
            steps
        };

    } catch (e) {
        console.error(`Failed to scrape ${url}:`, e);
        return null;
    }
}

async function getAdminProfile() {
    const { data } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1).single();
    if (data) return data.id;
    // Fallback ID if admin not found (using the mock id we set)
    return '11111111-1111-1111-1111-111111111111';
}

async function run() {
    console.log("Starting Web Scraper & Data Seeder...");

    const authorId = await getAdminProfile();

    // 1. Fetch tags logic (Assuming primary meal tag "Món chính" exists)
    const { data: mainTag } = await supabase.from('tags').select('id').eq('name', 'Món chính').single();

    for (const url of targetUrls) {
        const recipeData = await scrapeDMXRecipe(url);
        if (!recipeData || !recipeData.title) continue;

        console.log(`Inserting: ${recipeData.title}`);

        // Insert Recipe
        const { data: recipeObj, error: recipeErr } = await supabase.from('recipes').insert({
            author_id: authorId,
            title: recipeData.title.replace('Cách nấu ', '').replace('Cách làm ', '').replace(' chuẩn vị...', ''), // clean title roughly
            description: recipeData.description.substring(0, 300),
            cover_image: recipeData.cover_image,
            prep_time: recipeData.prep_time,
            cook_time: recipeData.cook_time,
            difficulty: recipeData.difficulty,
            base_servings: recipeData.base_servings,
            status: 'published',
            avg_rating: (4 + Math.random()).toFixed(1)
        }).select().single();

        if (recipeErr) {
            console.error("Error inserting recipe:", recipeErr);
            continue;
        }

        const recipeId = recipeObj.id;

        // Link tag
        if (mainTag) {
            await supabase.from('recipe_tags').insert({
                recipe_id: recipeId,
                tag_id: mainTag.id
            });
        }

        // Insert Ingredients (Basic NLP parsing)
        for (const ingText of recipeData.ingredients) {
            // Very naive split e.g., "Thịt bò 500g" -> Name: "Thịt bò", "500g" ignored for master
            // In a real app we'd use NLP. Here we just take the whole string as name, or split on numbers
            const match = ingText.match(/^([^\d]+)(\d+.*)?$/);
            const ingName = match ? match[1].trim() : ingText;
            const amount = match && match[2] ? match[2].trim() : "1 chút";

            // Find or create ingredient master
            let { data: masterIng } = await supabase.from('ingredient_master').select('id').ilike('name', ingName).limit(1).single();

            if (!masterIng) {
                const { data: newIng } = await supabase.from('ingredient_master').insert({ name: ingName, category: 'other' }).select().single();
                masterIng = newIng;
            }

            if (masterIng) {
                // Split amount "500 g"
                const amtMatch = amount.match(/^(\d+(?:\.\d+)?)\s*(.*)?$/);
                const qty = amtMatch && amtMatch[1] ? parseFloat(amtMatch[1]) : 1;
                const unit = amtMatch && amtMatch[2] ? amtMatch[2].trim() : '';

                await supabase.from('recipe_ingredients').insert({
                    recipe_id: recipeId,
                    ingredient_id: masterIng.id,
                    quantity: qty,
                    unit: unit || 'vừa đủ',
                    prep_note: ingText // Keep full string as note 
                });
            }
        }

        // Insert Steps
        const stepInserts = recipeData.steps.map((content, idx) => ({
            recipe_id: recipeId,
            step_order: idx + 1,
            content: content
        }));

        if (stepInserts.length > 0) {
            await supabase.from('recipe_steps').insert(stepInserts);
        }

        console.log(`✅ Completed: ${recipeData.title}`);
    }

    console.log("All URL recipes processed successfully.");
    process.exit(0);
}

run();
