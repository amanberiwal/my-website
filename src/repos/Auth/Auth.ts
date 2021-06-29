import { auth } from '../../firebase.config';
import { from, Observable } from 'rxjs';
import { User } from '..';
import { FirestoreCollectionReference } from '../../utils/FirebaseCollectionReference';

export const signIn = (
	email: string,
	password: string
): Observable<firebase.default.auth.UserCredential> => {
	return from(auth().signInWithEmailAndPassword(email, password));
};

export const listenToAuthState = (): Observable<User | null> => {
	return new Observable<User | null>((observer) => {
		auth().onAuthStateChanged((user) => {
			if (!user) {
				observer.next(null);
				return;
			}
			FirestoreCollectionReference.Users()
				.doc(user.uid)
				.onSnapshot(
					(documentSnapshot) => {
						const user = {
							...documentSnapshot.data(),
							userId: documentSnapshot.id,
						} as User;
						observer.next(user);
					},
					() => observer.next(null)
				);
		});
	});
};

export const resetPassword = (email: string) => {
	return from(auth().sendPasswordResetEmail(email));
};

export const signOut = (): Observable<void> => {
	return from(auth().signOut());
};
