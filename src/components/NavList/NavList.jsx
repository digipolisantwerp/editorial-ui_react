import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import sanitizeHtml from 'sanitize-html';

import './NavList.scss';

/**
 * @typedef NavListProps
 * @prop {string} [className]
 * @prop {React.ElementType} [linkComponent]
 * @prop {object[]} items
 * @prop {boolean} [items.hasError]
 * @prop {string} items.label
 * @prop {string} [items.description]
 * @prop {'large'} [size]
 * @prop {boolean} [lockBodyScroll]
 */

/** @param {NavListProps} props */
const NavList = ({ className, linkComponent: LinkComponent = 'a', items }) => (
	<ul className={classnames(className, 'm-nav-list')}>
		{items.map(({
			description,
			hasError,
			label,
			...linkProps
		}, index) => (
			<li
				key={`nav-list-${index}`}
				className={classnames('m-nav-list__item', { 'm-nav-list__item--error': hasError })}
			>
				<LinkComponent {...linkProps}>
					<span>{`${label}${hasError ? '*' : ''}`}</span>
					{description && (
						<p
							className="m-nav-list__item-description u-text-light"
							// eslint-disable-next-line react/no-danger
							dangerouslySetInnerHTML={{
								__html: sanitizeHtml(description, {
									allowedTags: ['br'],
								}),
							}}
						/>
					)}
				</LinkComponent>
			</li>
		))}
	</ul>
);

NavList.propTypes = {
	className: PropTypes.string,
	linkComponent: PropTypes.elementType,
	items: PropTypes.arrayOf(PropTypes.shape({
		hasError: PropTypes.bool,
		label: PropTypes.string.isRequired,
		description: PropTypes.string,
	})).isRequired,
};

export default NavList;
