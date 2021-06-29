// import { of } from 'rxjs';
import { of } from 'rxjs';
import {
	catchError,
	filter,
	map,
	mapTo,
	switchMap,
	withLatestFrom,
} from 'rxjs/operators';
import { isOfType } from 'typesafe-actions';
import { RootEpic } from '.';
import {
	DashboardActionType,
	setError,
	setMessage,
	setProjectEvents,
	setProjectNotifications,
	setProjectTodos,
} from '..';
import {
	createEvent,
	createTodo,
	listenToProjectEvents,
	listenToProjectNotifications,
	listenToProjectTodos,
	updateTodo,
	updateTodoMark,
	deleteTodo,
	updateEvent,
} from '../../repos';

export const listenToProjectEventsEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(DashboardActionType.ListenToProjectEvents)),
		withLatestFrom(store),
		switchMap(([_, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User not set, Please connect support'));
			}
			return listenToProjectEvents(currentUser.clientId).pipe(
				map((projectEvents) => setProjectEvents(projectEvents)),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const listenToProjectTodosEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(DashboardActionType.ListenToProjectTodos)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User not set, Please connect support'));
			}
			const { projectId } = action.payload;
			return listenToProjectTodos(currentUser.clientId, projectId).pipe(
				map((projectTodos) => setProjectTodos(projectTodos)),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const listenToProjectNotificationsEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(DashboardActionType.ListenToProjectNotifications)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId } = action.payload;
			return listenToProjectNotifications(clientId, projectId).pipe(
				map((projectNotifications) =>
					setProjectNotifications(projectNotifications)
				),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const createEventEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(DashboardActionType.CreateEvent)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { event } = action.payload;
			return createEvent(clientId, event).pipe(
				mapTo(setMessage('Event Created Successfully 😁')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const createTodoEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(DashboardActionType.CreateTodo)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId, todo } = action.payload;
			return createTodo(clientId, projectId, todo).pipe(
				mapTo(setMessage('Todo Created Successfully 😁')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const updateEventEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(DashboardActionType.UpdateEvent)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId, eventId, event } = action.payload;
			return updateEvent(clientId, projectId, eventId, event).pipe(
				mapTo(setMessage('Event Updated Successfully 😁')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const updateTodoMarkEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(DashboardActionType.UpdateTodoMark)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId, todoId, isCompleted } = action.payload;
			return updateTodoMark(clientId, projectId, todoId, isCompleted).pipe(
				mapTo(setMessage('Todo Updated Successfully 😁')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const updateTodoEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(DashboardActionType.UpdateTodo)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId, todoId, todo } = action.payload;
			return updateTodo(clientId, projectId, todoId, todo).pipe(
				mapTo(setMessage('Todo Updated Successfully 😁')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const deleteTodoEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(DashboardActionType.DeleteTodo)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId, todoId } = action.payload;
			return deleteTodo(clientId, projectId, todoId).pipe(
				mapTo(setMessage('Todo Deleted Successfully 😁')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};
