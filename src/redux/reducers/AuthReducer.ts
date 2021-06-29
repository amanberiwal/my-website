import { produce } from 'immer';
import { User } from '../../repos';
import { AuthAction, AuthActionType } from '../actions';

export interface AuthStateType {
	readonly loading: boolean;
	readonly message?: string;
	readonly error?: string;
	readonly currentUser?: User | null;
}

const initialState: AuthStateType = { loading: false };

export const AuthStateReducer = (
	currentState = initialState,
	action: AuthAction
) =>
	produce(currentState, (draft) => {
		switch (action.type) {
			case AuthActionType.SignIn:
				draft.loading = true;
				break;
			case AuthActionType.SetCurrentUser:
				draft.currentUser = action.payload.currentUser;
				draft.loading = false;
				break;
			case AuthActionType.SetError:
				draft.error = action.payload.error;
				draft.loading = false;
				break;
			case AuthActionType.SetMessage:
				draft.message = action.payload.message;
				break;
			case AuthActionType.ResetPassword:
				draft.loading = true;
				break;
		}
		return draft;
	});
