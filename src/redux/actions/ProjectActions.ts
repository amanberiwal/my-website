import { action, ActionType } from 'typesafe-actions';
import { Project, User } from '../../repos';

export enum ProjectActionType {
	CreateProject = 'ProjectActionType/CreateProject',
	ListenToProjects = 'ProjectActionType/ListenToProjects',
	SetProjects = 'ProjectActionType/SetProjects',
	UpdateProject = 'ProjectActionType/UpdateProject',
	MarkCompleteProject = 'ProjectActionType/MarkCompleteProject',
	SetSelectedProject = 'ProjectActionType/SetSelectedProject',
	GetSelectedProjectData = 'ProjectActionType/GetSelectedProjectData',
	SetSelectedProjectData = 'ProjectActionType/SetSelectedProjectData',
	GetUsers = 'ProjectActionType/GetUsers', //To be put in separate User Action at later Stage
	SetUsers = 'ProjectActionType/SetUsers', //To be put in separate User Action at later Stage
}

export const createProject = (clientId: string, project: Project) =>
	action(ProjectActionType.CreateProject, { clientId, project });

export const updateProject = (
	clientId: string,
	projectId: string,
	project: Project
) => action(ProjectActionType.UpdateProject, { clientId, projectId, project });

export const listenToProjects = (clientId: string) =>
	action(ProjectActionType.ListenToProjects, { clientId });

export const setProjects = (projects: Project[]) =>
	action(ProjectActionType.SetProjects, { projects });

export const setSelectedProject = (selectedProjectId: string) =>
	action(ProjectActionType.SetSelectedProject, { selectedProjectId });

export const getSelectedProjectData = (selectedProjectId: string) =>
	action(ProjectActionType.GetSelectedProjectData, { selectedProjectId });

export const setSelectedProjectData = (project: Project) =>
	action(ProjectActionType.SetSelectedProjectData, { project });

export const getUsers = () => action(ProjectActionType.GetUsers);

export const setUsers = (users: User[]) =>
	action(ProjectActionType.SetUsers, { users });

export const markCompleteProject = (projectId: string, isCompleted: boolean) =>
	action(ProjectActionType.MarkCompleteProject, {
		projectId,
		isCompleted,
	});

const projectAction = {
	createProject,
	updateProject,
	listenToProjects,
	setProjects,
	getSelectedProjectData,
	setSelectedProject,
	setSelectedProjectData,
	markCompleteProject,
	getUsers,
	setUsers,
};

export type ProjectAction = ActionType<typeof projectAction>;
