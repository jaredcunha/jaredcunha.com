/**
 * Cloudinary image optimization utilities
 */

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png' | 'gif';
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
}

export function getOptimizedImageUrl(
  src: string,
  options: ImageOptions = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    // Fallback to original image if CDN not configured
    console.warn('Cloudinary cloud name not configured, using original image');
    return src;
  }

  // If src is already a full URL, return as-is
  if (src.startsWith('http')) {
    return src;
  }

  // Convert local image path to Cloudinary public_id
  // Remove leading slash and file extension
  let publicId = src.replace(/^\//, '').replace(/\.[^/.]+$/, '');

  // Handle images folder structure
  if (publicId.startsWith('images/')) {
    publicId = publicId.replace('images/', '');
  }

  // Build transformation string
  const transformations = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.crop) transformations.push(`c_${options.crop}`);

  // Add default optimizations
  // Use high quality by default and auto format
  if (!options.quality) transformations.push('q_90'); // Higher quality default
  if (!options.format) transformations.push('f_auto'); // Auto format only

  const transformString = transformations.join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}/${publicId}`;
}

export function getBlurDataUrl(src: string): string {
  return getOptimizedImageUrl(src, {
    width: 10,
    quality: 10,
    format: 'jpg',
  });
}

/**
 * Get image URL optimized for content display with special GIF handling
 */
export function getContentImageUrlWithGifSupport(
  src: string,
  maxWidth: number = 1200,
  quality: number = 90
): string {
  // Check if the source is a GIF
  const isGif = src.toLowerCase().includes('.gif');

  if (isGif) {
    // For GIFs, don't use auto format to preserve animation
    return getOptimizedImageUrl(src, {
      width: maxWidth,
      quality,
      format: 'gif', // Keep as GIF to preserve animation
      crop: 'scale',
    });
  }

  // For other formats, use auto format
  return getOptimizedImageUrl(src, {
    width: maxWidth,
    quality,
    format: 'auto',
    crop: 'scale',
  });
}
