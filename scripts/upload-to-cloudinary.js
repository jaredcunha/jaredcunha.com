import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env.local') });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImages() {
  const imagesDir = path.join(__dirname, '../public/images');

  if (!fs.existsSync(imagesDir)) {
    console.error('Images directory not found:', imagesDir);
    return;
  }

  console.log('Starting image upload to Cloudinary...');
  console.log('Images directory:', imagesDir);

  // Get all existing images from Cloudinary in one API call
  console.log('Fetching existing images from Cloudinary...');
  const existingImages = await getAllExistingImages();
  console.log(`Found ${existingImages.size} existing images in Cloudinary`);

  const files = getAllFiles(imagesDir);
  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  for (const filePath of files) {
    const relativePath = path.relative(imagesDir, filePath);

    if (!/\.(jpg|jpeg|png|webp|gif)$/i.test(relativePath)) {
      continue;
    }

    // Create public_id from relative path (without extension)
    const publicId = relativePath.replace(/\.[^/.]+$/, '').replace(/\\/g, '/');

    try {
      // Check against our local cache of existing images
      if (existingImages.has(publicId)) {
        skipped++;
        continue;
      }

      // Upload the image
      console.log(`Uploading: ${relativePath} -> ${publicId}`);
      await cloudinary.uploader.upload(filePath, {
        public_id: publicId,
        overwrite: false,
        resource_type: 'image',
      });

      console.log(`✓ Uploaded: ${publicId}`);
      uploaded++;
    } catch (error) {
      console.error(`✗ Error uploading ${relativePath}:`, error.message);
      errors++;
    }
  }

  console.log('\n📊 Upload Summary:');
  console.log(`✓ Uploaded: ${uploaded}`);
  console.log(`⚠ Skipped: ${skipped}`);
  console.log(`✗ Errors: ${errors}`);
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
