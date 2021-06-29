import React, { SetStateAction, useState } from 'react';
import { AddDetailsPopover } from '../../../../components';
import { TextField } from '@material-ui/core';
import Styles from './EventPopover.module.scss';
import { connect } from 'react-redux';
import { createEvent, updateEvent } from '../../../../redux';
import { ProjectEvent } from '../../../../repos';
import firebase from '../../../../firebase.config';
import format from 'date-fns/format/index';

interface EventPopoverProps {
	id: string | undefined;
	anchorEl: HTMLDivElement | HTMLButtonElement | null;
	onClose: () => void;
	loading?: boolean;
	selectedProjectId: string | null;
	createEvent: typeof createEvent;
	updateEvent: typeof updateEvent;
	selectedEvent?: ProjectEvent;
	setAnchorEl: (
		value: SetStateAction<HTMLDivElement | HTMLButtonElement | null>
	) => void;
}

const EventPopover = (props: EventPopoverProps) => {
	const {
		id,
		anchorEl,
		onClose,
		selectedProjectId,
		loading,
		createEvent,
		updateEvent,
		selectedEvent,
		setAnchorEl,
	} = props;

	const [eventName = selectedEvent ? selectedEvent.name : '', setEventName] =
		useState<string>();
	//TODO: Change eventName to eventTitle and relay to backend
	const [eventVenue = selectedEvent ? selectedEvent.venue : '', setEventVenue] =
		useState<string>();
	const [
		eventDate = selectedEvent
			? selectedEvent.eventDate && selectedEvent.eventDate!.toDate()
			: new Date(),
		setEventDate,
	] = useState<Date | string>();

	const saveEventHandler = () => {
		if (!selectedProjectId) return;
		createEvent({
			projectId: selectedProjectId,
			createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
			venue: eventVenue,
			name: eventName,
			eventDate: firebase.firestore.Timestamp.fromDate(
				new Date(eventDate as Date)
			),
		});
		setAnchorEl(null);
	};

	const updateEventHandler = () => {
		if (!selectedProjectId || !selectedEvent || !selectedEvent.eventId) return;

		updateEvent(selectedProjectId, selectedEvent.eventId, {
			name: eventName,
			updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
			venue: eventVenue,
			eventDate: firebase.firestore.Timestamp.fromDate(
				new Date(eventDate as Date)
			),
		});

		setAnchorEl(null);
	};

	return (
		<AddDetailsPopover
			id={id}
			open={Boolean(anchorEl)}
			anchorEl={anchorEl}
			onClose={onClose}
			title="Add a Event"
			bgColor="#0d34a2"
			onClickSave={selectedEvent ? updateEventHandler : saveEventHandler}
			disabledSave={!eventName}
			loading={loading}
		>
			<TextField
				className={Styles.eventTitleTextField}
				id="title-for-event"
				label="Name"
				value={eventName}
				onChange={(event) => setEventName(event.target.value)}
			/>
			<TextField
				className={Styles.eventTitleTextField}
				id="todo-description"
				label="Venue"
				value={eventVenue}
				onChange={(event) => setEventVenue(event.target.value)}
			/>
			<TextField
				className={Styles.eventTitleTextField}
				id="date"
				label="Event Date"
				type="date"
				defaultValue={
					eventDate instanceof Date
						? format(eventDate, 'yyyy-MM-dd')
						: eventDate
				}
				onChange={(event) => setEventDate(event.target.value)}
				InputLabelProps={{
					shrink: true,
				}}
			/>
		</AddDetailsPopover>
	);
};

export default connect(null, { createEvent, updateEvent })(EventPopover);
