import { Grid, Typography, Avatar, Hidden } from '@material-ui/core';
import { AvatarGroup } from '@material-ui/lab';
import { RouteComponentProps } from '@reach/router';
import format from 'date-fns/format/index';
import React, { FC, useEffect } from 'react';
import { connect } from 'react-redux';
import { TravelRoosterCard, TodoListCard, EventCard, Calendar } from '.';
import { RootState, getSelectedProjectData, getUsers } from '../../redux';
import { Project, User } from '../../repos';
import Styles from './Dashboard.module.scss';
import { GuestListCard } from './GuestListCard';

interface DashboardProps extends RouteComponentProps {
	selectedProjectData?: Project;
	getSelectedProjectData: typeof getSelectedProjectData;
	getUsers: typeof getUsers;
	users?: User[];
	selectedProjectId: string | null;
}

const Dashboard: FC<DashboardProps> = (props) => {
	const {
		selectedProjectData,
		getSelectedProjectData,
		users,
		getUsers,
		navigate,
		selectedProjectId,
	} = props;

	// const [eventDateCards, setEventDateCards] = useState();

	useEffect(() => {
		if (!selectedProjectId) return;
		getSelectedProjectData(selectedProjectId);
	}, [selectedProjectId, getSelectedProjectData]);

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	//TODO: To be checked for better semantic meaning

	if (!selectedProjectData) {
		return null;
	}

	const { name, team } = selectedProjectData;

	//TODO: Check for Optimization
	const teamArray =
		users && team && users.filter((user) => team.includes(user.userId));

	return (
		<Grid container className={Styles.allGridContainer} spacing={0}>
			<Grid
				container
				spacing={4}
				item
				direction="column"
				className={Styles.leftCardComponent}
				xs={9}
			>
				<Grid item>
					<Typography variant="h5" color="primary" display="inline">
						{name}
					</Typography>
					<Typography
						variant="subtitle1"
						display="inline"
						className={Styles.dayHeading}
					>
						{selectedProjectData &&
							selectedProjectData.startDate &&
							`${format(
								selectedProjectData.startDate.toDate(),
								'd'
							)} Days to go`}
					</Typography>
				</Grid>

				<Grid
					container
					alignItems="center"
					item
					className={Styles.teamAvatarGroup}
				>
					<Grid item>
						<Typography
							variant="h5"
							display="inline"
							className={Styles.teamHeading}
						>
							Team
						</Typography>
					</Grid>
					<Grid item>
						<AvatarGroup max={5} spacing={0}>
							{teamArray &&
								teamArray.map((user) => (
									<Avatar
										sizes="10"
										src={user.profilePicture}
										key={user.userId}
										className={Styles.text}
									></Avatar>
								))}
						</AvatarGroup>
					</Grid>
				</Grid>

				<Grid container item spacing={2}>
					<Grid container item>
						<EventCard selectedProjectId={selectedProjectId} />
					</Grid>
					<Grid container item justify="space-between" spacing={2}>
						<Grid item xs={8} md={3} className={Styles.travelCardGrid}>
							<TravelRoosterCard />
						</Grid>
						<Grid item xs={8} md={6} className={Styles.guestCardGrid}>
							<GuestListCard navigate={navigate} />
						</Grid>
						<Grid item xs={8} md={3} className={Styles.todoCardGrid}>
							<TodoListCard selectedProjectId={selectedProjectId} />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<Grid container className={Styles.rightCardComponent} xs={3}>
				<Hidden smDown>
					<Grid item className={Styles.calendarContainer}>
						<Calendar selectedProjectId={selectedProjectId} />
					</Grid>
				</Hidden>
			</Grid>
		</Grid>
	);
};

const mapStateToProps = (state: RootState) => {
	const { selectedProjectData, users } = state.Project;
	return { selectedProjectData, users };
};

export default connect(mapStateToProps, { getSelectedProjectData, getUsers })(
	Dashboard
);

//TODO: Create Common SCSS file for EventCard,TodoList and rest of similar code in dashboard cards
