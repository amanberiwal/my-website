import { produce } from 'immer';
import { GuestData, HeaderType } from '../../repos';
import { GuestAction, GuestActionType } from '../actions';

export interface GuestStateType {
	readonly loading: boolean;
	readonly guestsData?: GuestData[];
	readonly tableHeaders?: HeaderType;
}

const initialState: GuestStateType = { loading: false };

export const GuestStateReducer = (
	currentState = initialState,
	action: GuestAction
) =>
	produce(currentState, (draft) => {
		switch (action.type) {
			case GuestActionType.ListenToGuests:
				draft.loading = true;
				break;
			case GuestActionType.SetGuests:
				draft.guestsData = action.payload.guestsData;
				draft.loading = false;
				break;
			case GuestActionType.GetGuestHeaders:
				draft.loading = true;
				break;
			case GuestActionType.SetGuestHeaders:
				draft.tableHeaders = action.payload.tableHeaders;
				draft.loading = false;
				break;
			case GuestActionType.UpdateGuest:
				draft.loading = true;
				break;
		}
		return draft;
	});
