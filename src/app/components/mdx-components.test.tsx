/* eslint-disable @next/next/no-img-element -- test stand-in for the Cloudinary image */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MdxImage } from './mdx-components';
import { photoMdxComponents } from './photo-mdx-components';
import { PhotoViewerProvider } from './ui/PhotoViewer/PhotoViewerProvider';

// The real Image loads from Cloudinary through next-cloudinary
vi.mock('./ui/Image/Image', () => ({
  Image: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

const photo = {
  src: '/images/iceland/basalt.jpg',
  alt: 'Hexagonal basalt columns on a black sand beach',
  caption: 'Basalt columns at Reynisfjara',
};

describe('MdxImage', () => {
  it('renders the photo with its caption, and no viewer button, in blog posts', () => {
    render(<MdxImage {...photo} />);

    expect(screen.getByRole('img', { name: photo.alt })).toBeInTheDocument();
    expect(screen.getByText(photo.caption).tagName).toBe('FIGCAPTION');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

describe('photoMdxComponents', () => {
  it('makes individual images open the viewer, keeping the caption on the page', async () => {
    const PhotoImage = photoMdxComponents.Image;
    render(
      <PhotoViewerProvider>
        <PhotoImage {...photo} />
      </PhotoViewerProvider>,
    );

    expect(
      await screen.findByRole('button', { name: 'Open photo 1 of 1' }),
    ).toHaveAccessibleDescription(photo.alt);
    expect(screen.getByText(photo.caption).tagName).toBe('FIGCAPTION');
  });

  it('makes grid photos open the viewer', async () => {
    const PhotoGridItem = photoMdxComponents.PhotoGridItem;
    render(
      <PhotoViewerProvider>
        <PhotoGridItem cols="6" src={photo.src} alt={photo.alt} />
      </PhotoViewerProvider>,
    );

    expect(
      await screen.findByRole('button', { name: 'Open photo 1 of 1' }),
    ).toBeInTheDocument();
  });
});
