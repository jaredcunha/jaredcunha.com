'use client';

import {
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Icon } from '../Icon/Icon';
import { getOptimizedImageUrl } from '@/app/utils/image-cdn';
import type { ViewerPhoto } from './PhotoViewerProvider';

// Whether clicking the black area around the photo closes the viewer.
// Off until we decide how it feels.
const CLOSE_ON_BACKDROP_CLICK = false;
const CONTROLS_HIDE_DELAY = 2000;

function getViewerImageUrl(src: string): string {
  const dpr = window.devicePixelRatio || 1;
  // Round up to 400px steps so similar screens share cached images
  const width = Math.min(
    2400,
    Math.max(800, Math.ceil((window.innerWidth * dpr) / 400) * 400),
  );

  if (src.toLowerCase().includes('.gif')) {
    // Keep GIFs animated and capped, matching how the page handles them
    return getOptimizedImageUrl(src, {
      width: Math.min(width, 1200),
      format: 'gif',
      crop: 'limit',
    });
  }

  return getOptimizedImageUrl(src, { width, quality: 80, crop: 'limit' });
}

// Whether a point lands on the visible photo rather than the letterboxing
// that object-fit: contain leaves around it
function isOnPhoto(img: HTMLImageElement, x: number, y: number): boolean {
  const box = img.getBoundingClientRect();
  if (!img.naturalWidth || !img.naturalHeight) return true;
  const scale = Math.min(
    box.width / img.naturalWidth,
    box.height / img.naturalHeight,
  );
  const width = img.naturalWidth * scale;
  const height = img.naturalHeight * scale;
  const left = box.left + (box.width - width) / 2;
  const top = box.top + (box.height - height) / 2;
  return x >= left && x <= left + width && y >= top && y <= top + height;
}

interface PhotoViewerDialogProps {
  photos: ViewerPhoto[];
  startIndex: number;
  captionsVisible: boolean;
  onCaptionsVisibleChange: (visible: boolean) => void;
  onClose: () => void;
}

