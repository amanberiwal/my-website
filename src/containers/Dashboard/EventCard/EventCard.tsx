import { Box, Paper, Typography } from '@material-ui/core';
import React, { MouseEvent, useState, FC, useMemo } from 'react';
import Styles from './EventCard.module.scss';
import { AddCircleOutline, PeopleOutlineRounded, CloudOutlined } from '@material-ui/icons';
import { RootState } from '../../../redux';
import { connect } from 'react-redux';
import { ProjectEvent } from '../../../repos';
import { format } from 'date-fns';
import EventPopover from './EventPopover/EventPopover';

interface EventCardProps {
	projectEvents?: ProjectEvent[];
	selectedProjectId: string | null;
	loading?: boolean;
}

const EventCard: FC<EventCardProps> = (props) => {
	const { projectEvents, selectedProjectId, loading } = props;

	const [anchorEl, setAnchorEl] = useState<
		HTMLButtonElement | HTMLDivElement | null
	>(null);

	const [selectedEvent, setSelectedEvent] = useState<ProjectEvent>();

	const handleClick = (event: MouseEvent<HTMLDivElement>) => {
		setSelectedEvent(undefined);
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const updateEventHandler = (
		event: MouseEvent<HTMLDivElement>,
		projectEvent: ProjectEvent
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedEvent(projectEvent);
	};

	const open = Boolean(anchorEl);

	const id = open ? 'simple-popover-event' : undefined;

	const eventDateCardsArray = useMemo(() => {
		if (!projectEvents) return;

		return projectEvents.filter((projectEvent) => {
			console.log(`Check`, projectEvent.projectId);
			return projectEvent.projectId === selectedProjectId;
		});
	}, [projectEvents, selectedProjectId]);

	const minMaxEventDate = useMemo(() => {
		if (!eventDateCardsArray) return;
		const eventDates = eventDateCardsArray.flatMap((projectEvent) => {
			if (!projectEvent.eventDate) return [];
			return [projectEvent.eventDate.toMillis()];
		});

		return {
			minEvent: Math.min(...eventDates),
			maxEvent: Math.max(...eventDates),
		};
	}, [eventDateCardsArray]);

	return (
		<Box className={Styles.eventContainer}>
			<Box display="flex" className={Styles.eventCards}>
				{eventDateCardsArray
					? eventDateCardsArray.map((projectEvent) => {
							return (
								<Paper
									square
									className={Styles.paperInfo}
									elevation={0}
									key={projectEvent.projectId}
									onClick={(event) => updateEventHandler(event, projectEvent)}
								>
									<Box className={Styles.eventCardHeader}>
										<Typography className={Styles.eventCardHeaderText}>
											<strong>
												{projectEvent.eventDate &&
													format(
														projectEvent.eventDate.toDate(),
														'd MMMM'
													).toUpperCase()}
											</strong>
										</Typography>
									</Box>

									<Box display="flex" flexDirection="column">
										<Typography variant="h5" className={Styles.projectName}>
											{projectEvent.name}
										</Typography>
										<Typography
											variant="subtitle1"
											className={Styles.projectVenue}
										>
											{projectEvent.venue}
										</Typography>
									</Box>

									<Box display="flex" justifyContent="space-evenly" marginLeft="-13px">
										<PeopleOutlineRounded />
										<CloudOutlined />
									</Box>
								</Paper>
							);
					  })
					: null}
			</Box>
			<Box display="flex" className={Styles.eventManage}>
				<Box display="flex" className={Styles.eventSummaryCard}>
					<Paper square className={Styles.eventSummary} elevation={0}>
						<Typography variant="body2">
							Total Events: {eventDateCardsArray && eventDateCardsArray.length}
						</Typography>
						<Typography variant="body2">
							Events Range:{' '}
							{minMaxEventDate &&
								`${format(new Date(minMaxEventDate.maxEvent), 'd MMM')} to
								${format(new Date(minMaxEventDate.minEvent), 'd MMM yyyy')}`}
						</Typography>
					</Paper>
				</Box>

				<Box display="flex" className={Styles.eventCreatorCard}>
					<Paper
						square
						className={Styles.paperEventCreator}
						onClick={handleClick}
					>
						<span>Add Event</span>
						<AddCircleOutline />
					</Paper>
					<EventPopover
						id={id}
						selectedProjectId={selectedProjectId}
						anchorEl={anchorEl}
						onClose={handleClose}
						loading={loading}
						selectedEvent={selectedEvent}
						key={
							selectedEvent
								? selectedEvent.eventId
								: `${projectEvents ? projectEvents.length : '1'}`
						}
						setAnchorEl={setAnchorEl}
					/>
				</Box>
			</Box>
		</Box>
	);
};

const mapStateToProps = (state: RootState) => {
	const { projectEvents, loading } = state.Dashboard;
	return { projectEvents, loading };
};

export default connect(mapStateToProps)(EventCard);
