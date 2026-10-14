import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PhotoViewerProvider } from './PhotoViewerProvider';
import { PhotoViewerTrigger } from './PhotoViewerTrigger';

interface TestPhoto {
  src: string;
  alt: string;
  caption?: string;
}

const photos: TestPhoto[] = [
  {
    src: '/images/spain/street.jpg',
    alt: 'A cobblestone street at sunset',
    caption: 'Granada at sunset',
  },
  { src: '/images/spain/courtyard.jpg', alt: 'A courtyard with poinsettias' },
  {
    src: '/images/spain/route.gif',
    alt: 'An animated map of the route',
    caption: 'The route',
  },
];

function PhotoEssay({ items = photos }: { items?: TestPhoto[] }) {
  return (
    <PhotoViewerProvider>
      {items.map((p) => (
        <PhotoViewerTrigger
          key={p.src}
          src={p.src}
          alt={p.alt}
          caption={p.caption}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt={p.alt} />
        </PhotoViewerTrigger>
      ))}
    </PhotoViewerProvider>
  );
}

async function openPhoto(
  user: ReturnType<typeof userEvent.setup>,
  n: number,
  total = photos.length,
) {
  await user.click(
    await screen.findByRole('button', { name: `Open photo ${n} of ${total}` }),
  );
  return screen.findByRole('dialog', { name: 'Photo viewer' });
}

describe('PhotoViewerTrigger', () => {
  it('labels each photo with its position and describes it with the alt text', async () => {
    render(<PhotoEssay />);

    const first = await screen.findByRole('button', {
      name: 'Open photo 1 of 3',
    });
    expect(first).toHaveAccessibleDescription(photos[0].alt);
    expect(
      screen.getByRole('button', { name: 'Open photo 3 of 3' }),
    ).toHaveAccessibleDescription(photos[2].alt);
  });

  it('keeps page order when a photo is added earlier on the page', async () => {
    const { rerender } = render(<PhotoEssay />);
    await screen.findByRole('button', { name: 'Open photo 1 of 3' });

    const added = { src: '/images/spain/new.jpg', alt: 'A new first photo' };
    rerender(<PhotoEssay items={[added, ...photos]} />);

    expect(
      await screen.findByRole('button', { name: 'Open photo 1 of 4' }),
    ).toHaveAccessibleDescription(added.alt);
    expect(
      screen.getByRole('button', { name: 'Open photo 2 of 4' }),
    ).toHaveAccessibleDescription(photos[0].alt);
  });

  it('renders the photo unchanged outside a photo essay', () => {
    render(
      <PhotoViewerTrigger src={photos[0].src} alt={photos[0].alt}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photos[0].src} alt={photos[0].alt} />
      </PhotoViewerTrigger>,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: photos[0].alt }),
    ).toBeInTheDocument();
  });
});

