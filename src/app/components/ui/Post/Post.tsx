import { ReactNode } from 'react';
import './Post.scss';

interface PostProps {
	children: ReactNode;
}

export function Post({ children }: PostProps) {
	return <article className="post prose">{children}</article>;
}
