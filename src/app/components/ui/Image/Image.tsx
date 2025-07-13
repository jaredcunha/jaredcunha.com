'use client';

import { CldImage, getCldImageUrl } from 'next-cloudinary';
import { useEffect, useState } from 'react';

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
  const [blurDataURL, setBlurDataURL] = useState<string | undefined>(undefined);

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

  // Generate proper blur data URL for better placeholder support
  useEffect(() => {
    const generateBlurDataURL = async () => {
      try {
        // Generate a small, low-quality version of the image for blur placeholder
        const blurImageUrl = getCldImageUrl({
          src: publicId,
          width: 10,
          height: 10,
          quality: 10,
          format: 'jpg',
        });

        const response = await fetch(blurImageUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Convert arrayBuffer to base64 in browser environment
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        const dataUrl = `data:${
          response.type || 'image/jpeg'
        };base64,${base64}`;

        setBlurDataURL(dataUrl);
      } catch (error) {
        console.warn('Failed to generate blur data URL:', error);
        // Fallback to simple Cloudinary URL
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (cloudName) {
          setBlurDataURL(
            `https://res.cloudinary.com/${cloudName}/image/upload/w_10,q_10,f_jpg/${publicId}`
          );
        }
      }
    };

    generateBlurDataURL();
  }, [publicId]);

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
      placeholder={blurDataURL ? "blur" : undefined}
      blurDataURL={blurDataURL}
      sizes={sizes}
      style={style}
      dpr="auto"
      format="auto"
      unoptimized={unoptimized} // Use unoptimized for GIFs
    />
  );
}
