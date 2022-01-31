import { Spinner } from '@acpaas-ui/react-components';
import PropTypes from 'prop-types';
import React from 'react';

import '../Table.scss';

/**
 * @typedef {object} TableLoaderProp
 * @prop {string} [loadDataMessage]
 */

/** @param {TableLoaderProp} props */
const TableLoader = ({
	loadDataMessage,
}) => (
	<tr>
		<td>
			<div className="a-table--loading">
				<Spinner className="u-margin-right-xs" style={{ display: 'inline' }} />
				<span>{loadDataMessage}</span>
			</div>
		</td>
	</tr>
);

TableLoader.propTypes = {
	loadDataMessage: PropTypes.string,
};

export default TableLoader;
