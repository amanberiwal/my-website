import { storage } from '../firebase.config';
import moment from 'moment';
import { Observable } from 'rxjs';

export interface DownloadURLMap {
	[key: string]: string | null;
}

export interface UploadProgress {
	percent: number;
	downloadURL: string | null;
}

/**
 *
 * @param folderPath The path to the folder
 * @param file File to be uploaded
 *
 * @returns {Observable<UploadProgress>} A stream of percentage completion of uploading.
 */
export const uploadFiles = (
	folderPath: string,
	file: File
): Observable<UploadProgress> => {
	const task = storage()
		.ref(folderPath)
		.child(`${moment().valueOf()}_${file.name}`)
		.put(file);
	return new Observable<UploadProgress>((subscriber) => {
		task.on(
			storage.TaskEvent.STATE_CHANGED,
			(taskSnapshot) => {
				const progress =
					taskSnapshot.bytesTransferred / taskSnapshot.totalBytes;
				subscriber.next({
					percent: progress,
					downloadURL: null,
				});
			},
			(error) => {
				subscriber.error(error);
			},
			() => {
				task.snapshot.ref.getDownloadURL().then((downloadURL) => {
					subscriber.next({ percent: 1, downloadURL });
					subscriber.complete();
				});
			}
		);
	});
};
