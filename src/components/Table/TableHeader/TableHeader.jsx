import { Button } from '@redactie/react-components';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const TableHeader = ({
	activeSorting = { key: '', order: 'asc' },
	as: HTMLTag = 'th',
	classList,
	className,
	component,
	hideLabel,
	disableSorting,
	label,
	value = '',
	onSortClick,
	width,
}) => {
	const style = width ? {
		width,
	} : {};

	const renderTableHeader = () => {
		if (hideLabel) {
			return;
		}

		if (component) {
			return component(value, label);
		}
		if (disableSorting) {
			return label;
		}

		const sortIcon = activeSorting.key === value ? `sort-${activeSorting.order}` : 'sort';
		const newOrder = activeSorting.order === 'asc' ? 'desc' : 'asc';

		return (
			<Button
				className="a-table__header__button"
				iconRight={sortIcon}
				onClick={() => onSortClick(value, newOrder)}
				size="tiny"
				type="transparent"
			>
				{label}
			</Button>
		);
	};

	return (
		<HTMLTag style={style} className={classnames(className, classList)}>
			{renderTableHeader()}
		</HTMLTag>
	);
};

TableHeader.propTypes = {
	as: PropTypes.string,
	classList: PropTypes.arrayOf(PropTypes.string),
	className: PropTypes.string,
	label: PropTypes.string.isRequired,
	value: PropTypes.string,
	component: PropTypes.func,
	disableSorting: PropTypes.bool,
	activeSorting: PropTypes.shape({
		key: PropTypes.string,
		order: PropTypes.oneOf(['asc', 'desc']),
	}),
	onSortClick: PropTypes.func,
	width: PropTypes.string,
	hideLabel: PropTypes.bool,
};

export default TableHeader;
