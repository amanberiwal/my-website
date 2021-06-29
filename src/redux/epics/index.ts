import { combineEpics, Epic } from 'redux-observable';
import { RootAction, RootState } from '..';
import {
	listenToAuthStateEpic,
	resetPasswordEpic,
	signInEpic,
	signOutEpic,
} from './AuthEpics';
import {
	listenToProjectsEpic,
	createProjectEpic,
	getUsersEpic,
	updateProjectEpic,
	markCompleteProjectEpic,
	getSelectedProjectDataEpic,
} from './ProjectEpics';
import {
	listenToGuestsEpic,
	getGuestHeadersEpic,
	updateGuestEpic,
	createGuestEpic,
	deleteGuestEpic,
	createGuestHeadersEpic,
} from './GuestEpics';
import {
	listenToProjectEventsEpic,
	listenToProjectNotificationsEpic,
	listenToProjectTodosEpic,
	createEventEpic,
	createTodoEpic,
	updateTodoMarkEpic,
	updateTodoEpic,
	updateEventEpic,
	deleteTodoEpic,
} from './DashboardEpics';
import { listenToHotelsEpic } from './RoomingEpics';

export default combineEpics(
	signInEpic,
	listenToAuthStateEpic,
	resetPasswordEpic,
	signOutEpic,
	listenToProjectsEpic,
	createProjectEpic,
	getUsersEpic,
	updateProjectEpic,
	markCompleteProjectEpic,
	listenToGuestsEpic,
	getGuestHeadersEpic,
	updateGuestEpic,
	createGuestEpic,
	deleteGuestEpic,
	createGuestHeadersEpic,
	getSelectedProjectDataEpic,
	listenToProjectEventsEpic,
	listenToProjectNotificationsEpic,
	listenToProjectTodosEpic,
	createEventEpic,
	createTodoEpic,
	updateTodoMarkEpic,
	listenToHotelsEpic,
	updateTodoEpic,
	deleteTodoEpic,
	updateEventEpic
);

export type RootEpic = Epic<RootAction, RootAction, RootState>;
