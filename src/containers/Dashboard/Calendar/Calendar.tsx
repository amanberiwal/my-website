import React, { useState, FC, useMemo, MouseEvent } from 'react';
import {
	addDays,
	addMonths,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	startOfMonth,
	startOfWeek,
	subMonths,
	toDate,
} from 'date-fns';
import {
	Box,
	IconButton,
	Paper,
	Tab,
	Tabs,
	Typography,
} from '@material-ui/core';
import Styles from './Calendar.module.scss';
import {
	ChevronLeft as ChevronLeftIcon,
	ChevronRight as ChevronRightIcon,
	PostAddRounded as PostAddRoundedIcon,
} from '@material-ui/icons';
import { CalendarEventCard, CalendarPopover } from '.';
import { connect } from 'react-redux';
import { RootState, createTodo } from '../../../redux';
import { ProjectTodo, User, ProjectEvent, CalendarTask } from '../../../repos';

interface CalendarProps {
	projectTodos?: ProjectTodo[];
	selectedProjectId: string | null;
	users?: User[];
	createTodo: typeof createTodo;
	loading?: boolean;
	projectEvents?: ProjectEvent[];
}

const Calendar: FC<CalendarProps> = (props) => {
	const { projectTodos, selectedProjectId, users, loading, projectEvents } =
		props;
	//TODO: Refactor the code

	const [selectedTask, setSelectedTask] = useState<ProjectTodo>();

	const [anchorEl, setAnchorEl] = useState<
		HTMLButtonElement | HTMLDivElement | null
	>(null);

	// const [
	// 	todoComplete = projectTodos &&
	// 		projectTodos.map((projectTodo) => projectTodo.isCompleted),
	// 	setTodoComplete,
	// ] = useState<(boolean | undefined)[]>();

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
		setSelectedTask(undefined);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setSelectedTask(undefined);
	};

	const calendarTodos = useMemo(() => {
		if (!projectTodos) return;
		return projectTodos.filter((projectTodo) => projectTodo.isCalendar);
	}, [projectTodos]);

	const [stateValue, setStateValue] = useState({
		currentMonth: new Date(),
		selectedDate: new Date(),
	});

	const [projectTab, setProjectTab] = useState(0);

	const [selectedDateEvents, setSelectedDateEvents] =
		useState<CalendarTask[]>();

	const handleProjectTab = (event: React.ChangeEvent<{}>, newValue: number) => {
		setProjectTab(newValue);
	};

	useMemo(() => {
		if (!projectEvents || !calendarTodos || !selectedProjectId) return;

		const eventCards = () => {
			switch (projectTab) {
				case 0:
					const todos = calendarTodos.filter((calendarTodo) => {
						if (!calendarTodo.todoDate) return null;
						return (
							format(calendarTodo.todoDate.toDate(), 'MM/dd/yyyy') ===
							format(stateValue.selectedDate, 'MM/dd/yyyy')
						);
					});
					const events = projectEvents.filter((projectEvent) => {
						if (!projectEvent.eventDate) return null;

						return (
							selectedProjectId === projectEvent.projectId &&
							format(projectEvent.eventDate.toDate(), 'MM/dd/yyyy') ===
								format(stateValue.selectedDate, 'MM/dd/yyyy')
						);
					});
					return [...todos, ...events];
				case 1:
					return projectEvents.filter((projectEvent) => {
						if (!projectEvent.createdAt) return null;
						return (
							format(projectEvent.createdAt.toDate(), 'MM/dd/yyyy') ===
							format(stateValue.selectedDate, 'MM/dd/yyyy')
						);
					});
			}
		};

		setSelectedDateEvents(eventCards() as CalendarTask[]);
	}, [
		calendarTodos,
		projectEvents,
		projectTab,
		selectedProjectId,
		stateValue.selectedDate,
	]);

	function renderHeader() {
		const dateFormat = 'MMMM ';
		return (
			<Paper square className={Styles.calendarHeader} elevation={0}>
				<Typography onClick={today}>
					{format(stateValue.currentMonth, dateFormat)}
				</Typography>
				<Box className={Styles.chevronIcon}>
					<IconButton onClick={prevMonth}>
						<ChevronLeftIcon />
					</IconButton>
					<IconButton onClick={nextMonth}>
						<ChevronRightIcon />
					</IconButton>
				</Box>
			</Paper>
		);
	}

	function renderProjectTabs() {
		return (
			<Box>
				<Tabs
					value={projectTab}
					onChange={handleProjectTab}
					indicatorColor="primary"
					textColor="primary"
					className={Styles.projectButton}
					centered
					variant="fullWidth"
				>
					<Tab label="This Project" />
					<Tab label="All Projects" />
				</Tabs>
			</Box>
		);
	}

	function renderDays() {
		const dateFormat = 'EEEEE';
		const days = [];

		let startDate = startOfWeek(stateValue.currentMonth);

		for (let i = 0; i < 7; i++) {
			days.push(
				<Typography key={i} className={Styles.weekText}>
					{format(addDays(startDate, i), dateFormat)}
				</Typography>
			);
		}

		return (
			<Box display="flex" justifyContent="space-around">
				{days}
			</Box>
		);
	}

	function renderCells() {
		const { currentMonth, selectedDate } = stateValue;
		const monthStart = startOfMonth(currentMonth);
		const monthEnd = endOfMonth(monthStart);
		const startDate = startOfWeek(monthStart);
		const endDate = endOfWeek(monthEnd);
		const dateFormat = 'd';
		const rows = [];
		let days = [];
		let day = startDate;
		let formattedDate = '';
		while (day <= endDate) {
			for (let i = 0; i < 7; i++) {
				formattedDate = format(day, dateFormat);
				const cloneDay = day;
				days.push(
					<Box
						display="flex"
						justifyContent="space-around"
						alignItems="center"
						width="100%"
						boxShadow={0}
						className={`${Styles.cell} ${
							!isSameMonth(day, monthStart)
								? Styles.disabled
								: isSameDay(day, selectedDate)
								? Styles.selected
								: ''
						}`}
						key={i}
						onClick={() => {
							return onDateClick(toDate(cloneDay));
						}}
					>
						<div className={Styles.dateMarker}>
							<div className={Styles.number}>{formattedDate}</div>
							{/* <div
								className={
									selectedDateEvents && selectedDateEvents?.length > 0
										? Styles.circle
										: ''
								}
							></div> */}
						</div>
						<span className={Styles.bg}>{formattedDate}</span>
					</Box>
				);
				day = addDays(day, 1);
			}
			rows.push(
				<Box
					display="flex"
					justifyContent="space-around"
					//key={day}
				>
					{days}
				</Box>
			);
			days = [];
		}
		return rows;
	}

	const onDateClick = (day: Date) => {
		setStateValue({
			currentMonth: stateValue.currentMonth,
			selectedDate: day,
		});
	};

	const today = () => {
		setStateValue({
			currentMonth: new Date(),
			selectedDate: new Date(),
		});
	};

	const nextMonth = () => {
		setStateValue({
			currentMonth: addMonths(stateValue.currentMonth, 1),
			selectedDate: stateValue.selectedDate,
		});
	};

	const prevMonth = () => {
		setStateValue({
			currentMonth: subMonths(stateValue.currentMonth, 1),
			selectedDate: stateValue.selectedDate,
		});
	};

	const selectedEventHandler = (
		event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
		calendarTask: ProjectTodo
	) => {
		setSelectedTask(calendarTask);
		setAnchorEl(event.currentTarget);
	};

	return (
		// <Box className={Styles.calendar}>
		<div className={Styles.calendar}>
			{renderHeader()}
			<Paper className={Styles.calendarBody} elevation={0}>
				{renderProjectTabs()}
				<Box display="flex" flexDirection="column">
					<Box
						display="flex"
						justifyContent="space-around"
						flexDirection="column"
					>
						{renderDays()}
						{renderCells()}
					</Box>
				</Box>
			</Paper>

			<Box
				display="flex"
				flexDirection="column"
				alignItems="flex-end"
				className={Styles.calendarEventCardContainer}
			>
				<Box
					// mr={3}
					display="flex"
					alignItems="center"
					justifyContent="space-around"
				>
					<Typography variant="subtitle2" color="primary">
						Add Task
					</Typography>
					<IconButton onClick={handleClick}>
						<PostAddRoundedIcon />
					</IconButton>
				</Box>
				<CalendarPopover
					id={Boolean(anchorEl) ? 'simple-popover-calendar' : undefined}
					anchorEl={anchorEl}
					onClose={handleClose}
					loading={loading}
					setAnchorEl={setAnchorEl}
					key={
						selectedTask
							? selectedTask.todoId
							: `${selectedDateEvents ? selectedDateEvents.length : '1'}`
					}
					users={users}
					selectedTodo={selectedTask}
					selectedProjectId={selectedProjectId}
					todoDate={stateValue.selectedDate}
				/>
				{selectedDateEvents
					? selectedDateEvents.map((calendarTodo) => {
							return (
								//TODO: Change name to calendar Todo
								<CalendarEventCard
									calendarEvent={calendarTodo}
									key={calendarTodo.todoId}
									onClick={(event) => selectedEventHandler(event, calendarTodo)}
								/>
							);
					  })
					: null}
			</Box>
		</div>
	);
};

const mapStateToProps = (state: RootState) => {
	const { projectTodos, loading, projectEvents } = state.Dashboard;
	const { users } = state.Project;
	return { projectTodos, users, loading, projectEvents };
};

export default connect(mapStateToProps, { createTodo })(Calendar);
