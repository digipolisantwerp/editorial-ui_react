import { render, waitFor } from '@testing-library/react';
import React, { useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { dragAndDrop } from '../Dnd.helpers';

import DndContainer from './DndContainer';

const dragTestId = 'drag';
const dropTestId = 'drop';
const childrenTestId = 'children';

const DraggableComponent = () => {
	const [, dragRef] = useDrag({ item: { id: 1 }, type: 'item' });
	return <div data-testid={dragTestId} ref={dragRef}>Drag me</div>;
};
const DropTarget = () => {
	const [label, setLabel] = useState('Drop target');
	const [, dropRef] = useDrop({
		accept: 'item',
		drop: (item) => {
			if (item) {
				setLabel('Dropped');
			}
		},
	});
	return <div data-testid={dropTestId} ref={dropRef}>{label}</div>;
};

const renderDndContainer = ({ draggable = true } = {}) => render(
	<DndContainer draggable={draggable}>
		{draggable && (
			<>
				<DraggableComponent />
				<DropTarget />
			</>
		)}
		<span data-testid={childrenTestId} />
	</DndContainer>,
);

describe('<DndContainer />', () => {
	it('Should use DndProvider when `draggable` is true', async () => {
		const { queryByTestId } = renderDndContainer();
		const dragEl = queryByTestId(dragTestId);
		const dropEl = queryByTestId(dropTestId);

		dragAndDrop(dragEl, dropEl);

		await waitFor(() => {
			expect(queryByTestId(dropTestId).textContent).toBe('Dropped');
		});
	});

	it('Should not use DndProvider when `draggable` is false', async () => {
		const { queryByTestId } = renderDndContainer({ draggable: false });

		await waitFor(() => {
			const dragEl = queryByTestId(dragTestId);
			const dropEl = queryByTestId(dropTestId);
			const childrenEl = queryByTestId(childrenTestId);

			expect(dropEl).toBeNull();
			expect(dragEl).toBeNull();
			expect(childrenEl).not.toBeNull();
		});
	});

	it('Should render children', async() => {
		const { queryByTestId } = renderDndContainer();

		await waitFor(() => {
			const dragEl = queryByTestId(dragTestId);
			const dropEl = queryByTestId(dropTestId);

			expect(dragEl).not.toBeNull();
			expect(dropEl).not.toBeNull();
		});
	});
});
