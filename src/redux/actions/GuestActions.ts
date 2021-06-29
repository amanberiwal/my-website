import { action, ActionType } from 'typesafe-actions';
import { GuestData, HeaderType } from '../../repos';

export enum GuestActionType {
	CreateGuest = 'GuestActionType/CreateGuest',
	CreateGuestHeaders = 'GuestActionType/CreateGuestHeaders',
	ListenToGuests = 'GuestActionType/ListenToGuests',
	GetGuestHeaders = 'GuestActionType/GetGuestHeaders',
	SetGuests = 'GuestActionType/SetGuests',
	SetGuestHeaders = 'GuestActionType/SetGuestHeaders',
	UpdateGuest = 'GuestActionType/UpdateGuest',
	DeleteGuest = 'GuestActionType/DeleteGuest',
}
// export const createGuest = (clientId: string, project: GuestData) =>
// 	action(GuestActionType.CreateGuest, { clientId, project });

export const listenToGuests = (projectId: string) =>
	action(GuestActionType.ListenToGuests, { projectId });

export const getGuestHeaders = (projectId: string) =>
	action(GuestActionType.GetGuestHeaders, { projectId });

export const setGuests = (guestsData: GuestData[]) =>
	action(GuestActionType.SetGuests, { guestsData });

export const setGuestHeaders = (tableHeaders: HeaderType) =>
	action(GuestActionType.SetGuestHeaders, { tableHeaders });

export const updateGuest = (
	projectId: string,
	guestId: string,
	id: string,
	value: any
) =>
	action(GuestActionType.UpdateGuest, {
		projectId,
		guestId,
		id,
		value,
	});

export const createGuest = (projectId: string, guestData: Partial<GuestData>) =>
	action(GuestActionType.CreateGuest, { projectId, guestData });

export const deleteGuest = (projectId: string, guestId: string) =>
	action(GuestActionType.DeleteGuest, { projectId, guestId });

export const createGuestHeaders = (projectId: string) =>
	action(GuestActionType.CreateGuestHeaders, { projectId });

const projectAction = {
	listenToGuests,
	getGuestHeaders,
	setGuests,
	setGuestHeaders,
	updateGuest,
	createGuest,
	deleteGuest,
	createGuestHeaders,
};

export type GuestAction = ActionType<typeof projectAction>;