export default function PhotoViewerDialog({
  photos,
  startIndex,
  captionsVisible,
  onCaptionsVisibleChange,
  onClose,
}: PhotoViewerDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const indexRef = useRef(startIndex);
  const idleTimerRef = useRef(0);
  const captionId = useId();

  const [index, setIndex] = useState(startIndex);
  const [loadedSrcs, setLoadedSrcs] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [controlsIdle, setControlsIdle] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  // Not available on iPhone, where Safari only allows full screen video
  const [canFullscreen] = useState(() => document.fullscreenEnabled);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const photo = photos[index];
  const total = photos.length;
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const urls = useMemo(
    () => photos.map((p) => getViewerImageUrl(p.src)),
    [photos],
  );
  const currentLoaded = loadedSrcs.has(urls[index]);

  const markLoaded = (url: string) =>
    setLoadedSrcs((prev) => (prev.has(url) ? prev : new Set(prev).add(url)));

  // The scroll position is the source of truth for the current photo, so
  // swipes, trackpad gestures, and buttons all stay in sync
  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (!scroller?.clientWidth) return;
    const i = Math.round(scroller.scrollLeft / scroller.clientWidth);
    const clamped = Math.min(Math.max(i, 0), total - 1);
    indexRef.current = clamped;
    setIndex(clamped);
  };

  const goTo = useCallback(
    (i: number) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const target = Math.min(Math.max(i, 0), total - 1);
      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;
      // Slide to a neighbor; jump straight to the first or last photo
      const slide = !reduceMotion && Math.abs(target - indexRef.current) === 1;
      scroller.scrollTo({
        left: target * scroller.clientWidth,
        behavior: slide ? 'smooth' : 'instant',
      });
    },
    [total],
  );

  const close = async () => {
    // Leave full screen first so focus can return to the page
    if (document.fullscreenElement) {
      await document.exitFullscreen().catch(() => {});
    }
    dialogRef.current?.close();
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      innerRef.current?.requestFullscreen().catch(() => {});
    }
  };

  const wakeControls = useCallback(() => {
    setControlsIdle(false);
    window.clearTimeout(idleTimerRef.current);
    idleTimerRef.current = window.setTimeout(
      () => setControlsIdle(true),
      CONTROLS_HIDE_DELAY,
    );
  }, []);

  // Open as a modal, lock page scroll, and position the strip on the
  // starting photo before the first paint. Closing (Escape, close button)
  // fires the dialog's close event, which calls onClose.
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    if (!dialog || !scroller) return;
    const root = document.documentElement;
    const scrollY = window.scrollY;
    const previousOverflow = root.style.overflow;

    root.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    // Focus the viewer itself rather than its first button, so opening
    // doesn't show a focus ring on Close
    dialog.focus({ preventScroll: true });
    scroller.scrollLeft = indexRef.current * scroller.clientWidth;

    // Stay on the same photo when the window or orientation changes. Height
    // changes (the caption bar coming and going) mustn't interrupt a swipe.
    let lastWidth = scroller.clientWidth;
    const resizeObserver = new ResizeObserver(() => {
      if (scroller.clientWidth === lastWidth) return;
      lastWidth = scroller.clientWidth;
      scroller.scrollLeft = indexRef.current * scroller.clientWidth;
    });
    resizeObserver.observe(scroller);

    return () => {
      resizeObserver.disconnect();
      root.style.overflow = previousOverflow;
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
  }, []);

  // Track full screen (it can also be exited with Escape or browser UI),
  // and leave it when the viewer closes
  useEffect(() => {
    const update = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', update);
    return () => {
      document.removeEventListener('fullscreenchange', update);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);

  useEffect(() => {
    wakeControls();
    return () => window.clearTimeout(idleTimerRef.current);
  }, [wakeControls]);

  // Announce the position and description on open and on each change
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAnnouncement(
        `Photo ${index + 1} of ${total}.${photo.alt ? ` ${photo.alt}` : ''}`,
      );
    }, 150);
    return () => window.clearTimeout(timer);
  }, [index, total, photo.alt]);

  // If the focused arrow was removed at the start or end of the list,
  // move focus to the remaining arrow (or close) instead of losing it
  useEffect(() => {
    const active = document.activeElement;
    if (!active || active === document.body) {
      (prevRef.current ?? nextRef.current ?? closeRef.current)?.focus();
    }
  }, [index]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    switch (event.key) {
      case 'ArrowRight':
        goTo(indexRef.current + 1);
        break;
      case 'ArrowLeft':
        goTo(indexRef.current - 1);
        break;
      case 'Home':
        goTo(0);
        break;
      case 'End':
        goTo(total - 1);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const handleStageClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!CLOSE_ON_BACKDROP_CLICK) return;
    const target = event.target as HTMLElement;
    if (target.closest('button')) return;
    if (
      target instanceof HTMLImageElement &&
      isOnPhoto(target, event.clientX, event.clientY)
    ) {
      return;
    }
    close();
  };

  return (
    <dialog
      ref={dialogRef}
      className={`photo-viewer${controlsIdle ? ' photo-viewer--idle' : ''}`}
      aria-label="Photo viewer"
      tabIndex={-1}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      onPointerMove={wakeControls}
    >
      {/* The full screen element. Using an inner container rather than the
          dialog itself works across browsers. */}
      <div ref={innerRef} className="photo-viewer__inner">
        <div className="photo-viewer__top-controls">
          {canFullscreen && (
            <button
              type="button"
              className="photo-viewer__button"
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
              onClick={toggleFullscreen}
            >
              <Icon icon={isFullscreen ? 'compress' : 'expand'} />
            </button>
          )}
          <button
            ref={closeRef}
            type="button"
            className="photo-viewer__button"
            aria-label="Close"
            onClick={close}
          >
            <Icon icon="times" />
          </button>
        </div>

        <p className="photo-viewer__counter">
          {index + 1} of {total}
        </p>

        <div className="photo-viewer__stage" onClick={handleStageClick}>
          <div
            ref={scrollerRef}
            className="photo-viewer__scroller"
            role="group"
            aria-label="Photos"
            // Focusable so keyboard users can reach the scrolling region;
            // arrow keys move between photos from here too
            tabIndex={0}
            onScroll={handleScroll}
          >
            {photos.map((p, i) => {
              // Only the current photo and its neighbors render images.
              // Neighbors load once the current photo has finished loading.
              const isNear = Math.abs(i - index) <= 1;
              const url = urls[i];
              const isLoaded = loadedSrcs.has(url);
              const showFull =
                i === index || isLoaded || (isNear && currentLoaded);
              const placeholderSrc = isNear
                ? p.trigger.querySelector('img')?.currentSrc || undefined
                : undefined;

              return (
                <div
                  key={p.id}
                  className="photo-viewer__slide"
                  aria-hidden={i === index ? undefined : true}
                >
                  {isNear && (
                    <div className="photo-viewer__frame">
                      {placeholderSrc && !isLoaded && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className="photo-viewer__img photo-viewer__img--placeholder"
                          src={placeholderSrc}
                          alt=""
                        />
                      )}
                      {showFull && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          className={`photo-viewer__img photo-viewer__img--full${
                            isLoaded ? ' is-loaded' : ''
                          }`}
                          src={url}
                          alt={p.alt}
                          onLoad={() => markLoaded(url)}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!isFirst && (
            <button
              ref={prevRef}
              type="button"
              className="photo-viewer__button photo-viewer__nav photo-viewer__nav--prev"
              aria-label="Previous photo"
              onClick={() => goTo(indexRef.current - 1)}
            >
              <Icon icon="chevron-left" />
            </button>
          )}
          {!isLast && (
            <button
              ref={nextRef}
              type="button"
              className="photo-viewer__button photo-viewer__nav photo-viewer__nav--next"
              aria-label="Next photo"
              onClick={() => goTo(indexRef.current + 1)}
            >
              <Icon icon="chevron-right" />
            </button>
          )}
        </div>

        {photo.caption && (
          <div className="photo-viewer__caption-bar">
            <button
              type="button"
              className="photo-viewer__button photo-viewer__caption-toggle"
              aria-expanded={captionsVisible}
              aria-controls={captionId}
              onClick={() => onCaptionsVisibleChange(!captionsVisible)}
            >
              {captionsVisible ? 'Hide caption' : 'Show caption'}
            </button>
            <p
              id={captionId}
              className="photo-viewer__caption"
              hidden={!captionsVisible}
            >
              {photo.caption}
            </p>
          </div>
        )}

        <p className="sr-only" aria-live="polite">
          {announcement}
        </p>
      </div>
    </dialog>
  );
}
