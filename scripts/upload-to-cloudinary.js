import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const MAX_WIDTH = 2400;
const TEST_MODE = process.argv.includes('--test'); // Add --test flag to run in test mode
const FORCE_UPLOAD = process.argv.includes('--force'); // Add --force flag to overwrite existing images

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function optimizeImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();

  // Skip GIFs as requested
  if (ext === '.gif') {
    console.log(`Skipping GIF optimization: ${path.basename(inputPath)}`);
    return false;
  }

  // Only process JPG and PNG files
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
    return false;
  }

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    console.log(
      `Processing: ${path.basename(inputPath)} (${metadata.width}x${
        metadata.height
      })`
    );

    // Only resize if width is greater than MAX_WIDTH
    if (metadata.width <= MAX_WIDTH) {
      console.log(`  → No resize needed (already ${metadata.width}px wide)`);
      return false; // Don't process images that don't need resizing
    }

    console.log(`  → Resizing from ${metadata.width}px to ${MAX_WIDTH}px wide`);

    // Get original file size for comparison
    const originalSize = fs.statSync(inputPath).size;

    // Simple resize-only approach - don't re-compress, just resize
    await image
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .toFile(outputPath);

    const optimizedSize = fs.statSync(outputPath).size;

    // Only keep optimized version if it's smaller or reasonably close in size
    if (optimizedSize > originalSize * 1.2) {
      // Allow 20% size increase for resize
      console.log(
        `  → Optimized version too large (${formatBytes(
          originalSize
        )} → ${formatBytes(optimizedSize)}), keeping original`
      );
      fs.unlinkSync(outputPath); // Delete the larger file
      return false;
    }

    const change =
      optimizedSize > originalSize
        ? `+${(((optimizedSize - originalSize) / originalSize) * 100).toFixed(
            1
          )}%`
        : `-${(((originalSize - optimizedSize) / originalSize) * 100).toFixed(
            1
          )}%`;

    console.log(
      `  → Size change: ${change} (${formatBytes(originalSize)} → ${formatBytes(
        optimizedSize
      )})`
    );
    return true;
  } catch (error) {
    console.error(
      `  ✗ Error optimizing ${path.basename(inputPath)}:`,
      error.message
    );
    return false;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function uploadImages() {
  const imagesDir = path.join(__dirname, '../public/images');

  if (!fs.existsSync(imagesDir)) {
    console.error('Images directory not found:', imagesDir);
    return;
  }

  console.log('🖼️  Starting image optimization and upload to Cloudinary...');
  console.log('Images directory:', imagesDir);
  console.log('Max width:', MAX_WIDTH + 'px');
  console.log('Test mode:', TEST_MODE ? 'ON (no uploads)' : 'OFF');
  console.log(
    'Force upload:',
    FORCE_UPLOAD ? 'ON (overwrite existing)' : 'OFF'
  );
  console.log('');

  // Get all existing images from Cloudinary in one API call (skip in test mode)
  let existingImages = new Set();
  if (!TEST_MODE) {
    console.log('Fetching existing images from Cloudinary...');
    existingImages = await getAllExistingImages();
    console.log(`Found ${existingImages.size} existing images in Cloudinary`);
  }

  const files = getAllFiles(imagesDir);
  let optimized = 0;
  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of files) {
    const relativePath = path.relative(imagesDir, filePath);

    if (!/\.(jpg|jpeg|png|gif)$/i.test(relativePath)) {
      continue;
    }

    // Create public_id from relative path (without extension)
    const publicId = relativePath.replace(/\.[^/.]+$/, '').replace(/\\/g, '/');

    try {
      // Step 1: Optimize the image (always optimize to ensure quality)
      const tempPath = filePath + '.temp';
      let wasOptimized = false;

      // Skip optimization if file is already a .temp or .backup file to prevent infinite loops
      if (filePath.includes('.temp') || filePath.includes('.backup')) {
        console.log(`→ Skipped temp/backup file: ${relativePath}`);
        continue;
      }

      wasOptimized = await optimizeImage(filePath, tempPath);

      if (wasOptimized) {
        // Replace original with optimized version
        fs.renameSync(tempPath, filePath);
        optimized++;
        console.log(`✓ Optimized: ${relativePath}`);
      } else {
        console.log(`→ Skipped optimization: ${relativePath}`);
      }

      // Step 2: Upload to Cloudinary (skip in test mode)
      if (TEST_MODE) {
        console.log(`[TEST MODE] Would upload: ${relativePath} -> ${publicId}`);
        continue;
      }

      // Check if image already exists (unless force upload is enabled)
      if (!FORCE_UPLOAD && existingImages.has(publicId)) {
        skipped++;
        continue;
      }

      // Upload the image
      console.log(`Uploading: ${relativePath} -> ${publicId}`);
      await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: FORCE_UPLOAD, // Only overwrite if force flag is set
        resource_type: 'image',
      });

      console.log(`✓ Uploaded: ${publicId}`);
      uploaded++;
    } catch (error) {
      console.error(`✗ Error processing ${relativePath}:`, error.message);
      // Clean up temp file if it exists
      const tempPath = filePath + '.temp';
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
      errors++;
    }
  }

  console.log('\n📊 Processing Summary:');
  console.log(`🎨 Optimized: ${optimized}`);
  if (!TEST_MODE) {
    console.log(`✓ Uploaded: ${uploaded}`);
    console.log(`⚠ Skipped: ${skipped}`);
  }
  console.log(`✗ Errors: ${errors}`);

  if (TEST_MODE) {
    console.log(
      '\n💡 This was a test run. To actually upload, run without --test flag'
    );
    console.log('💡 To overwrite existing images, add --force flag');
  }
}

async function getAllExistingImages() {
  const existingImages = new Set();
  let nextCursor = null;

  try {
    do {
      const options = {
        max_results: 500, // Maximum allowed per request
        resource_type: 'image',
      };

      if (nextCursor) {
        options.next_cursor = nextCursor;
      }

      const result = await cloudinary.api.resources(options);

      // Add all public_ids to our set
      result.resources.forEach((resource) => {
        existingImages.add(resource.public_id);
      });

      nextCursor = result.next_cursor;
    } while (nextCursor);
  } catch (error) {
    console.error('Error fetching existing images:', error.message);
    // Return empty set on error - will attempt to upload all images
  }

  return existingImages;
}

function getAllFiles(dir) {
  const files = [];

  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      if (item.startsWith('.')) continue; // Skip hidden files

      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }

  scanDir(dir);
  return files;
}

uploadImages().catch(console.error);