describe('PhotoViewer', () => {
  it('opens on the photo that was clicked and moves focus into the viewer', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);

    const dialog = await openPhoto(user, 2);

    expect(within(dialog).getByText('2 of 3')).toBeInTheDocument();
    expect(
      within(dialog).getByRole('img', { name: photos[1].alt }),
    ).toBeInTheDocument();
    expect(dialog).toHaveFocus();
  });

  it('locks page scrolling while open', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);

    const dialog = await openPhoto(user, 1);
    expect(document.documentElement.style.overflow).toBe('hidden');

    await user.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(document.documentElement.style.overflow).toBe('');
  });

  it('moves with the arrow keys, Home, and End without looping', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);
    const dialog = await openPhoto(user, 2);

    await user.keyboard('{ArrowRight}');
    expect(within(dialog).getByText('3 of 3')).toBeInTheDocument();
    await user.keyboard('{ArrowRight}');
    expect(within(dialog).getByText('3 of 3')).toBeInTheDocument();

    await user.keyboard('{Home}');
    expect(within(dialog).getByText('1 of 3')).toBeInTheDocument();
    await user.keyboard('{ArrowLeft}');
    expect(within(dialog).getByText('1 of 3')).toBeInTheDocument();

    await user.keyboard('{End}');
    expect(within(dialog).getByText('3 of 3')).toBeInTheDocument();
  });

  it('has no previous button on the first photo and no next button on the last', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);
    const dialog = await openPhoto(user, 1);

    expect(
      within(dialog).queryByRole('button', { name: 'Previous photo' }),
    ).not.toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: 'Next photo' }),
    ).toBeInTheDocument();

    await user.keyboard('{End}');
    expect(
      within(dialog).getByRole('button', { name: 'Previous photo' }),
    ).toBeInTheDocument();
    expect(
      within(dialog).queryByRole('button', { name: 'Next photo' }),
    ).not.toBeInTheDocument();
  });

  it('moves focus to the previous button when the next button disappears', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);
    const dialog = await openPhoto(user, 2);

    await user.click(
      within(dialog).getByRole('button', { name: 'Next photo' }),
    );

    expect(within(dialog).getByText('3 of 3')).toBeInTheDocument();
    expect(
      within(dialog).getByRole('button', { name: 'Previous photo' }),
    ).toHaveFocus();
  });

  it('announces the position and description of each photo', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);
    const dialog = await openPhoto(user, 1);

    expect(
      await within(dialog).findByText(`Photo 1 of 3. ${photos[0].alt}`),
    ).toBeInTheDocument();

    await user.keyboard('{ArrowRight}');
    expect(
      await within(dialog).findByText(`Photo 2 of 3. ${photos[1].alt}`),
    ).toBeInTheDocument();
  });

  it('returns focus to the photo that was clicked, even after moving through photos', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);
    const dialog = await openPhoto(user, 1);

    await user.keyboard('{ArrowRight}{ArrowRight}');
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));

    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(
      screen.getByRole('button', { name: 'Open photo 1 of 3' }),
    ).toHaveFocus();
  });

  it('shows the caption and lets the reader hide and show it', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);
    const dialog = await openPhoto(user, 1);

    const caption = within(dialog).getByText('Granada at sunset');
    const hide = within(dialog).getByRole('button', { name: 'Hide caption' });
    expect(caption).toBeVisible();
    expect(hide).toHaveAttribute('aria-expanded', 'true');

    await user.click(hide);
    const show = within(dialog).getByRole('button', { name: 'Show caption' });
    expect(show).toHaveAttribute('aria-expanded', 'false');
    expect(within(dialog).getByText('Granada at sunset')).not.toBeVisible();

    await user.click(show);
    expect(within(dialog).getByText('Granada at sunset')).toBeVisible();
  });

  it('renders no caption markup for photos without a caption', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);
    const dialog = await openPhoto(user, 2);

    expect(
      within(dialog).queryByRole('button', { name: /caption/ }),
    ).not.toBeInTheDocument();
    expect(dialog.querySelector('.photo-viewer__caption-bar')).toBeNull();
  });

  it('remembers a hidden caption when reopened, without browser storage', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);
    let dialog = await openPhoto(user, 1);

    await user.click(
      within(dialog).getByRole('button', { name: 'Hide caption' }),
    );
    await user.click(within(dialog).getByRole('button', { name: 'Close' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );

    dialog = await openPhoto(user, 1);
    expect(
      within(dialog).getByRole('button', { name: 'Show caption' }),
    ).toBeInTheDocument();
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
    expect(document.cookie).toBe('');
  });

  it('requests a screen-sized image from Cloudinary, keeping GIFs animated', async () => {
    const user = userEvent.setup();
    render(<PhotoEssay />);
    const dialog = await openPhoto(user, 1);

    // jsdom's window is 1024px wide at 1x, rounded up to the next 400px step
    expect(
      within(dialog).getByRole('img', { name: photos[0].alt }),
    ).toHaveAttribute(
      'src',
      'https://res.cloudinary.com/test-cloud/image/upload/w_1200,q_80,c_limit,f_auto/spain/street',
    );

    await user.keyboard('{End}');
    const gif = within(dialog).getByRole('img', { name: photos[2].alt });
    expect(gif.getAttribute('src')).toContain('f_gif');
  });

  it('loads neighboring photos only after the current photo has loaded', async () => {
    const user = userEvent.setup();
    const five = [1, 2, 3, 4, 5].map((n) => ({
      src: `/images/spain/photo-${n}.jpg`,
      alt: `Photo number ${n}`,
    }));
    render(<PhotoEssay items={five} />);
    const dialog = await openPhoto(user, 3, 5);

    const loadedSlides = () =>
      [...dialog.querySelectorAll('.photo-viewer__slide')].map(
        (slide) => slide.querySelector('.photo-viewer__img--full') !== null,
      );

    expect(loadedSlides()).toEqual([false, false, true, false, false]);

    fireEvent.load(within(dialog).getByRole('img', { name: 'Photo number 3' }));
    expect(loadedSlides()).toEqual([false, true, true, true, false]);
  });

  describe('full screen', () => {
    afterEach(() => {
      Reflect.deleteProperty(document, 'fullscreenEnabled');
      Reflect.deleteProperty(document, 'fullscreenElement');
      Reflect.deleteProperty(HTMLElement.prototype, 'requestFullscreen');
      Reflect.deleteProperty(document, 'exitFullscreen');
    });

    it('is offered where the browser supports it, and toggles', async () => {
      let fullscreenElement: Element | null = null;
      Object.defineProperty(document, 'fullscreenEnabled', {
        configurable: true,
        value: true,
      });
      Object.defineProperty(document, 'fullscreenElement', {
        configurable: true,
        get: () => fullscreenElement,
      });
      HTMLElement.prototype.requestFullscreen = vi.fn(function (
        this: HTMLElement,
      ) {
        fullscreenElement = this;
        document.dispatchEvent(new Event('fullscreenchange'));
        return Promise.resolve();
      });
      document.exitFullscreen = vi.fn(() => {
        fullscreenElement = null;
        document.dispatchEvent(new Event('fullscreenchange'));
        return Promise.resolve();
      });

      const user = userEvent.setup();
      render(<PhotoEssay />);
      const dialog = await openPhoto(user, 1);

      await user.click(
        within(dialog).getByRole('button', { name: 'Full screen' }),
      );
      expect(fullscreenElement).toHaveClass('photo-viewer__inner');

      await user.click(
        within(dialog).getByRole('button', { name: 'Exit full screen' }),
      );
      expect(fullscreenElement).toBeNull();
      expect(
        within(dialog).getByRole('button', { name: 'Full screen' }),
      ).toBeInTheDocument();
    });

    it('is not offered where the browser does not support it, such as iPhone', async () => {
      const user = userEvent.setup();
      render(<PhotoEssay />);
      const dialog = await openPhoto(user, 1);

      expect(
        within(dialog).queryByRole('button', { name: 'Full screen' }),
      ).not.toBeInTheDocument();
    });
  });
});
