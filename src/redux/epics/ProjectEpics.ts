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
	createProject,
	getSelectedProjectData,
	getUsers,
	listenToProjects,
	markCompleteProject,
	updateProject,
} from '../../repos';
import {
	ProjectActionType,
	setError,
	setMessage,
	setProjects,
	setSelectedProjectData,
	setUsers,
} from '../actions';

export const listenToProjectsEpic: RootEpic = (action$) => {
	return action$.pipe(
		filter(isOfType(ProjectActionType.ListenToProjects)),
		switchMap((action) => {
			const { clientId } = action.payload;
			return listenToProjects(clientId).pipe(
				map((projects) => setProjects(projects)),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const getSelectedProjectDataEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(ProjectActionType.GetSelectedProjectData)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { selectedProjectId } = action.payload;
			return getSelectedProjectData(clientId, selectedProjectId).pipe(
				map((project) => setSelectedProjectData(project)),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const getUsersEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(ProjectActionType.GetUsers)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			return getUsers(clientId).pipe(
				map((users) => setUsers(users)),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const createProjectEpic: RootEpic = (action$) => {
	return action$.pipe(
		filter(isOfType(ProjectActionType.CreateProject)),
		switchMap((action) => {
			const { clientId, project } = action.payload;
			return createProject(clientId, project).pipe(
				mapTo(setMessage('Project Created Successfully 😁')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const updateProjectEpic: RootEpic = (action$) => {
	return action$.pipe(
		filter(isOfType(ProjectActionType.UpdateProject)),
		switchMap((action) => {
			const { clientId, projectId, project } = action.payload;
			return updateProject(clientId, projectId, project).pipe(
				mapTo(setMessage('Project Updated Successfully 😁')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};

export const markCompleteProjectEpic: RootEpic = (action$, store) => {
	return action$.pipe(
		filter(isOfType(ProjectActionType.MarkCompleteProject)),
		withLatestFrom(store),
		switchMap(([action, state]) => {
			const { currentUser } = state.Auth;
			if (!currentUser) {
				return of(setError('User is not set correctly!'));
			}
			const { clientId } = currentUser;
			const { projectId, isCompleted } = action.payload;
			return markCompleteProject(clientId, projectId, isCompleted).pipe(
				mapTo(setMessage('Project Marked Completed 🥳')),
				catchError((error) => of(setError(error.message)))
			);
		})
	);
};
