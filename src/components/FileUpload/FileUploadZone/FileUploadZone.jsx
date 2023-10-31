import classnames from 'classnames';
import PropTypes from 'prop-types';
import React, { useMemo, useRef, useState } from 'react';

import { useSlot } from '../../../hooks/useSlot';
import { ProgressBar } from '../../ProgressBar';
import { FileUploadDescription, FileUploadMessage } from '../FileUpload.slots';
import { Uploader } from '../Uploader';

const FileUploadZone = ({
	autoUpload = true,
	id = '',
	ariaId = '',
	uploader,
	disabled = false,
	multiple = false,
	onCustomClick,
	onCustomDrop,
	uploadedFiles = () => null,
	invalidFiles = () => null,
	onRequestError = () => null,
	allowedMimeTypes = [],
	allowedFileTypes = [],
	children,

}) => {
	/**
	 * Hooks
	 */
	const fileInput = useRef(null);
	const fileUploadDescriptionSlot = useSlot(FileUploadDescription, children);
	const fileUploadMessageSlot = useSlot(FileUploadMessage, children);
	const [, setHasDragOver] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploadingFiles, setUploadingFiles] = useState([]);
	const accept = useMemo(
		() => allowedFileTypes.map((type) => `.${type}`).concat(allowedMimeTypes).join(','),
		[allowedFileTypes, allowedMimeTypes],
	);

	/**
	 * Methods
	 */
	const fileListToArray = (list) => Array.from(list);

	const clearFileInput = () => {
		if (fileInput.current) {
			fileInput.current.value = '';
		}
	};

	const uploadFiles = (files) => {
		// Reset progress
		setUploadProgress(0);
		setUploadingFiles(files);

		// upload
		uploader.uploadFiles(files).subscribe(
			(response) => {
				if (response.progress) {
					setUploadProgress(Math.floor(response.progress * 100));
				}

				if (!response.status && !response.data) {
					return;
				}

				if (response.status < 300 && response.data) {
					uploadedFiles(response.data);
					return;
				}

				onRequestError({
					files,
					error: response.data,
				});
			},
			(error) => {
				// eslint-disable-next-line no-console
				onRequestError({
					files,
					error,
				});
			},
			() => {
				setUploadProgress(0);
				setUploadingFiles([]);
				clearFileInput();
			},
		);
	};

	const handleFiles = async (files, customHandler) => {
		const response = await Promise.resolve(uploader.validateFiles(files));
		invalidFiles(response.invalidFiles);

		if (customHandler) {
			customHandler(response.validFiles);
		}
		if (autoUpload && response.validFiles.length > 0) {
			uploadFiles(response.validFiles);
		}
	};

	const handleCustomClick = (e) => {
		// Prevent native browser upload when custom click handler is present
		e.preventDefault();
		onCustomClick();
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setHasDragOver(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setHasDragOver(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const { dataTransfer } = e;
		setHasDragOver(false);
		const files = fileListToArray(dataTransfer.files);
		handleFiles(files, onCustomDrop);
	};

	const updateFiles = (e) => {
		const { target } = e;
		const files = fileListToArray(target.files);
		handleFiles(files);
	};

	/**
	 * Render
	 */

	if (!uploader) {
		return null;
	}

	const renderUploadingFiles = (files = []) => uploadingFiles.map((file, index) => {
		const isLast = (files.length - 1) === index;
		return (
			<span key={`${index}_${file.name}`}>
				{file.name}
				{!isLast && ','}
			</span>
		);
	});

	return (
		<div className={classnames('m-upload', { 'is-disabled': disabled })}>
			<div className="m-upload__inner">
				<div className="m-upload__dropzone">
					<input
						ref={fileInput}
						className="m-upload__input"
						id={id}
						type="file"
						disabled={disabled}
						aria-labelledby={ariaId}
						multiple={multiple}
						accept={accept}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
						onChange={updateFiles}
						onClick={onCustomClick ? handleCustomClick : undefined}
					/>
					{ (!uploadProgress || uploadProgress === 0) && (
						<div className="m-upload__content">
							<p className="m-upload__message">
								{fileUploadMessageSlot}
							</p>
						</div>
					) }

					{ uploadProgress > 0 && (
						<div className="m-upload__content">
							<p className="m-upload__uploads u-text-bold u-margin-bottom-xs">
								{renderUploadingFiles(uploadingFiles)}
							</p>
							<ProgressBar value={uploadProgress} max="100" />
						</div>
					) }
				</div>
			</div>

			{
				fileUploadDescriptionSlot && (
					<small className="m-upload__description">
						{fileUploadDescriptionSlot}
					</small>
				)
			}
		</div>
	);
};

FileUploadZone.propTypes = {
	autoUpload: PropTypes.bool,
	id: PropTypes.string,
	uploader: PropTypes.instanceOf(Uploader),
	disabled: PropTypes.bool,
	multiple: PropTypes.bool,
	ariaId: PropTypes.string,
	uploadedFiles: PropTypes.func,
	invalidFiles: PropTypes.func,
	onRequestError: PropTypes.func,
	onCustomClick: PropTypes.func,
	onCustomDrop: PropTypes.func,
	allowedMimeTypes: PropTypes.arrayOf(PropTypes.string),
	allowedFileTypes: PropTypes.arrayOf(PropTypes.string),
	children: PropTypes.node,
};

export default FileUploadZone;
