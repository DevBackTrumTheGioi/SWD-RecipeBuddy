/**
 * Synthetic Data Generator for RecipeBuddy
 * Generates 10,000+ records with intentional edge cases (2026 methodology).
 */

const fs = require('fs');

const TOTAL_RECORDS = 10000;
const ERROR_DATA_RATIO = 0.05; // 5% date format errors
const NEGATIVE_AMOUNT_RATIO = 0.02; // 2% negative amounts
const DUPLICATE_ID_RATIO = 0.01; // 1% duplicate IDs

function generateData() {
    const data = [];
    const ids = new Set();

    for (let i = 0; i < TOTAL_RECORDS; i++) {
        let id = `TXN-${Math.floor(Math.random() * 1000000)}`;
        
        // Intentional Duplicate ID
        if (Math.random() < DUPLICATE_ID_RATIO && data.length > 0) {
            id = data[Math.floor(Math.random() * data.length)].id;
        }

        let amount = Math.floor(Math.random() * 500) + 10;
        // Intentional Negative Amount
        if (Math.random() < NEGATIVE_AMOUNT_RATIO) {
            amount = -amount;
        }

        let date = new Date().toISOString();
        // Intentional Date Format Error
        if (Math.random() < ERROR_DATA_RATIO) {
            date = "2026-13-45T99:99:99Z"; // Invalid date
        }

        data.push({
            id,
            user_id: `USER-${Math.floor(Math.random() * 1000)}`,
            recipe_id: `RECIPE-${Math.floor(Math.random() * 500)}`,
            amount,
            date,
            status: Math.random() > 0.1 ? 'success' : 'failed'
        });
    }

    fs.writeFileSync('synthetic_transactions.json', JSON.stringify(data, null, 2));
    console.log(`Generated ${TOTAL_RECORDS} synthetic records.`);
}

generateData();
