import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { isNil } from '../../../helpers';
import { EllipsisWithTooltip } from '../../EllipsisWithTooltip';

const TableCell = ({
	as: HTMLTag = 'td',
	tdClassList,
	classList,
	className,
	component,
	rowData,
	rowIndex,
	value,
	ellipsis = false,
	style,
	indentingComponent,
	level,
}) => (
	<HTMLTag className={classnames(className, classList, tdClassList)} style={style}>
		{
			indentingComponent
			&& new Array(level).fill(0).map(() => indentingComponent(value, rowData, rowIndex))
		}
		{ ellipsis && !isNil(value) ? (
			<EllipsisWithTooltip type="primary">
				{component ? component(value, rowData, rowIndex) : value}
			</EllipsisWithTooltip>
		) : (
			component ? component(value, rowData, rowIndex) : value
		)}
	</HTMLTag>
);

TableCell.propTypes = {
	as: PropTypes.string,
	tdClassList: PropTypes.arrayOf(PropTypes.string),
	classList: PropTypes.arrayOf(PropTypes.string),
	className: PropTypes.string,
	ellipsis: PropTypes.bool,
	component: PropTypes.func,
	rowData: PropTypes.oneOfType([PropTypes.object]),
	rowIndex: PropTypes.number,
	value: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.bool]),
	style: PropTypes.shape(),
	indentingComponent: PropTypes.func,
	level: PropTypes.number,
};

export default TableCell;
