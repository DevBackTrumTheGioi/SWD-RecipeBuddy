/**
 * Image utility functions for RecipeBuddy.
 * Client-side compression using Canvas API — zero external dependencies.
 */

/**
 * Validates an image file before processing.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export const validateImage = (file) => {
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE_MB = 5;

    if (!file) return { valid: false, error: 'Chưa chọn file ảnh.' };
    if (!ALLOWED_TYPES.includes(file.type)) {
        return { valid: false, error: 'Chỉ hỗ trợ JPG, PNG hoặc WebP.' };
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        return { valid: false, error: `Ảnh không được vượt quá ${MAX_SIZE_MB}MB.` };
    }
    return { valid: true };
};

/**
 * Loads an image file into an HTMLImageElement.
 * @param {File} file
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = (file) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });

/**
 * Resizes and compresses an image using Canvas.
 * @param {File} file - Original image file
 * @param {{ maxWidth?: number, quality?: number }} options
 * @returns {Promise<Blob>} Compressed image blob
 */
export const compressImage = async (file, { maxWidth = 1200, quality = 0.8 } = {}) => {
    const img = await loadImage(file);

    let { width, height } = img;
    if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    // Clean up object URL
    URL.revokeObjectURL(img.src);

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Compress failed'))),
            'image/webp',
            quality
        );
    });
};

/**
 * Generates a smaller thumbnail from an image file.
 * @param {File} file
 * @param {{ maxWidth?: number }} options
 * @returns {Promise<Blob>}
 */
export const generateThumbnail = (file, { maxWidth = 400 } = {}) =>
    compressImage(file, { maxWidth, quality: 0.6 });

/**
 * Creates a local preview URL for an image file.
 * Remember to revoke with URL.revokeObjectURL() when done.
 * @param {File} file
 * @returns {string}
 */
export const createPreviewUrl = (file) => URL.createObjectURL(file);
