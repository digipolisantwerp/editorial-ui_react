import { TextField } from '@acpaas-ui/react-components';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import Filter from './Filter';
import { FilterBody } from './Filter.slots';

const noop = () => {};

const filterItems = [{ label: 'lorem', value: 'Lorem' }, { label: 'ipsum', value: 'Ipsum' }];

const renderFilterInput = () => render((
	<Filter title="Filter" onConfirm={noop} onClear={noop} onFilterRemove={noop}>
		<FilterBody>
			<div className="col-xs-8">
				<TextField
					label="Zoeken"
					id="Zoeken"
					name="Zoeken"
					className="textfield-class"
					placeholder="Zoeken op naam"
					onChange={noop}
					iconright="search"
				/>
			</div>
		</FilterBody>
	</Filter>
));

describe('<Filter />', () => {
	it('Should display default text', () => {
		const { findByText } = render(
			<Filter title="Filter" onConfirm={noop} onClean={noop} onFilterRemove={noop} />,
		);
		const textEl = findByText('Geen filters beschikbaar');

		expect(textEl).not.toBeNull();
	});

	it('Should display filters', () => {
		const { findByLabelText } = renderFilterInput();
		const labelEl = findByLabelText('Zoeken');

		expect(labelEl).toBeDefined();
	});

	it('Should display filter items', () => {
		const { container } = render(
			<Filter
				title="Filter"
				onConfirm={noop}
				onClean={noop}
				activeFilters={filterItems}
				onFilterRemove={noop}
			/>,
		);
		const tagEl = container.querySelector('.m-tag');

		expect(tagEl).toBeDefined();
	});

	it('Should click a single filter item', () => {
		const deleteFilter = jest.fn();
		const { container } = render(
			<Filter
				title="Filter"
				onConfirm={noop}
				onClean={noop}
				activeFilters={filterItems}
				onFilterRemove={deleteFilter}
			/>,
		);

		fireEvent.click(container.querySelectorAll('.m-tag .a-button')[1]);

		expect(deleteFilter).toHaveBeenCalledTimes(1);
		expect(deleteFilter).toHaveBeenCalledWith(filterItems[1]);
	});
});
