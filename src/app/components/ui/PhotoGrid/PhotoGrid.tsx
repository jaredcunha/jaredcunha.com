import React, { ReactNode } from 'react';
import './PhotoGrid.scss';

interface PhotoGridProps {
	children: ReactNode;
	caption?: string;
}

export function PhotoGrid({ children, caption }: PhotoGridProps) {
	return (
		<>
			<div className="photo-grid">{children}</div>
			{caption && <p className="photo-grid__caption">{caption}</p>}
		</>
	);
}

interface PhotoGridItemProps {
	children: ReactNode;
	cols: 4 | 6 | 8 | 12;
}

export function PhotoGridItem({ children, cols }: PhotoGridItemProps) {
	return (
		<div className={`photo-grid__item photo-grid__item--cols-${cols}`}>
			{children}
		</div>
	);
}
