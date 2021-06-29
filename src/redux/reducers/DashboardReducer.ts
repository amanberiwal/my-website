import { produce } from 'immer';
import { NavigateFn } from '@reach/router';
import { DashboardAction, DashboardActionType } from '../actions';
import { ProjectEvent, ProjectNotification, ProjectTodo } from '../../repos';

export interface DashboardStateType {
	loading: boolean;
	navigate?: NavigateFn;
	projectEvents?: ProjectEvent[];
	projectTodos?: ProjectTodo[];
	projectNotifications?: ProjectNotification[];
}

const initialState: DashboardStateType = { loading: false };

export const DashboardStateReducer = (
	currentState = initialState,
	action: DashboardAction
) =>
	produce(currentState, (draft) => {
		switch (action.type) {
			case DashboardActionType.RelativeNavigate:
				draft.navigate = action.payload.navigate;
				break;
			case DashboardActionType.SetProjectEvents:
				draft.projectEvents = action.payload.projectEvents;
				draft.loading = false;
				break;
			case DashboardActionType.SetProjectNotifications:
				draft.projectNotifications = action.payload.projectNotifications;
				break;
			case DashboardActionType.SetProjectTodos:
				draft.projectTodos = action.payload.projectTodos;
				draft.loading = false;
				break;
			case DashboardActionType.CreateEvent:
				draft.loading = true;
				break;
			case DashboardActionType.CreateTodo:
				draft.loading = true;
				break;
			case DashboardActionType.UpdateTodo:
				draft.loading = true;
				break;
			case DashboardActionType.UpdateEvent:
				draft.loading = true;
				break;
		}
	});
