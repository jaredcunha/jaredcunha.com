import { describe, expect, it } from 'vitest';
import {
  getContentImageUrlWithGifSupport,
  getOptimizedImageUrl,
  getShareImageUrl,
} from './image-cdn';

const base = 'https://res.cloudinary.com/test-cloud/image/upload';

describe('getOptimizedImageUrl', () => {
  it('turns a local image path into a Cloudinary URL', () => {
    expect(
      getOptimizedImageUrl('/images/rome-2025/appian1.jpg', { width: 800 }),
    ).toBe(`${base}/w_800,q_90,f_auto/rome-2025/appian1`);
  });

  it('leaves full URLs alone', () => {
    const url = 'https://example.com/photo.jpg';
    expect(getOptimizedImageUrl(url, { width: 800 })).toBe(url);
  });

  it('supports limiting size without upscaling', () => {
    expect(
      getOptimizedImageUrl('/images/a.jpg', {
        width: 2400,
        quality: 80,
        crop: 'limit',
      }),
    ).toBe(`${base}/w_2400,q_80,c_limit,f_auto/a`);
  });
});

describe('getShareImageUrl', () => {
  it('crops share images to 1200x630 JPG', () => {
    expect(getShareImageUrl('/images/share-card-generic.png')).toBe(
      `${base}/w_1200,h_630,f_jpg,c_fill,q_90/share-card-generic`,
    );
  });
});

describe('getContentImageUrlWithGifSupport', () => {
  it('keeps GIFs as GIFs and caps their width', () => {
    const url = getContentImageUrlWithGifSupport('/images/screens.gif', 2400);
    expect(url).toContain('f_gif');
    expect(url).toContain('w_1200');
  });

  it('uses automatic format for other images', () => {
    expect(
      getContentImageUrlWithGifSupport('/images/photo.jpg', 1600),
    ).toContain('w_1600,q_90,f_auto,c_scale');
  });
});
