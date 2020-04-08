import {
	Accordion, AccordionTab, AccordionTabContent, AccordionTabHeader, Button, TagList, TagListItem,
} from '@acpaas-ui/react-components';
import PropTypes from 'prop-types';
import React from 'react';

import { useSlot } from '../../hooks/useSlot';

import './Filter.scss';
import { FilterBody } from './Filter.slots';

const Filter = ({
	className,
	title,
	children,
	noFilterText,
	onConfirm,
	confirmText,
	onClean,
	cleanText,
	activeFilters = [],
	onFilterRemove,
}) => {
	const filterSlot = useSlot(FilterBody, children);

	// Prevent accordion from closing when the
	// user interacts with the filters inside the AccordionTabContent
	const preventClosingAccordion = (e) => {
		e.stopPropagation();
	};

	return (
		<div className={className}>
			<div className="u-container">
				<Accordion>
					<AccordionTab>
						<AccordionTabHeader><h3 className="u-text-primary">{title}</h3></AccordionTabHeader>
						<AccordionTabContent className="m-filter-form">
							<div
								className="m-filter-form__row row"
								role="button"
								tabIndex="0"
								onClick={preventClosingAccordion}
								onKeyPress={preventClosingAccordion}
							>
								{filterSlot ? (
									<>{ filterSlot }</>
								) : (
									<p className="m-filter-form__text">{noFilterText}</p>
								)}
								<div className="m-filter-form__buttons">
									<Button type="primary" onClick={onClean} negative>{cleanText}</Button>
									<Button type="primary" iconRight="angle-right" onClick={onConfirm} outline>{confirmText}</Button>
								</div>
							</div>
						</AccordionTabContent>
					</AccordionTab>
				</Accordion>
				{ activeFilters.length > 0 ? (
					<div className="u-margin-top">
						<TagList>
							{activeFilters.map((filter) => (
								<TagListItem
									value={filter.value}
									key={filter.label}
									closable
									onClick={onFilterRemove}
								/>
							))}
						</TagList>
					</div>
				) : (
					null
				)}
			</div>
		</div>
	);
};

Filter.propTypes = {
	className: PropTypes.string,
	title: PropTypes.string,
	noFilterText: PropTypes.string,
	onConfirm: PropTypes.func,
	confirmText: PropTypes.string,
	onClean: PropTypes.func,
	cleanText: PropTypes.string,
	activeFilters: PropTypes.arrayOf(PropTypes.shape({
		label: PropTypes.string,
		value: PropTypes.string,
	})),
	onFilterRemove: PropTypes.func,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]),
};

export default Filter;