import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_WIDTH = 2400;

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimizeSpecificImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.gif') {
    console.log(`Skipping GIF: ${path.basename(filePath)}`);
    return false;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    if (metadata.width <= MAX_WIDTH) {
      console.log(
        `No resize needed: ${path.basename(filePath)} (${
          metadata.width
        }px wide)`
      );
      return false;
    }

    console.log(
      `Optimizing: ${path.basename(filePath)} (${metadata.width}x${
        metadata.height
      })`
    );

    const originalSize = fs.statSync(filePath).size;
    const backupPath = filePath + '.backup';
    const tempPath = filePath + '.temp';

    // Create backup
    fs.copyFileSync(filePath, backupPath);

    // Optimize
    await image
      .resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside',
      })
      .toFile(tempPath);

    const optimizedSize = fs.statSync(tempPath).size;

    if (optimizedSize < originalSize) {
      // Replace original with optimized
      fs.renameSync(tempPath, filePath);
      const savings = (
        ((originalSize - optimizedSize) / originalSize) *
        100
      ).toFixed(1);
      console.log(
        `✓ Optimized: ${savings}% savings (${formatBytes(
          originalSize
        )} → ${formatBytes(optimizedSize)})`
      );
      console.log(`✓ Backup saved as: ${path.basename(backupPath)}`);
      return true;
    } else {
      // Keep original
      fs.unlinkSync(tempPath);
      fs.unlinkSync(backupPath);
      console.log(`→ Keeping original (optimized version was larger)`);
      return false;
    }
  } catch (error) {
    console.error(
      `✗ Error optimizing ${path.basename(filePath)}:`,
      error.message
    );
    return false;
  }
}

async function optimizeTargetImages() {
  const imagesDir = path.join(__dirname, '../public/images');

  // These are the specific images that need optimization based on analysis
  const targetImages = [
    'rome-2023/street-3.jpg',
    // Add any other large images here if found
  ];

  console.log('🎯 Optimizing specific large images...\n');

  for (const relativePath of targetImages) {
    const fullPath = path.join(imagesDir, relativePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠ File not found: ${relativePath}`);
      continue;
    }

    await optimizeSpecificImage(fullPath);
    console.log('');
  }

  console.log('✅ Done! Your images are now optimized for web use.');
  console.log(
    '💡 Backup files (.backup) are created for safety - you can delete them if happy with results.'
  );
}

optimizeTargetImages().catch(console.error);
