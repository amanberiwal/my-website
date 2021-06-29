import { action, ActionType } from 'typesafe-actions';
import { Hotel } from '../../repos';

export enum RoomingActionType {
	ListenToHotels = 'RoomingActionType/ListenToHotels',
	SetHotels = 'RoomingActionType/SetHotels',
	SetSelectedRows = 'RoomingActionType/SetSelectedRows',
}

export const listenToHotels = () => action(RoomingActionType.ListenToHotels);

export const setHotels = (hotels: Hotel[]) =>
	action(RoomingActionType.SetHotels, { hotels });

export const setSelectedRows = (selectedRows: []) =>
	action(RoomingActionType.SetSelectedRows, { selectedRows });

const roomingActions = {
	listenToHotels,
	setHotels,
	setSelectedRows,
};

export type RoomingAction = ActionType<typeof roomingActions>;
