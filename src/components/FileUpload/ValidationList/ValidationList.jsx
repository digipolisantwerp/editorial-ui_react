import PropTypes from 'prop-types';
import React from 'react';

import { VALIDATION_MESSAGES_DEFAULT } from '../FileUpload.const';

/**
 * @typedef ValidationListProp
 * @prop {object[]} [invalidFiles]
 * @prop {string[]} [invalidFiles.reasons]
 * @prop {File} [invalidFiles.file]
 * @prop {string} [ariaLabelRemove]
 * @prop {Function} [removeInvalidFile]
 * @prop {object} [messages]
 * @prop {string} [messages.INVALID_FILE_TYPE]
 * @prop {string} [messages.INVALID_FILE_SIZE]
 * @prop {string} [messages.INVALID_MIME_TYPE]
 */
/** @param {ValidationListProp} props */
const ValidationList = ({
	invalidFiles = [],
	messages = VALIDATION_MESSAGES_DEFAULT,
	ariaLabelRemove = 'Verwijder',
	removeInvalidFile = () => null,
}) => {
	/**
	 * Hooks
	 */
	const formatReasons = (reasons = []) => reasons.map((reason) => messages[reason] ?? VALIDATION_MESSAGES_DEFAULT[reason]).join(', ');

	/**
	 * Render
	 */
	const renderInvalidFiles = (files = []) => files.map((file, index) => (
		<li key={`${index}_${file.file.name}`} className="is-error">
			<span className="fa fa-warning" />
			<span className="m-upload__filename">{file.file.name}</span>
			<span className="m-upload__error">{formatReasons(file.reasons)}</span>

			<button onClick={() => removeInvalidFile(index)} type="button" className="m-upload__delete a-button-transparent a-button--danger a-button--small has-icon">
				<span className="fa fa-close" aria-label={ariaLabelRemove} />
			</button>
		</li>
	));

	return (
		<ul className="m-upload__files u-margin-top-xs">
			{renderInvalidFiles(invalidFiles)}
		</ul>
	);
};

ValidationList.propTypes = {
	invalidFiles: PropTypes.arrayOf(PropTypes.shape({
		reasons: PropTypes.arrayOf(PropTypes.string),
		file: PropTypes.instanceOf(File),
	})),
	ariaLabelRemove: PropTypes.string,
	removeInvalidFile: PropTypes.func,
	messages: PropTypes.shape({
		INVALID_FILE_TYPE: PropTypes.string,
		INVALID_FILE_SIZE: PropTypes.string,
		INVALID_MIME_TYPE: PropTypes.string,
	}),
};

export default ValidationList;
