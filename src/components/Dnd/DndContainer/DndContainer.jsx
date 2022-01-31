import { PropTypes } from 'prop-types';
import React, { useRef } from 'react';
import { createDndContext, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const DNDContext = createDndContext(HTML5Backend);

/**
 * @typedef {object} DndContainerProp
 * @prop {boolean} [draggable]
 * @prop {React.ReactNode[] | React.ReactNode} [children]
 */

/** @param {DndContainerProp} props */
const DndContainer = ({ draggable, children }) => {
	const manager = useRef(DNDContext);

	if (!draggable) {
		return children;
	}

	return (
		<DndProvider manager={manager.current.dragDropManager}>
			{children}
		</DndProvider>
	);
};

DndContainer.propTypes = {
	draggable: PropTypes.bool,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]),
};

export default DndContainer;
