import Image from 'next/image';
import { getBlurDataURL } from '../../../utils/blur';

interface BlurImageProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

export default async function BlurImage({
  src,
  alt,
  caption,
  width = 500,
  height = 500,
  className = "mdx-image",
  sizes = "100vw",
  loading = "lazy"
}: BlurImageProps) {
  const blurDataURL = await getBlurDataURL(src);

  const imageComponent = (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      width={width}
      height={height}
      className={className}
      loading={loading}
      placeholder="blur"
      blurDataURL={blurDataURL}
    />
  );

  if (caption) {
    return (
      <figure>
        {imageComponent}
        <figcaption>{caption}</figcaption>
      </figure>
    );
  }

  return imageComponent;
}
