import React, { ComponentType, ReactNode } from 'react';
import './PhotoGrid.scss';
import { Image } from '../Image/Image';

export interface PhotoWrapperProps {
  src: string;
  alt: string;
  caption?: string;
  children: ReactNode;
}

// Renders the photo as-is. Photo essays swap in the photo viewer trigger.
export function PlainPhoto({ children }: PhotoWrapperProps) {
  return <>{children}</>;
}

interface PhotoGridProps {
  children: ReactNode;
  caption?: ReactNode;
}

export function PhotoGrid({ children, caption }: PhotoGridProps) {
  return (
    <>
      <div className="photo-grid">{children}</div>
      {caption && <p className="photo-grid__caption">{caption}</p>}
    </>
  );
}

interface PhotoGridItemProps {
  cols: '2' | '5' | '4' | '6' | '8' | '12';
  src: string;
  alt?: string | undefined;
  // Shown only in the full-screen photo viewer, never under the photo
  caption?: string;
  Wrapper?: ComponentType<PhotoWrapperProps>;
}

export function PhotoGridItem({
  cols,
  src,
  alt,
  caption,
  Wrapper = PlainPhoto,
}: PhotoGridItemProps) {
  // Coerce cols to a number to handle string input from MDX
  const colsNum = typeof cols === 'string' ? parseInt(cols, 10) : cols;

  // Calculate responsive sizes based on cols
  const getSizes = (cols: number): string => {
    switch (cols) {
      case 12:
        return '90vw';
      case 8:
        return '(min-width: 768px) 60vw, 90vw';
      case 6:
        return '(min-width: 768px) 45vw, 90vw';
      case 4:
        return '(min-width: 768px) 33vw, 25vw';
      default:
        return '90vw';
    }
  };

  // Calculate appropriate width based on largest expected size for mobile-first approach
  const getWidth = (cols: number): number => {
    switch (cols) {
      case 12:
        return 800; // Reduced from 1200 for better mobile performance
      case 8:
        return 600; // Reduced from 800
      case 6:
        return 400; // Reduced from 600
      case 4:
        return 300; // Reduced from 400
      default:
        return 800;
    }
  };

  const sizes = getSizes(colsNum);
  const width = getWidth(colsNum);

  return (
    <div className={`photo-grid__item photo-grid__item--cols-${colsNum}`}>
      <Wrapper src={src} alt={alt ?? ''} caption={caption}>
        <Image
          useBlurPlaceholder={true}
          src={src}
          alt={alt ?? ''}
          width={width}
          sizes={sizes}
        />
      </Wrapper>
    </div>
  );
}
