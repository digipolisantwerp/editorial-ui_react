import {
	Accordion, AccordionTab, AccordionTabContent, AccordionTabHeader, Button, TagList, TagListItem,
} from '@redactie/react-components';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { useSlot } from '../../hooks/useSlot';

import './Filter.scss';
import { FilterBody } from './Filter.slots';

const Filter = ({
	actionsClassName,
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
	enableSubmitOnEnter = true,
}) => {
	const filterSlot = useSlot(FilterBody, children);

	// Prevent accordion from closing when the
	// user interacts with the filters inside the AccordionTabContent
	const preventClosingAccordion = (e) => {
		e.stopPropagation();
	};

	return (
		<div className={classnames(className, 'o-filter')}>
			<Accordion>
				<AccordionTab>
					<AccordionTabHeader>
						<h5 className="u-text-primary">{title}</h5>
					</AccordionTabHeader>
					<AccordionTabContent>
						<div
							className="o-filter__form__row row"
							role="button"
							tabIndex="0"
							onClick={preventClosingAccordion}
							onKeyPress={preventClosingAccordion}
						>
							{filterSlot || (
								<p className="o-filter__form__text col-xs-12 col-sm">
									{noFilterText}
								</p>
							)}
							<div className={classnames(actionsClassName, 'o-filter__form__buttons')}>
								<Button
									htmlType="button"
									type="primary"
									onClick={onClean}
									negative
								>
									{cleanText}
								</Button>
								<Button
									htmlType={enableSubmitOnEnter ? 'submit' : 'button'}
									type="primary"
									iconRight="angle-right"
									onClick={onConfirm}
									outline
								>
									{confirmText}
								</Button>
							</div>
						</div>
					</AccordionTabContent>
				</AccordionTab>
			</Accordion>
			{ activeFilters.length > 0 ? (
				<div className="u-margin-top">
					<TagList>
						{activeFilters.map((filter, index) => (
							<TagListItem
								value={filter.valuePrefix ? (
									<>
										<span className="m-tag__label-prefix">
											{`${filter.valuePrefix}: `}
										</span>
										{filter.value}
									</>
								) : filter.value}
								key={filter.key ? filter.key : `${index}_${filter.value}`}
								closable
								onClick={() => onFilterRemove(filter)}
							/>
						))}
					</TagList>
				</div>
			) : (
				null
			)}
		</div>
	);
};

Filter.propTypes = {
	actionsClassName: PropTypes.string,
	children: PropTypes.node,
	className: PropTypes.string,
	title: PropTypes.string,
	noFilterText: PropTypes.string,
	onConfirm: PropTypes.func,
	confirmText: PropTypes.string,
	onClean: PropTypes.func,
	cleanText: PropTypes.string,
	activeFilters: PropTypes.arrayOf(PropTypes.shape({
		valuePrefix: PropTypes.string,
		value: PropTypes.string,
		key: PropTypes.string,
	})),
	onFilterRemove: PropTypes.func,
	enableSubmitOnEnter: PropTypes.bool,
};

export default Filter;
