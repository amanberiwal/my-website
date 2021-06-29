import { produce } from 'immer';
import { RoomingAction, RoomingActionType } from '../actions';
import { Hotel } from '../../repos';

export interface RoomingStateType {
	loading: boolean;
	hotels?: Hotel[];
	selectedRows?: [];
}

const initialState: RoomingStateType = { loading: false };

export const RoomingStateReducer = (
	currentState = initialState,
	action: RoomingAction
) =>
	produce(currentState, (draft) => {
		switch (action.type) {
			case RoomingActionType.ListenToHotels:
				draft.loading = true;
				break;
			case RoomingActionType.SetHotels:
				draft.hotels = action.payload.hotels;
				draft.loading = false;
				break;
			case RoomingActionType.SetSelectedRows:
				draft.selectedRows = action.payload.selectedRows;
				break;
		}
	});
