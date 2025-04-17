import { Spinner } from '@redactie/react-components';
import PropTypes from 'prop-types';
import React from 'react';

import '../Table.scss';

const TableLoader = ({
	loadDataMessage,
	inTableRow = true,
	indentingComponent,
	level = 1,
}) => (
	inTableRow ? (
		<tr>
			<td>
				<div className="a-table--loading">
					<Spinner className="u-margin-right-xs" style={{ display: 'inline' }} />
					<span>{loadDataMessage}</span>
				</div>
			</td>
		</tr>
	) : (
		<div className="a-table--loading">
			{
				indentingComponent && new Array(level + 1).fill(0).map(() => indentingComponent())
			}
			<Spinner className={`u-margin-right-xs ${!!indentingComponent && 'u-margin-left-xs'}`} style={{ display: 'inline' }} />
			<span>{loadDataMessage}</span>
		</div>
	)
);

TableLoader.propTypes = {
	loadDataMessage: PropTypes.string,
	inTableRow: PropTypes.bool,
	indentingComponent: PropTypes.func,
	level: PropTypes.number,
};

export default TableLoader;
