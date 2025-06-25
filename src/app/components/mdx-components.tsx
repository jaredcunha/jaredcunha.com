import { PhotoGrid, PhotoGridItem } from './ui/PhotoGrid/PhotoGrid';
import Intro from './Intro';
import BlurImage from './ui/BlurImage/BlurImage';

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
  Image: BlurImage,
};
