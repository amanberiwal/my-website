import { RouteComponentProps, Router } from '@reach/router';
import React, { useMemo, FC, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dashboard, GuestList, RoomingList } from '..';
import {
	relativeNavigate,
	listenToProjectEvents,
	listenToProjectTodos,
	listenToProjectNotifications,
	listenToGuests,
	getGuestHeaders,
} from '../../redux';
import { Routes } from '../../repos';

interface ProjectDashboardProps extends RouteComponentProps {
	relativeNavigate: typeof relativeNavigate;
	listenToProjectNotifications: typeof listenToProjectNotifications;
	listenToProjectEvents: typeof listenToProjectEvents;
	listenToProjectTodos: typeof listenToProjectTodos;
	listenToGuests: typeof listenToGuests;
	getGuestHeaders: typeof getGuestHeaders;
}
const ProjectDashboard: FC<ProjectDashboardProps> = (props) => {
	const {
		navigate,
		relativeNavigate,
		listenToProjectEvents,
		listenToProjectTodos,
		listenToProjectNotifications,
		listenToGuests,
		getGuestHeaders,
	} = props;

	const selectedProjectId = sessionStorage.getItem('selectedProjectId');

	useEffect(() => {
		relativeNavigate(navigate);
	}, [relativeNavigate, navigate]);

	//ProjectEvent Listener
	useEffect(() => {
		listenToProjectEvents();
	}, [listenToProjectEvents]);

	//ProjectTodo Listener
	useEffect(() => {
		if (!selectedProjectId) return;
		listenToProjectTodos(selectedProjectId);
	}, [listenToProjectTodos, selectedProjectId]);

	//ProjectNotifications Listener
	useEffect(() => {
		if (!selectedProjectId) return;
		listenToProjectNotifications(selectedProjectId);
	}, [listenToProjectNotifications, selectedProjectId]);

	//Guest Data Listeners
	useEffect(() => {
		if (!selectedProjectId) return;
		listenToGuests(selectedProjectId);
	}, [listenToGuests, selectedProjectId]);

	useEffect(() => {
		if (!selectedProjectId) return;
		getGuestHeaders(selectedProjectId);
	}, [getGuestHeaders, selectedProjectId]);

	const dashboardRoutes = useMemo(() => {
		return [
			<Dashboard
				key={Routes.Dashboard}
				default
				path={Routes.Dashboard}
				selectedProjectId={selectedProjectId}
			/>,
			<GuestList
				key={Routes.GuestList}
				path={Routes.GuestList}
				selectedProjectId={selectedProjectId}
			></GuestList>,
			<RoomingList
				key={Routes.RoomingList}
				path={Routes.RoomingList}
				selectedProjectId={selectedProjectId}
			></RoomingList>,
		];
	}, [selectedProjectId]);

	return <Router>{dashboardRoutes}</Router>;
};

export default connect(null, {
	relativeNavigate,
	listenToProjectEvents,
	listenToProjectTodos,
	listenToProjectNotifications,
	listenToGuests,
	getGuestHeaders,
})(ProjectDashboard);
//TODO: Make navigate pass to Drawer
