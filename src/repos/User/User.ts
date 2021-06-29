import { Observable } from 'rxjs';
import { FirestoreCollectionReference } from '../../utils';

export interface User {
	name: string;
	email: string;
	userId: string;
	profilePicture: string;
	phoneNo: string;
	clientId: string;
	projectId: string;
}

export const getUsers = (clientId: string): Observable<User[]> => {
	return new Observable<User[]>((observer) => {
		FirestoreCollectionReference.Users()
			.where('clientId', '==', clientId)
			.onSnapshot(
				(querySnapshot) => {
					const projects = querySnapshot.docs.map(
						(doc) =>
							({
								userId: doc.id,
								...doc.data(),
							} as User)
					);
					observer.next(projects);
				},
				(error) => observer.error(error)
			);
	});
};
