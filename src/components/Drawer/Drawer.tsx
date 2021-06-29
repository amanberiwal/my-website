//To be Optimised & refactor required

import React, { FC, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useStyles } from './styles';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import FlightTakeoffOutlinedIcon from '@material-ui/icons/FlightTakeoffOutlined';
import { Project, Routes } from '../../repos';
import Styles from './Drawer.module.scss';
import { RootState, signOut } from '../../redux';
import { useLocation } from 'react-use';
// import { navigate } from '@reach/router';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import UnfoldMoreOutlinedIcon from '@material-ui/icons/UnfoldMoreOutlined';
import MenuItem from '@material-ui/core/MenuItem';
import { Link } from '@material-ui/core';

import HotelOutlinedIcon from '@material-ui/icons/HotelOutlined'; //BusinessRounded optional icon
import ContactPhoneOutlinedIcon from '@material-ui/icons/ContactPhoneOutlined';
import { connect } from 'react-redux';
import { NavigateFn } from '@reach/router';

interface DrawerProps {
	projects: Project[] | undefined;
	signOut: typeof signOut;
	navigate?: NavigateFn;
}

const pageNames = [
	Routes.Dashboard,
	Routes.GuestList,
	Routes.TravelRoaster,
	Routes.RoomingList,
	Routes.VendorList,
];
const pageNameIcons = [
	<DashboardOutlinedIcon />,
	<ListAltOutlinedIcon />,
	<FlightTakeoffOutlinedIcon />,
	<HotelOutlinedIcon />,
	<ContactPhoneOutlinedIcon />,
];

export const MiniDrawer: FC<DrawerProps> = (props) => {
	const { projects, signOut, navigate } = props;

	const classes = useStyles();
	const theme = useTheme();
	const location = useLocation();
	const page = location.pathname;

	const [open, setOpen] = useState(false);
	const selectedProjectId = sessionStorage.getItem('selectedProjectId');
	// console.log(projects);
	const [currentProjectName, setCurrentProjectName] = useState(
		// selectedProjectId
		//   ? projects?.filter((prj) => prj.projectId === selectedProjectId)[0].name
		// :
		''
	);

	// console.log(currentProjectName, selectedProjectId);

	// useEffect(() => {
	//   if (projects && page !== Routes.ProjectSelection && page !== Routes.Index) {
	//     setCurrentProjectName(
	//       projects?.filter((prj) => prj.projectId === selectedProjectId)[0].name
	//     );
	//   }
	// }, [projects]);

	//TODO: Why this Code ?
	// useEffect(() => {
	// 	if (projects) {
	// 		sessionStorage.setItem(
	// 			'selectedProjectId',
	// 			projects.filter((prj) => prj.name === currentProjectName)[0]
	// 				.projectId || ''
	// 		);
	// 	}
	// }, [currentProjectName, projects]);

	const handleDrawerOpen = () => setOpen(true);
	const handleDrawerClose = () => setOpen(false);
	// const handleProjectChange = (
	// 	event: React.ChangeEvent<{ value: unknown }>
	// ) => {
	// 	setCurrentProjectName(event.target.value as string);
	// };

	const navigateToPage = (pageText: string) => {
		const pageTextFormatted = pageText.replace(' ', '-');
		console.log(`navigate`, navigate);
		if (navigate !== undefined) navigate(pageTextFormatted.toLowerCase());
	};

	return (
		<div className={Styles.root}>
			<CssBaseline />
			<Drawer
				variant="permanent"
				className={clsx(classes.drawer, {
					[classes.drawerOpen]: open,
					[classes.drawerClose]: !open,
				})}
				classes={{
					paper: clsx({
						[classes.drawerOpen]: open,
						[classes.drawerClose]: !open,
					}),
				}}
			>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					onClick={handleDrawerOpen}
					edge="start"
					className={clsx(classes.menuButton, {
						[classes.hide]: open,
					})}
				>
					<MenuIcon />
				</IconButton>
				{open && (
					<React.Fragment>
						<div className={classes.toolbar}>
							<IconButton
								onClick={handleDrawerClose}
								className={classes.listItemIcon}
							>
								{theme.direction === 'rtl' ? (
									<ChevronRightIcon />
								) : (
									<ChevronLeftIcon />
								)}
							</IconButton>
						</div>
						<Typography
							variant="subtitle1"
							align="center"
							className={classes.tpcHeading}
						>
							<Link
								href="/"
								color="inherit"
								underline="none"
								onClick={() => navigateToPage('/')}
							>
								The Planning Company
							</Link>
						</Typography>
					</React.Fragment>
				)}
				<div className={Styles.drawerWrapper}>
					<div className={Styles.firstDiv}>
						{/* Add page === Routes.Index condition for removal at Project Selection */}
						{page !== Routes.Index && (
							<React.Fragment>
								{/* <Select
                  value={currentProjectName}
                  onChange={handleProjectChange}
                  IconComponent={UnfoldMoreOutlinedIcon}
                  disableUnderline
                  classes={{
                    root: classes.projectSelection,
                    select: classes.projectSelection,
                    icon: classes.icon,
                  }}
                >
                  {projects?.map((prj, index) => (
                    <MenuItem value={prj.name} key={index}>
                      {prj.name}
                    </MenuItem>
                  ))}
                </Select> */}
								<List>
									{pageNames.map((text, index) => {
										const pagePathSplit = page && page.split('/');
										const selected =
											pagePathSplit && pagePathSplit.includes(text)
												? true
												: undefined;
										const drawerItemText = text.replace('-', ' ');
										return (
											<ListItem
												button
												// component={Link} to={`/${text}`}
												key={drawerItemText}
												classes={{
													root: classes.listRoot,
													selected: classes.selected,
												}}
												selected={selected}
												onClick={() => navigateToPage(drawerItemText)}
											>
												<ListItemIcon
													className={
														selected
															? classes.listItemIconSelected
															: classes.listItemIcon
													}
												>
													{pageNameIcons[index]}
												</ListItemIcon>
												<ListItemText
													classes={{ primary: classes.listItemText }}
													primary={drawerItemText}
												/>
											</ListItem>
										);
									})}
								</List>
							</React.Fragment>
						)}
					</div>
					<div>
						{/* <List>
              <ListItem
                button
                key={"Logout"}
                classes={{ root: classes.listRoot, selected: classes.selected }}
                onClick={logOut}
              >
                <ListItemIcon className={classes.listItemIcon}>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText
                  classes={{ primary: classes.listItemText }}
                  primary={"Logout"}
                />
              </ListItem>
            </List> */}
					</div>
				</div>
			</Drawer>
		</div>
	);
};

const mapStateToProps = (state: RootState) => {
	const { navigate } = state.Dashboard;
	return { navigate };
};

export default connect(mapStateToProps)(MiniDrawer);
