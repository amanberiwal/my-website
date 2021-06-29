import { Paper, Typography } from '@material-ui/core';
import React, { FC, MouseEvent } from 'react';
import { ProjectTodo } from '../../../../repos';
import Styles from './CalendarEventCard.module.scss';

interface CalendarEventCardProps {
	calendarEvent: ProjectTodo;
	onClick: (event: MouseEvent<HTMLDivElement>) => void;
}

const CalendarEventCard: FC<CalendarEventCardProps> = (props) => {
	const { calendarEvent, onClick } = props;
	return (
		<Paper square className={Styles.paperInfo} elevation={0} onClick={onClick}>
			<Typography component="h6" variant="h6">
				<strong>{calendarEvent.name}</strong>
			</Typography>
			<Typography variant="subtitle1" color="textSecondary">
				{calendarEvent.description}
			</Typography>
		</Paper>
	);
};

export default CalendarEventCard;
