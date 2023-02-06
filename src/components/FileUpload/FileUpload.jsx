/* eslint-disable react/require-default-props */
import PropTypes from 'prop-types';
import React, {
	forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState,
} from 'react';

import { isNumber } from '../../helpers';
import { useSlot } from '../../hooks/useSlot';

import { UPLOAD_OPTIONS_DEFAULT } from './FileUpload.const';
import { FileUploadDescription, FileUploadMessage } from './FileUpload.slots';
import { FileUploadZone } from './FileUploadZone';
import { Uploader } from './Uploader';
import { ValidationList } from './ValidationList';

const FileUpload = forwardRef(({
	id = '',
	ariaLabelRemove = 'Verwijder',
	disabled = false,
	files = [],
	options = UPLOAD_OPTIONS_DEFAULT,
	selectUploadedFiles = () => null,
	selectQueuedFiles = () => null,
	removeFile = () => null,
	children,
}, ref) => {
	/**
	 * Hooks
	 */
	const fileUploadDescriptionSlot = useSlot(FileUploadDescription, children);
	const fileUploadMessageSlot = useSlot(FileUploadMessage, children);
	const [uploader, setUploader] = useState(null);
	const [invalidFiles, setInvalidFiles] = useState([]);
	const [queuedFiles, setQueuedFiles] = useState([]);
	const uploadZoneRef = useRef();

	useImperativeHandle(ref, () => ({
		startUpload(extraHeaders) {
			return uploadZoneRef.current.uploadFiles(queuedFiles, extraHeaders);
		},
	}));

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

	useEffect(() => {
		if (!selectQueuedFiles) {
			return;
		}

		selectQueuedFiles(queuedFiles);
	}, [queuedFiles, selectQueuedFiles]);

	/**
	 * Methods
	 */
	const onInvalidFiles = (invFiles) => {
		setInvalidFiles(invFiles);
	};

	const onQueuedFiles = (qFiles) => {
		setQueuedFiles(qFiles);
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

	const onRemoveFile = (fileId, index) => {
		// If the file is queued, just delete it.
		if (!fileId && queuedFiles?.[index]) {
			return setQueuedFiles(queuedFiles.filter((_, fIndex) => index !== fIndex));
		}

		removeFile(fileId, index);
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
						<button disabled={disabled} onClick={() => onRemoveFile(file.id, index)} type="button" className="m-upload__delete a-button-transparent a-button--default a-button--small has-icon">
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
				ref={uploadZoneRef}
				autoUpload={options.autoUpload}
				invalidFiles={onInvalidFiles}
				queuedFiles={onQueuedFiles}
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
			{ renderFiles([...files, ...queuedFiles]) }
			<ValidationList
				messages={options.messages}
				ariaLabelRemove={ariaLabelRemove}
				invalidFiles={invalidFiles}
				removeInvalidFile={onRemoveInvalidFile}
			/>
		</div>
	);
});

FileUpload.propTypes = {
	id: PropTypes.string.isRequired,
	disabled: PropTypes.bool,
	ariaLabelRemove: PropTypes.string,
	options: PropTypes.shape({
		autoUpload: PropTypes.bool,
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
		requestHeaders: PropTypes.arrayOf(PropTypes.shape({
			key: PropTypes.string,
			value: PropTypes.string,
		})),
	}),
	files: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})),
	selectUploadedFiles: PropTypes.func,
	selectQueuedFiles: PropTypes.func,
	removeFile: PropTypes.func,
	children: PropTypes.node,
};

export default FileUpload;
