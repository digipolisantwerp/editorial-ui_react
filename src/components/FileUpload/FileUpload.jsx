import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import { isNumber } from '../../helpers';
import { useSlot } from '../../hooks/useSlot';

import { UPLOAD_OPTIONS_DEFAULT } from './FileUpload.const';
import { FileUploadDescription, FileUploadMessage } from './FileUpload.slots';
import { FileUploadZone } from './FileUploadZone';
import { Uploader } from './Uploader';
import { ValidationList } from './ValidationList';

/**
 * @typedef FileUploadProps
 * @prop {string} id
 * @prop {boolean} [disabled]
 * @prop {string} [ariaLabelRemove]
 * @prop {object} [options]
 * @prop {string[]} [options.allowedMimeTypes]
 * @prop {string[]} [options.allowedFileTypes]
 * @prop {number} [options.maxFileSize]
 * @prop {string} [options.type]
 * @prop {string} [options.url]
 * @prop {number} [options.fileLimit]
 * @prop {object} [options.messages]
 * @prop {string} [options.messages.INVALID_FILE_TYPE]
 * @prop {string} [options.messages.INVALID_FILE_SIZE]
 * @prop {string} [options.messages.INVALID_MIME_TYPE]
 * @prop {string} [options.messages.REQUEST_ERROR]
 * @prop {object} [options.requestHeader]
 * @prop {string} [options.requestHeader.key]
 * @prop {string} [options.requestHeader.value]
 * @prop {object[]} [files]
 * @prop {string} files.id
 * @prop {string} files.name
 * @prop {Function} [selectUploadedFiles]
 * @prop {Function} [removeFile]
 * @prop {React.ReactNode[] | React.ReactNode} [children]
 */
/** @param {FileUploadProps} props */
const FileUpload = ({
	id = '',
	ariaLabelRemove = 'Verwijder',
	disabled = false,
	files = [],
	options = UPLOAD_OPTIONS_DEFAULT,
	selectUploadedFiles = () => null,
	removeFile = () => null,
	children,
}) => {
	/**
	 * Hooks
	 */
	const fileUploadDescriptionSlot = useSlot(FileUploadDescription, children);
	const fileUploadMessageSlot = useSlot(FileUploadMessage, children);
	const [uploader, setUploader] = useState(null);
	const [invalidFiles, setInvalidFiles] = useState([]);

	useEffect(() => {
		if (!uploader) {
			setUploader(new Uploader(options));
		}
	}, [options, uploader]);

	const uploadZoneIsDisabled = useMemo(() => {
		if (options.fileLimit && isNumber(options.fileLimit)) {
			return files.length < options.fileLimit;
		}

		return true;
	}, [options.fileLimit, files]);

	/**
	 * Methods
	 */
	const onInvalidFiles = (invFiles) => {
		setInvalidFiles(invFiles);
	};

	const onRequestError = (error) => {
		setInvalidFiles(error.files.map((file) => ({
			file,
			reasons: ['REQUEST_ERROR'],
		})));
	};

	const onRemoveInvalidFile = (index) => {
		setInvalidFiles(invalidFiles.filter((file, i) => i !== index));
	};

	/**
	 * Render
	 */

	if (!uploader) {
		return null;
	}

	const renderFiles = (uploadedFiles = []) => {
		if (uploadedFiles.length === 0) {
			return null;
		}

		return (
			<ul className="m-upload__files">
				{ uploadedFiles.map((file, index) => (
					<li key={file.id || index}>
						<span className="fa fa-file-o" />
						<span className="m-upload__filename">{file.name}</span>
						<button disabled={disabled} onClick={() => removeFile(file.id, index)} type="button" className="m-upload__delete a-button-transparent a-button--default a-button--small has-icon">
							<span className="fa fa-close" aria-label="Close" />
						</button>
					</li>
				)) }
			</ul>
		);
	};

	return (
		<div className="m-upload">
			<FileUploadZone
				invalidFiles={onInvalidFiles}
				onRequestError={onRequestError}
				uploadedFiles={selectUploadedFiles}
				disabled={disabled || !uploadZoneIsDisabled}
				id={id}
				uploader={uploader}
				allowedMimeTypes={options.allowedMimeTypes}
				allowedFileTypes={options.allowedFileTypes}
			>
				{ fileUploadMessageSlot
					&& (
						<FileUploadMessage>
							{fileUploadMessageSlot}
						</FileUploadMessage>
					) }

				{ fileUploadDescriptionSlot
					&& (
						<FileUploadDescription>
							{fileUploadDescriptionSlot}
						</FileUploadDescription>
					) }
			</FileUploadZone>
			{ renderFiles(files) }
			<ValidationList
				messages={options.messages}
				ariaLabelRemove={ariaLabelRemove}
				invalidFiles={invalidFiles}
				removeInvalidFile={onRemoveInvalidFile}
			/>
		</div>
	);
};

FileUpload.propTypes = {
	id: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	ariaLabelRemove: PropTypes.string,
	options: PropTypes.shape({
		allowedMimeTypes: PropTypes.arrayOf(PropTypes.string),
		allowedFileTypes: PropTypes.arrayOf(PropTypes.string),
		maxFileSize: PropTypes.number,
		type: PropTypes.string,
		url: PropTypes.string,
		fileLimit: PropTypes.number,
		messages: PropTypes.shape({
			INVALID_FILE_TYPE: PropTypes.string,
			INVALID_FILE_SIZE: PropTypes.string,
			INVALID_MIME_TYPE: PropTypes.string,
			REQUEST_ERROR: PropTypes.string,
		}),
		requestHeader: PropTypes.shape({
			key: PropTypes.string,
			value: PropTypes.string,
		}),
	}),
	files: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})),
	selectUploadedFiles: PropTypes.func,
	removeFile: PropTypes.func,
	children: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.node),
		PropTypes.node,
	]),
};

export default FileUpload;
