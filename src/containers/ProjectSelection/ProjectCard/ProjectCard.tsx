import {
	Avatar,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	createStyles,
	Divider,
	Fade,
	Grid,
	IconButton,
	makeStyles,
	Menu,
	MenuItem,
} from '@material-ui/core';
import { MoreVert, LocationOnOutlined, PersonOutlineOutlined, DateRange } from '@material-ui/icons';
import { AvatarGroup } from '@material-ui/lab';
import { navigate } from '@reach/router';
import moment from 'moment';
import React, {
	FC,
	Fragment,
	MouseEventHandler,
	useCallback,
	useMemo,
	useState,
} from 'react';
import { connect } from 'react-redux';
import {
	RootState,
	markCompleteProject,
	setSelectedProject,
} from '../../../redux';
import { CreateProject } from '..';
import { Project, Routes, User } from '../../../repos';
import Styles from './ProjectCard.module.scss';

interface ProjectCardProps extends Project {
	currentUser?: User | null;
	users?: User[];
	markCompleteProject: typeof markCompleteProject;
	setSelectedProject: typeof setSelectedProject;
}

const useStyles = makeStyles(() =>
	createStyles({
		card: {
			zIndex: 1,
			position: 'relative',
			borderRadius: '1rem',
			width: '16rem',
			transition: '0.4s',
			height: '100%',
			'&:active': {
				bottom: -6,
			},
		},
	})
);
const ProjectCard: FC<ProjectCardProps> = (props) => {
	const {
		color,
		name,
		startDate,
		projectId,
		projectContact,
		location,
		markCompleteProject,
		currentUser,
		isCompleted,
		users,
		team,
		setSelectedProject,
	} = props;

	const teamArray = useMemo(() => {
		if (!users || !team) {
			return;
		}
		return users.filter((user) => team.includes(user.userId));
	}, [team, users]);

	const classes = useStyles();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [openModal, setOpenModal] = useState(false);

	const expandProjectHandler = useCallback(() => {
		if (!projectId) {
			return;
		}
		sessionStorage.setItem('selectedProjectId', projectId);
		setSelectedProject(projectId);
		navigate(Routes.ProjectDashboard);
	}, [projectId, setSelectedProject]);

	const moreActionsHandler: MouseEventHandler<HTMLButtonElement> = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const openModalHandler: MouseEventHandler<HTMLLIElement> = (event) => {
		setOpenModal(true);
		setAnchorEl(null);
	};

	const markCompleteHandler: MouseEventHandler<HTMLLIElement> = (event) => {
		if (!currentUser || !projectId) {
			return;
		}
		markCompleteProject(projectId, true);
	};

	return (
		<Card className={classes.card} style={{ backgroundColor: color }}>
			<CardHeader
				action={
					isCompleted ? null : (
						<Fragment>
							<IconButton
								aria-label="settings"
								onClick={moreActionsHandler}
								className={Styles.pointer}
							>
								<MoreVert />
							</IconButton>
							<Menu
								id="fade-menu"
								anchorEl={anchorEl}
								keepMounted
								open={Boolean(anchorEl)}
								onClose={() => setAnchorEl(null)}
								TransitionComponent={Fade}
								classes={{ paper: Styles.menuContainer }}
							>
								<MenuItem onClick={openModalHandler}>• Edit Project</MenuItem>
								<CreateProject
									openModal={openModal}
									setOpenModal={setOpenModal}
									isUpdated={openModal}
									project={props}
								/>
								<MenuItem onClick={markCompleteHandler}>
									• Mark as Complete
								</MenuItem>
							</Menu>
						</Fragment>
					)
				}
				title={name}
			/>
			<CardContent onClick={expandProjectHandler} className={Styles.pointer}>
				<Grid container spacing={2}>
					<Grid item>
						<DateRange />
					</Grid>
					<Grid item>{moment(startDate?.toDate()).format('Do MMMM YYYY')}</Grid>
				</Grid>
				<Grid container spacing={2}>
					<Grid item>
						<LocationOnOutlined />
					</Grid>
					<Grid item>{location}</Grid>
				</Grid>
				<Grid container spacing={2}>
					<Grid item>
						<PersonOutlineOutlined />
					</Grid>
					<Grid item>{projectContact.name}</Grid>
				</Grid>
				<Divider variant="middle" />
				<Grid container spacing={2} direction="column">
					<Grid item>Team</Grid>
					<Grid item>
						<AvatarGroup spacing={0}>
							{teamArray &&
								teamArray.map((user) => (
									<Avatar src={user.profilePicture} key={user.userId}></Avatar>
								))}
						</AvatarGroup>
					</Grid>
				</Grid>
			</CardContent>
			<CardActions disableSpacing></CardActions>
		</Card>
	);
};

const mapStateToProps = (state: RootState) => {
	const { currentUser } = state.Auth;
	const { users } = state.Project;
	return { currentUser, users };
};

export default connect(mapStateToProps, {
	markCompleteProject,
	setSelectedProject,
})(ProjectCard);
