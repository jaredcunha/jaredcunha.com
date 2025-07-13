'use client';

import { CldImage } from 'next-cloudinary';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height?: number; // Make height optional
  quality?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export function Image({
  src,
  alt,
  className,
  width,
  quality,
  loading = 'lazy',
  priority = false,
  sizes,
  style,
}: ImageProps) {
  // Convert local image path to Cloudinary public_id
  const getPublicId = (src: string): string => {
    // If src is already a public_id or external URL, return as-is
    if (!src.startsWith('/') && !src.startsWith('http')) {
      return src;
    }

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

    return publicId;
  };

  // Get quality setting based on image type
  const getQuality = (src: string, defaultQuality: number = 90): number => {
    // Reduce quality for GIFs to manage file size
    const isGif = src.toLowerCase().includes('.gif');
    return isGif ? Math.min(defaultQuality, 95) : defaultQuality;
  };

  const publicId = getPublicId(src);
  const optimizedQuality = quality || getQuality(src, 90);
  const unoptimized = src.toLowerCase().includes('.gif') ? true : false;

  // Generate blur data URL using Cloudinary
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const blurDataURL = cloudName
    ? `https://res.cloudinary.com/${cloudName}/image/upload/w_10,q_10,f_jpg/${publicId}`
    : undefined;

  return (
    <CldImage
      src={publicId}
      alt={alt}
      className={className}
      width={width}
      height={width} // Use square as default, but crop=scale will preserve aspect ratio
      quality={optimizedQuality}
      loading={loading}
      priority={priority}
      placeholder="blur"
      blurDataURL={blurDataURL}
      sizes={sizes}
      style={style}
      dpr="auto"
      format="auto"
      unoptimized={unoptimized} // Use unoptimized for GIFs
    />
  );
}
