import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs';
import path from 'path';

// Default blur data URL fallback
export const DEFAULT_BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAAAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyepckc5A2HvXzSUVsnhJSlbeiJNR4SpCZBa';

export async function getBlurDataURL(imagePath: string): Promise<string> {
  try {
    // Handle both absolute paths and relative paths
    const fullPath = imagePath.startsWith('/') 
      ? path.join(process.cwd(), 'public', imagePath)
      : imagePath;
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn(`Image not found: ${fullPath}`);
      return DEFAULT_BLUR_DATA_URL;
    }

    const buffer = fs.readFileSync(fullPath);
    const { base64 } = await getPlaiceholder(buffer);
    return base64;
  } catch (error) {
    console.error('Error generating blur data URL:', error);
    // Return a default blur data URL as fallback
    return DEFAULT_BLUR_DATA_URL;
  }
}

export interface ImageWithBlur {
  src: string;
  blurDataURL: string;
  alt: string;
  width?: number;
  height?: number;
}

export async function getImageWithBlur(
  src: string,
  alt: string,
  width?: number,
  height?: number
): Promise<ImageWithBlur> {
  const blurDataURL = await getBlurDataURL(src);
  return {
    src,
    blurDataURL,
    alt,
    width,
    height,
  };
}
