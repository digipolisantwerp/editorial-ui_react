import { PropTypes } from 'prop-types';
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DndContainer = ({ draggable, children }) => {
	if (!draggable) {
		return children;
	}

	return (
		<DndProvider backend={HTML5Backend}>
			{children}
		</DndProvider>
	);
};

DndContainer.propTypes = {
	draggable: PropTypes.bool,
	children: PropTypes.node,
};

export default DndContainer;
