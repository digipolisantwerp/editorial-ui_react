import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * @typedef TableRowProps
 * @prop {React.ReactNode} children
 * @prop {string} [className]
 * @prop {boolean} [collapseOnDrag]
 * @prop {boolean} [hasClickAction]
 * @prop {boolean} [isDragging]
 * @prop {boolean} [isLast]
 * @prop {number} [level]
 * @prop {Function} [onClick]
 * @prop {Function | {current: Element}} [trRef]
 */

/** @param {TableRowProps} props */
const TableRow = ({
	children,
	className,
	collapseOnDrag,
	hasClickAction,
	isDragging,
	isLast,
	level,
	onClick,
	trRef,
}) => (
	<tr
		ref={trRef}
		className={classnames(className, {
			'a-table--clickable': hasClickAction,
			'a-table__row--hovered': isDragging,
			'a-table__row--collapse': collapseOnDrag,
			'a-table__row--level-1': level === 1,
			'a-table__row--level-2': level === 2,
			'a-table__row--last-in-level': isLast,
		})}
		onClick={onClick}
	>
		{children}
	</tr>
);

TableRow.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
	collapseOnDrag: PropTypes.bool,
	hasClickAction: PropTypes.bool,
	onClick: PropTypes.func,
	trRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
	]),
	isDragging: PropTypes.bool,
	level: PropTypes.number,
	isLast: PropTypes.bool,
};

export default TableRow;
