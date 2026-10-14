'use client';

import { ReactNode, useEffect, useId, useRef } from 'react';
import { usePhotoViewer } from './PhotoViewerProvider';
import './PhotoViewerTrigger.scss';

interface PhotoViewerTriggerProps {
  src: string;
  alt: string;
  caption?: string;
  children: ReactNode;
}

// Makes a photo open the full-screen viewer. Outside a PhotoViewerProvider
// (e.g. blog posts), it renders the photo unchanged.
export function PhotoViewerTrigger({
  src,
  alt,
  caption,
  children,
}: PhotoViewerTriggerProps) {
  const viewer = usePhotoViewer();
  const register = viewer?.register;
  const id = useId();
  const descriptionId = `${id}-description`;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!register || !buttonRef.current) return;
    return register({ id, src, alt, caption, trigger: buttonRef.current });
  }, [register, id, src, alt, caption]);

  if (!viewer) return <>{children}</>;

  const index = viewer.order.indexOf(id);
  const label =
    index === -1
      ? 'Open photo'
      : `Open photo ${index + 1} of ${viewer.order.length}`;

  return (
    <button
      ref={buttonRef}
      type="button"
      className="photo-viewer-trigger"
      aria-label={label}
      aria-describedby={alt ? descriptionId : undefined}
      onClick={() => viewer.open(id)}
    >
      {children}
      {alt && (
        <span id={descriptionId} hidden>
          {alt}
        </span>
      )}
    </button>
  );
}
