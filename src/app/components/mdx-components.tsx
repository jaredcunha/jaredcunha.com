import {
  PhotoGrid,
  PhotoGridItem,
  PlainPhoto,
  type PhotoWrapperProps,
} from './ui/PhotoGrid/PhotoGrid';
import Intro from './Intro';
import { AccessibleLink } from './ui/Link/Link';
import { Image } from './ui/Image/Image';
import { Prompt } from './ui/Prompt/Prompt';
import type { ComponentType } from 'react';

interface MdxImageProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  Wrapper?: ComponentType<PhotoWrapperProps>;
}

export function MdxImage({
  src,
  alt,
  caption,
  className,
  width,
  height,
  sizes,
  Wrapper = PlainPhoto,
}: MdxImageProps) {
  const sizesProp =
    sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1600px';
  return (
    <figure className={className}>
      <Wrapper src={src} alt={alt} caption={caption}>
        <Image
          src={src}
          alt={alt}
          sizes={sizesProp}
          width={width || 1200}
          {...(height && { height })}
          className="mdx-image"
          loading="lazy"
          quality={40}
          style={{
            width: '100%',
            height: 'auto', // Preserve aspect ratio
          }}
          useBlurPlaceholder={true} // Enable blur placeholder by default
        />
      </Wrapper>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export const mdxComponents = {
  Link: AccessibleLink,
  PhotoGrid,
  PhotoGridItem,
  Prompt,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Intro: (props: any) => {
    // If children is a single <p>, unwrap its children
    const { children, ...rest } = props;
    if (
      typeof children === 'object' &&
      children?.type === 'p' &&
      children?.props?.children
    ) {
      return <Intro {...rest}>{children.props.children}</Intro>;
    }
    return <Intro {...props} />;
  },
  Image: MdxImage,
};
