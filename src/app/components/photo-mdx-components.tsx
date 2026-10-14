import type { ComponentProps } from 'react';
import { mdxComponents, MdxImage } from './mdx-components';
import { PhotoGridItem } from './ui/PhotoGrid/PhotoGrid';
import { PhotoViewerTrigger } from './ui/PhotoViewer/PhotoViewerTrigger';

// Photo essays only: every photo opens the full-screen photo viewer.
// Kept separate so blog posts don't load the viewer's code.
export const photoMdxComponents = {
  ...mdxComponents,
  PhotoGridItem: (props: ComponentProps<typeof PhotoGridItem>) => (
    <PhotoGridItem {...props} Wrapper={PhotoViewerTrigger} />
  ),
  Image: (props: ComponentProps<typeof MdxImage>) => (
    <MdxImage {...props} Wrapper={PhotoViewerTrigger} />
  ),
};
