import { PhotoGrid, PhotoGridItem } from './ui/PhotoGrid/PhotoGrid';
import Intro from './Intro';
import { AccessibleLink } from './ui/Link/Link';
import { Image } from './ui/Image/Image';

export const mdxComponents = {
  Link: AccessibleLink,
  PhotoGrid,
  PhotoGridItem,
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
  Image: ({
    src,
    alt,
    caption,
    className,
    width,
    height,
  }: {
    src: string;
    alt: string;
    caption?: string;
    className?: string;
    width?: number;
    height?: number;
  }) => {
    return (
      <figure className={className}>
        <Image
          src={src}
          alt={alt}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1600px"
          width={width || 1200}
          {...(height && { height })}
          className="mdx-image"
          loading="lazy"
          quality={40}
          style={{
            width: '100%',
            height: 'auto', // Preserve aspect ratio
          }}
        />
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    );
  },
};
