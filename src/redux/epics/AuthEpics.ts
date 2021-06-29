import { of } from 'rxjs';
import { catchError, filter, map, mapTo, switchMap } from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';
import { RootEpic } from '.';
import { AuthActionType, setCurrentUser, setError, setMessage } from '..';
import { listenToAuthState, resetPassword, signIn, signOut } from '../../repos';

export const signInEpic: RootEpic = (action$) => {
	return action$.pipe(
		filter(isOfType(AuthActionType.SignIn)),
		switchMap((action) => {
			const { email, password } = action.payload;
			return signIn(email, password).pipe(
				mapTo(setMessage('You are now signed in!')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const listenToAuthStateEpic: RootEpic = (action$) => {
	return action$.pipe(
		filter(isOfType(AuthActionType.ListenToAuthState)),
		switchMap(() => {
			return listenToAuthState().pipe(
				map((currentUser) => {
					return setCurrentUser(currentUser);
				}),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const resetPasswordEpic: RootEpic = (action$) => {
	return action$.pipe(
		filter(isOfType(AuthActionType.ResetPassword)),
		switchMap((action) => {
			const { email } = action.payload;
			return resetPassword(email).pipe(
				mapTo(setMessage('Reset link mailed to your registered e-mail')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const signOutEpic: RootEpic = (action$) => {
	return action$.pipe(
		filter(isOfType(AuthActionType.SignOut)),
		switchMap(() => {
			return signOut().pipe(
				mapTo(setMessage('You are now signed out!')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};
