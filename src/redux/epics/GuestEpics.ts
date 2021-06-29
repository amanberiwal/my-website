import { of } from 'rxjs';
import {
	filter,
	switchMap,
	map,
	catchError,
	mapTo,
	withLatestFrom,
} from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';
import { RootEpic } from '.';
import { GuestActionType, setGuests, setError, setGuestHeaders } from '..';
import {
	listenToGuests,
	getGuestHeaders,
	updateGuest,
	createGuest,
	deleteGuest,
	createGuestHeaders,
} from '../../repos';
import { setMessage } from '../actions';

export const listenToGuestsEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(GuestActionType.ListenToGuests)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId } = action.payload;
			return listenToGuests(clientId, projectId).pipe(
				map((guests) => setGuests(guests)),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const getGuestHeadersEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(GuestActionType.GetGuestHeaders)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId } = action.payload;
			return getGuestHeaders(clientId, projectId).pipe(
				map((tableHeaders) => setGuestHeaders(tableHeaders)),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

// TODO: use client id from store & checks in epics only

export const updateGuestEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(GuestActionType.UpdateGuest)),
		withLatestFrom(store),
		// debounce(() => interval(3000)),  //TODO: To be discussed for minimal document writes
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId, guestId, id, value } = action.payload;
			return updateGuest(clientId, projectId, guestId, id, value).pipe(
				mapTo(setMessage('Table Saved to Cloud')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const createGuestEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(GuestActionType.CreateGuest)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId, guestData } = action.payload;
			return createGuest(clientId, projectId, guestData).pipe(
				mapTo(setMessage('New Guest has been added successfully')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const deleteGuestEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(GuestActionType.DeleteGuest)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId, guestId } = action.payload;
			return deleteGuest(clientId, projectId, guestId).pipe(
				mapTo(setMessage('Guest has been deleted successfully')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const createGuestHeadersEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(GuestActionType.CreateGuestHeaders)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId } = action.payload;
			return createGuestHeaders(clientId, projectId).pipe(
				mapTo(setMessage('Welcome 😁')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};
