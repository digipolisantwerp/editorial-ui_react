import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * @typedef {object} ContainerProp
 * @prop {string} [className]
 * @prop {React.ReactNode} [children]
 */

/** @param {ContainerProp} props */
const Container = ({ className, children }) => (
	<div className={classnames(className, 'u-container u-wrapper u-margin-top u-margin-bottom-lg')}>
		{children}
	</div>
);

Container.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node,
};

export default Container;
