import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// jsdom doesn't implement several browser APIs the site uses. These stand-ins
// do only what the components rely on; real-browser behavior (layout,
// scrolling, gestures, full screen) is covered by browser tests instead.

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = '';
});

// <dialog>: open and close, firing the close event like a browser does
HTMLDialogElement.prototype.showModal = function showModal() {
  this.setAttribute('open', '');
};
HTMLDialogElement.prototype.close = function close() {
  if (!this.open) return;
  this.removeAttribute('open');
  this.dispatchEvent(new Event('close'));
};

// Scrolling: jump straight to the target and fire a scroll event
Element.prototype.scrollTo = function scrollTo(
  this: Element,
  options?: ScrollToOptions | number,
) {
  if (typeof options === 'object' && options.left !== undefined) {
    this.scrollLeft = options.left;
  }
  this.dispatchEvent(new Event('scroll'));
} as Element['scrollTo'];
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;

// The photo strip needs a width so scroll position maps to a photo
const SCROLLER_WIDTH = 1000;
Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  get() {
    return this.classList.contains('photo-viewer__scroller')
      ? SCROLLER_WIDTH
      : 0;
  },
});

window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

window.matchMedia = (query: string) =>
  ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList;
