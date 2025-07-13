#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to refactor PhotoGridItem in a file
function refactorPhotoGridItems(content) {
  // More comprehensive regex to handle multiline PhotoGridItem components
  const photoGridItemRegex =
    /<PhotoGridItem\s+cols=\{(\d+)\}>\s*<Image\s+src="([^"]+)"\s+alt="([^"]*)"(?:[^>]*)?\s*\/>\s*<\/PhotoGridItem>/gs;

  return content.replace(photoGridItemRegex, (match, cols, src, alt) => {
    // Don't escape quotes in alt text since they're already properly handled
    return `<PhotoGridItem cols={${cols}} src="${src}" alt="${alt}" />`;
  });
}

// Function to recursively find all .mdx files
function findMdxFiles(dir, files = []) {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findMdxFiles(fullPath, files);
    } else if (item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Function to process a single file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const refactoredContent = refactorPhotoGridItems(content);

    if (content !== refactoredContent) {
      fs.writeFileSync(filePath, refactoredContent, 'utf8');
      console.log(`✅ Refactored: ${path.relative(process.cwd(), filePath)}`);
      return true;
    } else {
      console.log(
        `⏭️  No changes needed: ${path.relative(process.cwd(), filePath)}`
      );
      return false;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main function
function main() {
  const contentDir = path.join(__dirname, '..', 'src', 'content');

  if (!fs.existsSync(contentDir)) {
    console.error(`❌ Content directory not found: ${contentDir}`);
    process.exit(1);
  }

  const mdxFiles = findMdxFiles(contentDir);

  let processedCount = 0;
  let changedCount = 0;

  console.log(`Found ${mdxFiles.length} MDX files to process...\n`);

  mdxFiles.forEach((filePath) => {
    const wasChanged = processFile(filePath);

    processedCount++;
    if (wasChanged) {
      changedCount++;
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Files processed: ${processedCount}`);
  console.log(`   Files changed: ${changedCount}`);
  console.log(`   Files unchanged: ${processedCount - changedCount}`);
}

main();
