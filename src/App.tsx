import React, { FC, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { Project, Routes } from './repos';
import { listenToAuthState, RootState, setError, setMessage } from './redux';
import { User } from './repos';
import Styles from './App.module.scss';
import { LocationProvider, Router } from '@reach/router';
import { Navbar, Toast, Loader, Variant, LoaderSize } from './components';
import {
	ForgotPassword,
	SignIn,
	ProjectSelection,
	GuestList,
	Dashboard,
	RoomingList,
	ProjectDashboard,
} from './containers';
import {
	MuiThemeProvider,
	createMuiTheme,
	StylesProvider,
} from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: '#a42167',
		},
	},
	typography: {
		fontFamily: [
			'Source Sans Pro',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"',
		].join(','),
	},
});

interface AppProps {
	currentUser?: User | null;
	listenToAuthState: typeof listenToAuthState;
	error?: string;
	message?: string;
}

const App: FC<AppProps> = (props) => {
	const { listenToAuthState, currentUser, error, message } = props;

	useEffect(() => {
		listenToAuthState();
	}, [listenToAuthState]);

	const authRoutes = useMemo(
		() => [
			<SignIn default key={Routes.SignIn} path={Routes.SignIn}></SignIn>,
			<ForgotPassword
				key={Routes.ForgotPassword}
				path={Routes.ForgotPassword}
			></ForgotPassword>,
		],
		[]
	);

	const authenticatedRoutes = useMemo(
		() => [
			<ProjectSelection
				key={Routes.ProjectSelection}
				default
				path={Routes.ProjectSelection}
			></ProjectSelection>,
			<ProjectDashboard
				key={Routes.ProjectDashboard}
				path={`${Routes.ProjectDashboard}/*`}
			></ProjectDashboard>,
		],
		[]
	);

	if (currentUser === undefined) {
		return (
			<div className={Styles.loader}>
				<Loader size={LoaderSize.lg} />
			</div>
		);
	}

	return (
		<StylesProvider injectFirst>
			<MuiThemeProvider theme={theme}>
				<Box
					className={
						currentUser === null ? undefined : Styles.authenticated_Left_Margin
					}
				>
					{currentUser === null ? null : <Navbar />}
					<Router>
						{currentUser === null ? authRoutes : authenticatedRoutes}
					</Router>
				</Box>
				<Toast message={message} variant={Variant.Success}></Toast>
				<Toast message={error} variant={Variant.Error}></Toast>
			</MuiThemeProvider>
		</StylesProvider>
	);
};

const mapStateToProps = (state: RootState) => {
	const { currentUser, error, message } = state.Auth;
	return { currentUser, error, message };
};

export default connect(mapStateToProps, {
	listenToAuthState,
	setError,
	setMessage,
})(App);
