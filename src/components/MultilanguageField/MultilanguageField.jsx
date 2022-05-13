/* eslint-disable react/forbid-prop-types */
import { Icon } from '@acpaas-ui/react-components';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import React from 'react';

import styles from './MultilanguageField.module.scss';

const cx = classNames.bind(styles);

const FormFieldAsComponent = ({ asComponent, ...props }) => React.createElement(
	asComponent, props,
);

const FormFieldChildren = ({ children, ...props }) => React.cloneElement(
	children, props,
);

const MultilanguageField = ({
	asComponent, multiLang = true, children, ...props
}) => (
	<div className={multiLang && cx('u-bg-light', 'o-multilanguage-field')}>
		{multiLang && <Icon name="globe" className={cx('o-multilanguage-field__icon')} />}
		{asComponent && <FormFieldAsComponent asComponent={asComponent} {...props} />}
		{children && <FormFieldChildren {...props}>{children}</FormFieldChildren>}
	</div>
);

FormFieldAsComponent.propTypes = {
	asComponent: PropTypes.any,
};

FormFieldChildren.propTypes = {
	children: PropTypes.any,
};

MultilanguageField.propTypes = {
	asComponent: PropTypes.any,
	children: PropTypes.any,
	multiLang: PropTypes.bool,
};

export default MultilanguageField;
