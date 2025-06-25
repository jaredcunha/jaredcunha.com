import Image from 'next/image';
import { PhotoGrid, PhotoGridItem } from './ui/PhotoGrid/PhotoGrid';
import Intro from './Intro';

export const mdxComponents = {
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
  }: {
    src: string;
    alt: string;
    caption?: string;
  }) => (
    <figure>
      <Image
        src={src}
        alt={alt}
        sizes="100vw"
        width={500}
        height={500}
        className="mdx-image"
        loading="lazy"
        placeholder="blur"
        blurDataURL={src}
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  ),
};
