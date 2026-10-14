'use client';

import {
  createContext,
  lazy,
  ReactNode,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
// Loaded with the page, not with the viewer's code, so the viewer is never
// shown before its styles arrive
import './PhotoViewer.scss';

export interface ViewerPhoto {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  trigger: HTMLButtonElement;
}

interface PhotoViewerContextValue {
  register: (photo: ViewerPhoto) => () => void;
  open: (id: string) => void;
  // Photo ids in page order, used to label each trigger "Open photo N of M"
  order: string[];
}

const PhotoViewerContext = createContext<PhotoViewerContextValue | null>(null);

export const usePhotoViewer = () => useContext(PhotoViewerContext);

// Loaded on first open so readers who never open the viewer don't download it
const PhotoViewerDialog = lazy(() => import('./PhotoViewerDialog'));

// Sort by position in the document rather than mount order
function sortByPageOrder(photos: Iterable<ViewerPhoto>): ViewerPhoto[] {
  return [...photos].sort((a, b) =>
    a.trigger.compareDocumentPosition(b.trigger) &
    Node.DOCUMENT_POSITION_FOLLOWING
      ? -1
      : 1,
  );
}

export function PhotoViewerProvider({ children }: { children: ReactNode }) {
  const photosRef = useRef(new Map<string, ViewerPhoto>());
  const frameRef = useRef(0);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [viewer, setViewer] = useState<{
    photos: ViewerPhoto[];
    startIndex: number;
  } | null>(null);
  // Kept in memory only, so it resets when the reader leaves the page
  const [captionsVisible, setCaptionsVisible] = useState(true);

  // Batch registrations from the same render into one re-sort
  const scheduleSort = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      setOrder(sortByPageOrder(photosRef.current.values()).map((p) => p.id));
    });
  }, []);

  const register = useCallback(
    (photo: ViewerPhoto) => {
      photosRef.current.set(photo.id, photo);
      scheduleSort();
      return () => {
        photosRef.current.delete(photo.id);
        scheduleSort();
      };
    },
    [scheduleSort],
  );

  const open = useCallback((id: string) => {
    const photos = sortByPageOrder(photosRef.current.values());
    const startIndex = photos.findIndex((p) => p.id === id);
    if (startIndex === -1) return;
    openerRef.current = photos[startIndex].trigger;
    setViewer({ photos, startIndex });
  }, []);

  const close = useCallback(() => {
    setViewer(null);
    // Return focus to the photo that opened the viewer
    openerRef.current?.focus({ preventScroll: true });
  }, []);

  const value = useMemo(
    () => ({ register, open, order }),
    [register, open, order],
  );

  return (
    <PhotoViewerContext.Provider value={value}>
      {children}
      {viewer && (
        <Suspense fallback={null}>
          <PhotoViewerDialog
            photos={viewer.photos}
            startIndex={viewer.startIndex}
            captionsVisible={captionsVisible}
            onCaptionsVisibleChange={setCaptionsVisible}
            onClose={close}
          />
        </Suspense>
      )}
    </PhotoViewerContext.Provider>
  );
}
