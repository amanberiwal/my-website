import { combineReducers } from 'redux';
import { AuthStateReducer, AuthStateType } from './AuthReducer';
import { ProjectStateReducer, ProjectStateType } from './ProjectReducer';
import { GuestStateReducer, GuestStateType } from './GuestReducer';
import { DashboardStateReducer, DashboardStateType } from './DashboardReducer';
import { RoomingStateReducer, RoomingStateType } from './RoomingReducer';

export const combinedReducer = combineReducers({
	Auth: AuthStateReducer,
	Project: ProjectStateReducer,
	Guest: GuestStateReducer,
	Dashboard: DashboardStateReducer,
	Rooming: RoomingStateReducer,
});

export interface RootState {
	Auth: AuthStateType;
	Project: ProjectStateType;
	Guest: GuestStateType;
	Dashboard: DashboardStateType;
	Rooming: RoomingStateType;
}
