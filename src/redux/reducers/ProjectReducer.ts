import { produce } from 'immer';
import { Project, User } from '../../repos';
import { ProjectAction, ProjectActionType } from '../actions';

export interface ProjectStateType {
	readonly loading: boolean;
	readonly projects?: Project[];
	readonly selectedProjectData?: Project;
	readonly selectedProjectId?: string;
	readonly users?: User[]; //to be moved into UserReducer at later stage
}

const initialState: ProjectStateType = { loading: false };

export const ProjectStateReducer = (
	currentState = initialState,
	action: ProjectAction
) =>
	produce(currentState, (draft) => {
		switch (action.type) {
			case ProjectActionType.ListenToProjects:
				draft.loading = true;
				break;
			case ProjectActionType.SetProjects:
				draft.projects = action.payload.projects;
				draft.loading = false;
				break;
			case ProjectActionType.SetUsers:
				draft.users = action.payload.users;
				draft.loading = false;
				break;
			case ProjectActionType.CreateProject:
				draft.loading = true;
				break;
			case ProjectActionType.UpdateProject:
				draft.loading = true;
				break;
			case ProjectActionType.SetSelectedProject:
				draft.selectedProjectId = action.payload.selectedProjectId;
				break;
			case ProjectActionType.GetSelectedProjectData:
				draft.loading = true;
				break;
			case ProjectActionType.SetSelectedProjectData:
				draft.selectedProjectData = action.payload.project;
				draft.loading = false;
				break;
		}
		return draft;
	});
