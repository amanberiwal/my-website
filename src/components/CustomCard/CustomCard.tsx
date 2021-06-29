import {
	Card,
	CardActions,
	CardContent,
	CardHeader,
	CardHeaderProps,
} from '@material-ui/core';
import React, { FC, ReactNode } from 'react';
import Styles from './CustomCard.module.scss';

interface CustomCardProps extends CardHeaderProps {
	cardColor?: string;
	action?: any;
	onClick?: () => void;
	children?: ReactNode;
	cardClassName?: string;
}
export const CustomCard: FC<CustomCardProps> = (props) => {
	const { cardColor, action, title, onClick, children, cardClassName } = props;

	return (
		<Card
			className={`${Styles.card} ${cardClassName}`}
			style={{ backgroundColor: cardColor }}
			elevation={0}
		>
			<CardHeader
				action={action}
				title={title}
				classes={{ title: Styles.cardTitle }}
			/>
			<CardContent onClick={onClick} className={Styles.cardContent}>
				{children}
			</CardContent>
			<CardActions disableSpacing></CardActions>
		</Card>
	);
};
