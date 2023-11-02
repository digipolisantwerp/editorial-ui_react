import { act, fireEvent } from '@testing-library/react';

/**
 * Test helpers
 */

export const dragAndHold = (dragEl, dropEl) => {
	act(() => {
		fireEvent.dragStart(dragEl);
		fireEvent.dragEnter(dropEl);
		fireEvent.dragOver(dropEl);
	});
};

export const dragAndDrop = (dragEl, dropEl) => {
	act(() => {
		fireEvent.dragStart(dragEl);
		fireEvent.dragEnter(dropEl);
		fireEvent.dragOver(dropEl);
		fireEvent.drop(dropEl);
		fireEvent.dragLeave(dropEl);
		fireEvent.dragEnd(dragEl);
	});
};
