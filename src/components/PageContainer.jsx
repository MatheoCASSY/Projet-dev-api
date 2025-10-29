import React from 'react';
import BackButton from './BackButton';

export default function PageContainer({ children, showBack = false, onBack }) {
	return (
		<div className="container my-4">
			<div className="mb-3">
				<BackButton forceShow={showBack} onBack={onBack} />
			</div>
			{children}
		</div>
	);
}
