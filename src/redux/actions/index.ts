import { AuthAction } from './AuthActions';
import { ProjectAction } from './ProjectActions';
import { GuestAction } from './GuestActions';
import { DashboardAction } from './DashboardActions';
import { RoomingAction } from './RoomingActions';

export * from './AuthActions';
export * from './ProjectActions';
export * from './GuestActions';
export * from './DashboardActions';
export * from './RoomingActions';

export type RootAction =
	| AuthAction
	| ProjectAction
	| GuestAction
	| DashboardAction
	| RoomingAction;
