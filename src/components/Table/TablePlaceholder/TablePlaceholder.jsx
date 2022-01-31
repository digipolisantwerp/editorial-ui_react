import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import '../Table.scss';

/**
 * @typedef TablePlaceholderProps
 * @prop {boolean} hasCols
 * @prop {boolean} hasData
 * @prop {string} [className]
 * @prop {string} [noColumnsMessage]
 * @prop {string} [noDataMessage]
 */

/** @param {TablePlaceholderProps} props */
const TablePlaceholder = ({
	hasCols,
	hasData,
	className,
	noColumnsMessage,
	noDataMessage,
}) => {
	const showNoCols = !hasCols;
	const showNoData = !hasData;

	return (
		<div className={classnames(className, 'a-table a-table--has-placeholder')}>
			{showNoData && <div className="a-table--has-placeholder__item">{noDataMessage}</div>}
			{showNoCols && <div className="a-table--has-placeholder__item">{noColumnsMessage}</div>}
		</div>
	);
};

TablePlaceholder.propTypes = {
	hasCols: PropTypes.bool.isRequired,
	hasData: PropTypes.bool.isRequired,
	className: PropTypes.string,
	noColumnsMessage: PropTypes.string,
	noDataMessage: PropTypes.string,
};

export default TablePlaceholder;
