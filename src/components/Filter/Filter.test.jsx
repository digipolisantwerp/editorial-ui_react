import { TextField } from '@redactie/react-components';
import { fireEvent, getNodeText, render } from '@testing-library/react';
import React from 'react';

import Filter from './Filter';
import { FilterBody } from './Filter.slots';

const noop = () => {};

const filterItems = [
	{
		valuePrefix: 'Search',
		value: 'search term',
		key: 'search',
	},
	{
		valuePrefix: 'User',
		value: 'John Doe',
		key: 'user',
	}];

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

		const tagElValuePrefix = container.querySelector('.m-tag__label-prefix');
		const tagElValue = container.querySelector('.m-tag__label');

		expect(tagElValuePrefix).toBeDefined();
		expect(tagElValue).toBeDefined();
		expect(getNodeText(tagElValuePrefix)).toBe(`${filterItems[0].valuePrefix}: `);
		expect(getNodeText(tagElValue)).toBe(filterItems[0].value);
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

	it('Should pass `actionsClassName` when given', () => {
		const actionsClassName = 'm-custom-filter-actions';
		const { container } = render(
			<Filter actionsClassName={actionsClassName} title="Filter" />,
		);
		const actionsEl = container.querySelector('.o-filter__form__buttons');

		expect(actionsEl.classList.contains(actionsClassName)).toBeTruthy();
	});
});
