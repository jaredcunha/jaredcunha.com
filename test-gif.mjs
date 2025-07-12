import { getContentImageUrlWithGifSupport } from './src/app/utils/image-cdn.ts';

// Mock the environment variable for testing
process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = 'dmd1dg6qw';

console.log('Testing GIF URL generation:');

// Test GIF file
const gifUrl = getContentImageUrlWithGifSupport(
  '/images/all-screens-scrolling.gif',
  1200,
  92
);
console.log('GIF URL:', gifUrl);

// Test regular image
const jpgUrl = getContentImageUrlWithGifSupport(
  '/images/all-screens.png',
  1200,
  92
);
console.log('PNG URL:', jpgUrl);

console.log('\nExpected behavior:');
console.log('- GIF should have f_gif to preserve animation');
console.log('- PNG should have f_auto for optimization');
