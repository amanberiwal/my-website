import { Paper, Box, Typography } from '@material-ui/core';
import React, { FC, ReactNode } from 'react';
import Styles from './LongCard.module.scss';

export enum LongCardType {
	Calendar = 'calendar',
	Event = 'event',
	FloorPlan = 'FloorPlan',
}

interface LongCardProps {
	type: LongCardType;
	title: string;
	children?: ReactNode;
	subTitle?: string;
}
const LongCard: FC<LongCardProps> = (props) => {
	const { type, title, children, subTitle } = props;

	const classNameType = () => {
		switch (type) {
			case LongCardType.Calendar:
				return Styles.paperInfoCalendar;
			case LongCardType.Event:
				return Styles.paperInfoEvent;
			case LongCardType.FloorPlan:
				return Styles.paperInfoFloorPlan;
		}
	};

	return (
		<Paper square className={classNameType()} elevation={1}>
			<Box>
				<Typography variant="h4">{title}</Typography>
				<Typography>{subTitle}</Typography>
			</Box>
			{children}
		</Paper>
	);
};

export default LongCard;
