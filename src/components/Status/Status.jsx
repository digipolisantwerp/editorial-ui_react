import PropTypes from 'prop-types';
import React from 'react';

import { typeMap } from './Status.helpers';

/**
 * @typedef {{label: string, type: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' }} StatusProps
 */

/** @param {StatusProps} props */
const Status = ({
	label,
	type,
}) => <span className={`u-text-${typeMap[type]}`}>{label}</span>;

Status.propTypes = {
	label: PropTypes.string.isRequired,
	type: PropTypes.oneOf(['ACTIVE', 'INACTIVE', 'ARCHIVED']).isRequired,
};

export default Status;
