import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getAllFiles(dir) {
  const files = [];

  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      if (item.startsWith('.')) continue;

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

async function analyzeImages() {
  const imagesDir = path.join(__dirname, '../public/images');
  const files = getAllFiles(imagesDir);

  const imageData = [];
  let totalSize = 0;
  let candidatesSize = 0;
  let candidatesCount = 0;

  console.log('📊 Analyzing images...\n');

  for (const filePath of files) {
    const relativePath = path.relative(imagesDir, filePath);
    const ext = path.extname(filePath).toLowerCase();

    if (!/\.(jpg|jpeg|png|gif)$/i.test(relativePath)) {
      continue;
    }

    const fileSize = fs.statSync(filePath).size;
    totalSize += fileSize;

    try {
      const metadata = await sharp(filePath).metadata();

      const needsResize = metadata.width > 2400;
      const isCandidate =
        needsResize && ext !== '.gif' && fileSize > 1024 * 1024; // > 1MB

      if (isCandidate) {
        candidatesSize += fileSize;
        candidatesCount++;
      }

      imageData.push({
        path: relativePath,
        width: metadata.width,
        height: metadata.height,
        size: fileSize,
        needsResize,
        isCandidate,
        ext,
      });
    } catch (error) {
      console.error(`Error analyzing ${relativePath}:`, error.message);
    }
  }

  // Sort by file size, largest first
  const candidates = imageData
    .filter((img) => img.isCandidate)
    .sort((a, b) => b.size - a.size);

  console.log('📈 Image Analysis Results:');
  console.log(`Total images: ${imageData.length}`);
  console.log(`Total size: ${formatBytes(totalSize)}`);
  console.log(
    `Images that need resizing: ${
      imageData.filter((img) => img.needsResize).length
    }`
  );
  console.log(`Large images (>1MB) that would benefit: ${candidatesCount}`);
  console.log(
    `Potential savings from large images: ${formatBytes(candidatesSize)}`
  );
  console.log('');

  console.log('🎯 Top 20 candidates for optimization:');
  candidates.slice(0, 20).forEach((img, index) => {
    const estimatedNewSize = img.size * (2400 / img.width) ** 2 * 0.8; // Rough estimate
    const savings = img.size - estimatedNewSize;
    console.log(`${index + 1}. ${img.path}`);
    console.log(
      `   ${img.width}x${img.height} • ${formatBytes(
        img.size
      )} → ~${formatBytes(estimatedNewSize)} (save ~${formatBytes(savings)})`
    );
    console.log('');
  });
}

analyzeImages().catch(console.error);
