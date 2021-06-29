import { action, ActionType } from 'typesafe-actions';
import { User } from '../../repos';

export enum AuthActionType {
	SignIn = 'AuthActionType/SignIn',
	ListenToAuthState = 'AuthActionType/ListenToAuthState',
	SetCurrentUser = 'AuthActionType/SetCurrentUser',
	SetMessage = 'AuthActionType/SetMessage',
	SetError = 'AuthActionType/SetError',
	ResetPassword = 'AuthActionType/ResetPassword',
	SignOut = 'AuthActionType/SignOut',
}

export const signIn = (email: string, password: string) =>
	action(AuthActionType.SignIn, { email, password });

export const setMessage = (message?: string) =>
	action(AuthActionType.SetMessage, { message });

export const setError = (error?: string) =>
	action(AuthActionType.SetError, { error });

export const listenToAuthState = () => action(AuthActionType.ListenToAuthState);

export const setCurrentUser = (currentUser: User | null) =>
	action(AuthActionType.SetCurrentUser, { currentUser });

export const resetPassword = (email: string) =>
	action(AuthActionType.ResetPassword, { email });

export const signOut = () => action(AuthActionType.SignOut);

const authActions = {
	signIn,
	setMessage,
	setError,
	listenToAuthState,
	setCurrentUser,
	resetPassword,
	signOut,
};

export type AuthAction = ActionType<typeof authActions>;
