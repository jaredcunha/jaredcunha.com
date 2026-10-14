/* eslint-disable @next/next/no-img-element -- test stand-in for the Cloudinary image */
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PhotoGridItem } from './PhotoGrid';
import { PhotoViewerProvider } from '../PhotoViewer/PhotoViewerProvider';
import { PhotoViewerTrigger } from '../PhotoViewer/PhotoViewerTrigger';

// The real Image loads from Cloudinary through next-cloudinary
vi.mock('../Image/Image', () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

const photo = {
  src: '/images/spain/alhambra.jpg',
  alt: 'Carved plaster arches at the Alhambra',
  caption: 'Inside the Nasrid Palaces',
};

describe('PhotoGridItem', () => {
  it('never renders its caption on the page', () => {
    render(<PhotoGridItem cols="6" {...photo} />);

    expect(screen.getByRole('img', { name: photo.alt })).toBeInTheDocument();
    expect(screen.queryByText(photo.caption)).not.toBeInTheDocument();
  });

  it('renders a plain photo, not a button, by default', () => {
    render(<PhotoGridItem cols="6" {...photo} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('shows its caption only in the photo viewer', async () => {
    const user = userEvent.setup();
    render(
      <PhotoViewerProvider>
        <PhotoGridItem cols="6" {...photo} Wrapper={PhotoViewerTrigger} />
      </PhotoViewerProvider>,
    );

    expect(screen.queryByText(photo.caption)).not.toBeInTheDocument();

    await user.click(
      await screen.findByRole('button', { name: 'Open photo 1 of 1' }),
    );
    const dialog = await screen.findByRole('dialog', { name: 'Photo viewer' });
    expect(within(dialog).getByText(photo.caption)).toBeVisible();
  });
});
