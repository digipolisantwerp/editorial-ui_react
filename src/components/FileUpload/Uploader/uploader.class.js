import { Observable } from 'rxjs';

import { UPLOAD_OPTIONS_DEFAULT } from '../FileUpload.const';

export class Uploader {
	options = UPLOAD_OPTIONS_DEFAULT;

	constructor(options = {}) {
		this.setOptions(options);
	}

	setOptions(options = {}) {
		this.options = {
			...this.options,
			...options,
		};
	}

	uploadFiles(files = [], extraHeaders) {
		const formData = this.filesToFormData(files);

		return new Observable((observer) => {
			const xhr = new XMLHttpRequest();

			// Progress callback
			xhr.upload.addEventListener('progress', (e) => {
				if (e.lengthComputable) {
					const percentComplete = e.loaded / e.total;

					observer.next({
						progress: percentComplete,
						data: null,
					});
				}
			});

			// Complete callback
			xhr.onload = () => {
				observer.next({
					progress: 1,
					data: xhr.response,
					status: xhr.status,
				});
				observer.complete();
			};

			// Do request
			xhr.responseType = 'json';
			xhr.open('post', this.options.url);

			if (this.options.requestHeader && this.options.requestHeader.key) {
				xhr.setRequestHeader(this.options.requestHeader.key, this.options.requestHeader.value);
			}

			if (this.options.requestHeaders && Array.isArray(this.options.requestHeaders)) {
				this.options.requestHeaders.forEach(({ key, value }) => {
					xhr.setRequestHeader(key, value);
				});
			}

			if (extraHeaders && Array.isArray(extraHeaders)) {
				extraHeaders.forEach(({ key, value }) => {
					xhr.setRequestHeader(key, value);
				});
			}

			xhr.send(formData);
		});
	}

	validateFiles(files = []) {
		return files.reduce((acc, file) => {
			const errors = [];

			if (!this.validateFileType(file)) {
				errors.push('INVALID_FILE_TYPE');
			}

			if (!this.validateFileSize(file)) {
				errors.push('INVALID_FILE_SIZE');
			}

			if (!this.validateMimeType(file)) {
				errors.push('INVALID_MIME_TYPE');
			}

			if (errors.length === 0) {
				acc.validFiles.push(file);
			} else {
				acc.invalidFiles.push({
					reasons: errors,
					file,
				});
			}
			return acc;
		}, {
			validFiles: [],
			invalidFiles: [],
		});
	}

	filesToFormData(files = []) {
		const formData = new FormData();

		if (!this.options.url || this.options.url === '') {
			throw new Error('Define the upload url.');
		}

		files.forEach((file) => {
			formData.append('file', file);

			// TODO: This should not be included in this file
			formData.append('name', 'test');
			formData.append('description', 'description');
			formData.append('copyright', 'copyright');
			formData.append('category', 'file');
			formData.append('editor', 'some editor');
		});

		return formData;
	}

	validateFileType(file) {
		const { allowedFileTypes } = this.options;
		const ext = Uploader.getFileExtension(file);

		// Filter defined?
		if (!Array.isArray(allowedFileTypes) || allowedFileTypes.length === 0) {
			return true;
		}

		// Make allowedFileTypes case insensitive
		const toUpper = (x) => x.toUpperCase();
		const allowedFileTypesToUpper = allowedFileTypes.map(toUpper);

		return allowedFileTypesToUpper.lastIndexOf(ext.toUpperCase()) !== -1;
	}

	validateFileSize(file) {
		const { maxFileSize } = this.options;

		// Filter defined?
		if (!maxFileSize || maxFileSize === 0) {
			return true;
		}

		return maxFileSize > file.size;
	}

	validateMimeType(file) {
		const { allowedMimeTypes } = this.options;

		// Filter defined?
		if (!Array.isArray(allowedMimeTypes) || allowedMimeTypes.length === 0) {
			return true;
		}

		return allowedMimeTypes.lastIndexOf(file.type) !== -1;
	}

	static getFileExtension(file) {
		return file.name.split('.')[file.name.split('.').length - 1];
	}
}
