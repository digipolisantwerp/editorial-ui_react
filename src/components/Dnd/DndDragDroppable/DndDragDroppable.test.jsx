import { render, waitFor } from '@testing-library/react';
import { clone } from 'ramda';
import React, { useState } from 'react';

import { dragAndDrop, dragAndHold } from '../Dnd.helpers';
import DndContainer from '../DndContainer/DndContainer';

import DndDragDroppable from './DndDragDroppable';

const initialItems = [{ label: 'item 1' }, { label: 'item 2' }, { label: 'item 3' }];

const DragDroppableList = () => {
	const [items, setItems] = useState(clone(initialItems));
	const moveRow = (source, target) => {
		if (source.index === target.index) {
			return;
		}

		const sourceItem = items[source.index];
		const newItems = [...items];
		newItems.splice(source.index, 1);
		newItems.splice(target.index, 0, sourceItem);
		setItems(newItems);
	};

	return (
		<DndContainer draggable>
			<ul>
				{items.map((i, index) => (
					<DndDragDroppable
						key={`list-${index}`}
						accept={['list']}
						id={index}
						index={index}
						moveRow={moveRow}
					>
						{({ dragDropRef, isDragging }) => (
							<li ref={dragDropRef} className={isDragging ? 'dragging' : ''}>
								{i.label}
							</li>
						)}
					</DndDragDroppable>
				))}
			</ul>
		</DndContainer>
	);
};

describe('<DndDragDroppable />', () => {
	it('Should be able to drag', async () => {
		const { queryAllByText } = render(<DragDroppableList />);
		const listElements = queryAllByText(/^item/);
		const lastIndex = listElements.length - 1;

		// Move first item to last
		const firstEl = listElements[0];
		const lastEl = listElements[lastIndex];

		dragAndHold(firstEl, lastEl);

		await waitFor(() => {
			const reorderedItems = queryAllByText(/^item/);
			expect(reorderedItems[0]).toHaveClass('dragging');
		});
	});

	it('Should be able to drag and drop', async () => {
		const { queryAllByText } = render(<DragDroppableList />);
		const listElements = queryAllByText(/^item/);
		const lastIndex = listElements.length - 1;

		// Move first item to last
		const firstEl = listElements[0];
		const lastEl = listElements[lastIndex];

		dragAndDrop(firstEl, lastEl);

		await waitFor(() => {
			const reorderedItems = queryAllByText(/^item/);

			expect(reorderedItems[0].innerHTML).toEqual('item 2');
			expect(reorderedItems[1].innerHTML).toEqual('item 3');
			expect(reorderedItems[2].innerHTML).toEqual('item 1');
		});
	});
});
