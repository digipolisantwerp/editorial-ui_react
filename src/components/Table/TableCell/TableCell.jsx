import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { isNil } from '../../../helpers';
import { EllipsisWithTooltip } from '../../EllipsisWithTooltip';

/**
 * @typedef TableCellProps
 * @prop {string} [as]
 * @prop {string[]} [classList]
 * @prop {string} [className]
 * @prop {boolean} [ellipsis]
 * @prop {Function} [component]
 * @prop {object} [rowData]
 * @prop {number} [rowIndex]
 * @prop {number | string | boolean} [value]
 * @prop {object[]} [style]
 */

/** @param {TableCellProps} props */
const TableCell = ({
	as: HTMLTag = 'td',
	classList,
	className,
	component,
	rowData,
	rowIndex,
	value,
	ellipsis = false,
	style,
}) => (
	<HTMLTag className={classnames(className, classList)} style={style}>
		{ ellipsis && !isNil(value) ? (
			<EllipsisWithTooltip type="primary">
				{component ? component(value, rowData, rowIndex) : value}
			</EllipsisWithTooltip>
		) : (
			<>
				{component ? component(value, rowData, rowIndex) : value}
			</>
		)}
	</HTMLTag>
);

TableCell.propTypes = {
	as: PropTypes.string,
	classList: PropTypes.arrayOf(PropTypes.string),
	className: PropTypes.string,
	ellipsis: PropTypes.bool,
	component: PropTypes.func,
	rowData: PropTypes.oneOfType([PropTypes.object]),
	rowIndex: PropTypes.number,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
	style: PropTypes.shape(),
};

export default TableCell;
