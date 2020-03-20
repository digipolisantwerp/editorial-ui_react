import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import { TABLE_MOCK_ROWS } from '../Table/Table.mock';

import PaginatedTable from './PaginatedTable';

describe('<PaginatedTable />', () => {
	it('Should not show pagination if no data is given', () => {
		const { container } = render(<PaginatedTable rows={[]} itemsPerPage={3} totalValues={0} />);
		const paginationEl = container.querySelector('.o-paginated-table__pagination');

		expect(paginationEl).toBeNull();
	});

	it('Should show the correct number of pages', () => {
		const { container } = render(
			<PaginatedTable
				rows={TABLE_MOCK_ROWS}
				itemsPerPage={3}
				totalValues={TABLE_MOCK_ROWS.length}
			/>,
		);
		const pagesEl = container.querySelectorAll('.m-pagination li:not(.pagination-button)');

		expect(pagesEl).toHaveLength(Math.ceil(TABLE_MOCK_ROWS.length / 3));
	});

	it('Should trigger click when navigating pagination', () => {
		const clickFn = jest.fn();
		const currentPage = 1;
		const { container } = render(
			<PaginatedTable
				rows={TABLE_MOCK_ROWS}
				currentPage={currentPage}
				itemsPerPage={3}
				onPageChange={clickFn}
				totalValues={TABLE_MOCK_ROWS.length}
			/>,
		);

		const nextEl = container.querySelector('.m-pagination__next a');
		const prevEl = container.querySelector('.m-pagination__prev a');
		const pagesEl = container.querySelectorAll('.m-pagination li:not(.pagination-button) a');

		// Current page is 1 so previous button click is disabled
		fireEvent.click(prevEl);
		expect(clickFn).not.toHaveBeenCalled();

		fireEvent.click(nextEl);
		expect(clickFn).toHaveBeenCalledWith(currentPage + 1);

		fireEvent.click(pagesEl[1]);
		expect(clickFn).toHaveBeenCalledWith(2);
	});
});
