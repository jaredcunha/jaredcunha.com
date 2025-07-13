import React, { ReactNode } from 'react';
import './PhotoGrid.scss';
import { Image } from '../Image/Image';

interface PhotoGridProps {
  children: ReactNode;
  caption?: string;
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
  cols: 4 | 6 | 8 | 12;
  src: string;
  alt?: string | undefined;
}

export function PhotoGridItem({ cols, src, alt }: PhotoGridItemProps) {
  // Calculate responsive sizes based on cols
  const getSizes = (cols: number): string => {
    switch (cols) {
      case 12:
        return '100vw';
      case 8:
        return '(max-width: 768px) 100vw, 60vw';
      case 6:
        return '(max-width: 768px) 100vw, 40vw';
      case 4:
        return '(max-width: 1200px) 100vw, 33vw';
      default:
        return '100vw';
    }
  };

  const sizes = getSizes(cols);

  return (
    <div className={`photo-grid__item photo-grid__item--cols-${cols}`}>
      <Image src={src} alt={alt ?? ''} width={1200} sizes={sizes} />
    </div>
  );
}
