import { NavigateFn } from '@reach/router';
import { action, ActionType } from 'typesafe-actions';
import { ProjectEvent, ProjectNotification, ProjectTodo } from '../../repos';

export enum DashboardActionType {
	RelativeNavigate = 'DashboardActionType/RelativeNavigate',
	ListenToProjectEvents = 'DashboardActionType/ListenToProjectEvents',
	SetProjectEvents = 'DashboardActionType/SetProjectEvents',
	ListenToProjectTodos = 'DashboardActionType/ListenToProjectTodos',
	SetProjectTodos = 'DashboardActionType/SetProjectTodos',
	ListenToProjectNotifications = 'DashboardActionType/ListenToProjectNotifications',
	SetProjectNotifications = 'DashboardActionType/SetProjectNotifications',
	CreateEvent = 'DashboardActionType/CreateEvent',
	UpdateEvent = 'DashboardActionType/UpdateEvent',
	CreateTodo = 'DashboardActionType/CreateTodo',
	UpdateTodo = 'DashboardActionType/UpdateTodo',
	UpdateTodoMark = 'DashboardActionType/UpdateTodoMark',
	DeleteTodo = 'DashboardActionType/DeleteTodo',
}

export const relativeNavigate = (navigate: NavigateFn | undefined) =>
	action(DashboardActionType.RelativeNavigate, { navigate });

export const listenToProjectEvents = () =>
	action(DashboardActionType.ListenToProjectEvents);

export const listenToProjectTodos = (projectId: string) =>
	action(DashboardActionType.ListenToProjectTodos, { projectId });

export const listenToProjectNotifications = (projectId: string) =>
	action(DashboardActionType.ListenToProjectNotifications, { projectId });

export const createEvent = (event: ProjectEvent) =>
	action(DashboardActionType.CreateEvent, { event });

export const updateEvent = (
	projectId: string,
	eventId: string,
	event: Partial<ProjectEvent>
) => action(DashboardActionType.UpdateEvent, { projectId, eventId, event });

export const createTodo = (projectId: string, todo: ProjectTodo) =>
	action(DashboardActionType.CreateTodo, { projectId, todo });

export const updateTodo = (
	projectId: string,
	todoId: string,
	todo: Partial<ProjectTodo>
) => action(DashboardActionType.UpdateTodo, { projectId, todoId, todo });

export const deleteTodo = (projectId: string, todoId: string) =>
	action(DashboardActionType.DeleteTodo, { projectId, todoId });

export const updateTodoMark = (
	projectId: string,
	todoId: string,
	isCompleted: boolean
) =>
	action(DashboardActionType.UpdateTodoMark, {
		projectId,
		todoId,
		isCompleted,
	});

export const setProjectEvents = (projectEvents: ProjectEvent[]) =>
	action(DashboardActionType.SetProjectEvents, { projectEvents });

export const setProjectTodos = (projectTodos: ProjectTodo[]) =>
	action(DashboardActionType.SetProjectTodos, { projectTodos });

export const setProjectNotifications = (
	projectNotifications: ProjectNotification[]
) =>
	action(DashboardActionType.SetProjectNotifications, {
		projectNotifications,
	});

const dashboardActions = {
	relativeNavigate,
	listenToProjectNotifications,
	listenToProjectTodos,
	listenToProjectEvents,
	setProjectTodos,
	setProjectNotifications,
	setProjectEvents,
	createEvent,
	createTodo,
	updateTodoMark,
	updateTodo,
	deleteTodo,
	updateEvent,
};

export type DashboardAction = ActionType<typeof dashboardActions>;
