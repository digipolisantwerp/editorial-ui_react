/* eslint-disable react/forbid-prop-types */
import { Icon } from '@redactie/react-components';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './MultilanguageField.module.scss';

const cx = classNames.bind(styles);

const FormField = ({ asComponent, ...props }) => React.createElement(asComponent, props);

const MultilanguageField = ({ asComponent, multiLang = true, ...props }) => (
	<div className={multiLang && cx('u-bg-light', 'o-multilanguage-field')}>
		{multiLang && <Icon name="globe" className={cx('o-multilanguage-field__icon')} />}
		<FormField asComponent={asComponent} {...props} />
	</div>
);

FormField.propTypes = {
	asComponent: PropTypes.any,
};

MultilanguageField.propTypes = {
	asComponent: PropTypes.any,
	multiLang: PropTypes.bool,
};

export default MultilanguageField;
