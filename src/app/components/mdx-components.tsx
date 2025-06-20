import Image from 'next/image';
import { PhotoGrid, PhotoGridItem } from './ui/PhotoGrid/PhotoGrid';

export const mdxComponents = {
	PhotoGrid,
	PhotoGridItem,
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
				blurDataURL={src} // Assuming src is a valid data URL or path
			/>
			{caption && <figcaption>{caption}</figcaption>}
		</figure>
	),
};
