import { Container, Grid, Typography } from '@material-ui/core';
import { RouteComponentProps } from '@reach/router';
import React, { FC, useState, useEffect } from 'react';
import { Searchbar, CustomButton } from '../../components';
import Styles from './ProjectSelection.module.scss';
import { AddRounded } from '@material-ui/icons';
import { CreateProject, RenderProjectCards } from '.';
import { listenToProjects, RootState, getUsers } from '../../redux';
import { connect } from 'react-redux';
import { Project, User } from '../../repos';

interface ProjectSelectionProps extends RouteComponentProps {
	projects: Project[] | undefined;
	currentUser: User | null | undefined;
	listenToProjects: typeof listenToProjects;
	getUsers: typeof getUsers;
}

const ProjectSelection: FC<ProjectSelectionProps> = (props) => {
	const { projects, listenToProjects, currentUser, getUsers } = props;

	const [openModal = false, setOpenModal] = useState<boolean>();
	const [query = '', setQuery] = useState<string>();

	useEffect(() => {
		if (!currentUser) {
			return;
		}
		listenToProjects(currentUser.clientId);
	}, [currentUser, listenToProjects]);

	useEffect(() => {
		getUsers();

		//This Project ID is captured for table components, as to it is not lost on refresh //TODO:Implement only localStorageSolution
		sessionStorage.removeItem('selectedProjectId');
	}, [getUsers]);

	const openModalHandler = () => setOpenModal(true);

	return (
		<Container className={Styles.authenticated}>
			<Grid container item spacing={6} alignItems="center">
				<Grid item>
					<Typography variant="h4" color="primary">
						Projects
					</Typography>
				</Grid>
				<Grid item>
					<Searchbar
						onChange={(event) => setQuery(event.currentTarget.value)}
						placeholder="Search Projects"
						value={query}
					/>
				</Grid>
			</Grid>
			<RenderProjectCards query={query} />
			<Grid container item justify="center">
				<Grid item className={Styles.buttonContainer}>
					<CustomButton
						startIcon={<AddRounded />}
						onClick={openModalHandler}
						disabled={projects === undefined}
					>
						Create Project
					</CustomButton>
				</Grid>
				<CreateProject openModal={openModal} setOpenModal={setOpenModal} />
			</Grid>
		</Container>
	);
};

const mapStateToProps = (state: RootState) => {
	const { currentUser } = state.Auth;
	const { projects } = state.Project;
	return { projects, currentUser };
};

export default connect(mapStateToProps, { listenToProjects, getUsers })(
	ProjectSelection
);
