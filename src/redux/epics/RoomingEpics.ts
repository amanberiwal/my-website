import { RootEpic } from '.';
import { RoomingActionType, setError, setHotels } from '../actions';
import { isOfType } from 'typesafe-actions';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { listenToHotels } from '../../repos';
import { of } from 'rxjs';

export const listenToHotelsEpic: RootEpic = (action$) => {
	return action$.pipe(
		filter(isOfType(RoomingActionType.ListenToHotels)),
		switchMap(() => {
			return listenToHotels().pipe(
				map((hotels) => setHotels(hotels)),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};
