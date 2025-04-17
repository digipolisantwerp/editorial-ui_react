import { TagList, TagListItem } from '@redactie/react-components';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './TaggableInput.scss';

const TaggableInput = ({
	tags,
	children,
	onClose,
	...props
}) => (Array.isArray(tags) && tags.length ? (
	<div className={classnames('m-taggable-input')}>
		<div className={classnames('m-taggable-list')}>
			<TagList>
				{tags.map((tag) => (
					<TagListItem
						closable
						onClick={(e) => {
							e.target.value = tag;
							if (typeof onClose === 'function') {
								onClose(e);
							}
						}}
						key={tag.value}
						value={tag.label}
					/>
				))}
			</TagList>
		</div>
		<div className={classnames('m-taggable-child')}>{children}</div>
	</div>
) : React.cloneElement(children, props) || null);

TaggableInput.propTypes = {
	tags: PropTypes.arrayOf(PropTypes.shape({
		value: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.number,
		]),
		label: PropTypes.string,
	})),
	children: PropTypes.element,
	onClose: PropTypes.func,
};

export default TaggableInput;
