import React, { FC, Fragment, useState } from 'react';
import { AddUserDialog, GlobalFilter, SendInvitesDialog } from '..';
import clsx from 'clsx';
import {
	Delete as DeleteIcon,
	Menu as MenuIcon,
	GroupAdd as GroupAddIcon,
	AccountCircleOutlined as AccountCircleOutlinedIcon,
} from '@material-ui/icons';
import {
	Toolbar,
	Typography,
	Tooltip,
	lighten,
	makeStyles,
	IconButton,
	List,
	ListItemText,
	ListItemSecondaryAction,
	Checkbox,
	ListItem,
	Popover,
	Box,
	Divider,
	// CircularProgress,
} from '@material-ui/core';
import Styles from './TableToolbar.module.scss';
import { DataType, GuestData, Project, TableType } from '../../../repos';
import { updateGuest } from '../../../redux';
import { IndeterminateCheckbox } from '..';
import { CustomButton } from '../..';
import { connect } from 'react-redux';
import format from 'date-fns/format';

interface TableToolbarProps {
	numSelected: number;
	deleteUserHandler: (event: any) => void;
	setGlobalFilter: (event: string | undefined) => void;
	preGlobalFilteredRows: [];
	globalFilter: string;
	selectedRowIds: number[];
	selectedProjectId: string;
	guestData: GuestData[];
	projects: Project[];
	selectedRowArray: GuestData[];
	getToggleHideAllColumnsProps: any;
	allColumns: any;
	tableType: TableType;
	updateGuest: typeof updateGuest;
}

const useToolbarStyles = makeStyles((theme) => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
		justifyContent: 'flex-end !important',
		gap: '10px',
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85),
			  }
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark,
			  },
	title: {
		flex: '1 1 50%',
	},
}));

const TableToolbar: FC<TableToolbarProps> = (props) => {
	const classes = useToolbarStyles();
	const {
		numSelected,
		deleteUserHandler,
		preGlobalFilteredRows,
		setGlobalFilter,
		globalFilter,
		selectedProjectId,
		guestData,
		projects,
		selectedRowArray,
		getToggleHideAllColumnsProps,
		allColumns,
		updateGuest,
		tableType,
	} = props;

	const [drawerState, setDrawerState] = useState(false);

	const toggleDrawer = () => setDrawerState(!drawerState);

	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const createGroupHandler = () => {
		selectedRowArray.map((selectedRow, index) => {
			return selectedRowArray.map((selectedRow, index) =>
				updateGuest(
					selectedProjectId,
					selectedRow.guestId,
					'roomGroup',
					format(new Date(), 't')
				)
			);
		});
	};

	const open = Boolean(anchorEl);

	return (
		<Toolbar
			className={`${clsx(classes.root, {
				[classes.highlight]: numSelected > 0,
			})} ${Styles.toolbar}`}
		>
			{numSelected > 0 ? (
				<Fragment>
					<Typography
						className={classes.title}
						color="inherit"
						variant="subtitle1"
					>
						{numSelected} selected
					</Typography>
					<GlobalFilter
						preGlobalFilteredRows={preGlobalFilteredRows}
						globalFilter={globalFilter}
						setGlobalFilter={setGlobalFilter}
					/>
					{tableType !== TableType.Rooming && (
						<SendInvitesDialog
							selectedProjectId={selectedProjectId}
							selectedRowArray={selectedRowArray}
						/>
					)}
				</Fragment>
			) : (
				<Fragment>
					<GlobalFilter
						preGlobalFilteredRows={preGlobalFilteredRows}
						globalFilter={globalFilter}
						setGlobalFilter={setGlobalFilter}
					/>
					{tableType !== TableType.Rooming && (
						<Fragment>
							<SendInvitesDialog
								selectedProjectId={selectedProjectId}
								selectedRowArray={selectedRowArray}
							/>
							<AddUserDialog selectedProjectId={selectedProjectId} />
						</Fragment>
					)}
				</Fragment>
			)}

			{numSelected > 0 && tableType === TableType.Rooming && (
				<Box
					display="flex"
					justifyContent="flex"
					alignItems="center"
					width="50vw"
				>
					<CustomButton
						startIcon={<GroupAddIcon />}
						onClick={createGroupHandler}
					>
						Create a Group
					</CustomButton>
				</Box>
			)}
			<IconButton onClick={handleClick}>
				<MenuIcon />
			</IconButton>
			<Popover
				id={'toggle-columns'}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
			>
				<List dense>
					<div>
						<IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle
						All
					</div>
					{allColumns.map((column: any) => {
						if (column.id === DataType.RoomGroup) return null;
						const labelId = `checkbox-to-toggle-table-${column.id}`;
						return (
							<ListItem>
								<ListItemText id={labelId} primary={column.id} />
								<ListItemSecondaryAction>
									<Checkbox edge="end" {...column.getToggleHiddenProps()} />
								</ListItemSecondaryAction>
							</ListItem>
						);
					})}
				</List>
			</Popover>
			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton aria-label="delete" onClick={deleteUserHandler}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : (
				<Box display="flex" alignItems="center" justifyContent="space-around">
					<Divider className={Styles.space} orientation="vertical" flexItem />
					<AccountCircleOutlinedIcon color="primary" fontSize="large" />
					<Typography className={Styles.guestSummary}>
						{guestData.length}
					</Typography>
					<Typography variant="h5" color="primary">
						Guest Summary
					</Typography>
				</Box>
			)}
		</Toolbar>
	);
};

export default connect(null, { updateGuest })(TableToolbar);
