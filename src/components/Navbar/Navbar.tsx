import React, { useState, FC, Fragment } from 'react';
import {
	AppBar,
	Toolbar,
	Typography,
	Menu,
	IconButton,
	MenuItem,
	createStyles,
	makeStyles,
	Theme,
	Avatar,
} from '@material-ui/core';
import { NotificationsNoneRounded, ExpandMore } from '@material-ui/icons';
import { connect } from 'react-redux';
import { RootState, signOut } from '../../redux';
import { Project, User } from '../../repos';
import Styles from './Navbar.module.scss';
import { Drawer } from '../Drawer';

interface NavbarProps {
	currentUser?: User | null;
	signOut: typeof signOut;
	projects: Project[] | undefined;
}

interface StyleAppBar {}

const useStyles = makeStyles<Theme, StyleAppBar>((theme) => {
	return createStyles({
		appBar1: {
			background: '#ffff',
			boxShadow: 'none',
		},
	});
});

const Navbar: FC<NavbarProps> = (props) => {
	const { currentUser, signOut, projects } = props;

	const classes = useStyles();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<div>
			<AppBar position="static" className={classes.appBar1}>
				<Toolbar className={Styles.toolbar}>
					{/* {!currentUser && (
            <Typography variant="h3" className={Styles.logoText}>
              The Planning Company
            </Typography>
          )} */}
					{currentUser && (
						<div className={Styles.authContainer}>
							<IconButton
								aria-label="notifications"
								aria-controls="menu-appbar"
								aria-haspopup="true"
							>
								<NotificationsNoneRounded color="primary" />
							</IconButton>
							<IconButton
								aria-label="account of current user"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleMenu}
							>
								<Avatar alt="Profile" src="/static/images/avatar/1.jpg" />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								keepMounted
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={open}
								onClose={handleClose}
							>
								<MenuItem onClick={handleClose} className={Styles.menuItems}>Profile</MenuItem>
								<MenuItem onClick={handleClose} className={Styles.menuItems}>My account</MenuItem>
								<MenuItem onClick={signOut} className={Styles.menuItems}>Sign Out</MenuItem>
							</Menu>
							<Typography  className={Styles.menuItems} color="primary">{currentUser.name}</Typography>
							<IconButton
								aria-label="drop-down"
								aria-controls="menu-appbar"
								aria-haspopup="true"
								onClick={handleMenu}
							>
								<ExpandMore color="primary" />
							</IconButton>
						</div>
					)}
				</Toolbar>
			</AppBar>

			{currentUser && <Drawer projects={projects} signOut={signOut}></Drawer>}
		</div>
	);
};

const mapStateToProps = (state: RootState) => {
	const { currentUser } = state.Auth;
	const { projects } = state.Project;
	return { currentUser, projects };
};

export default connect(mapStateToProps, { signOut })(Navbar);
