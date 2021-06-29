import { Box, Typography, Paper } from '@material-ui/core';
import { NavigateFn } from '@reach/router';
import React, { FC, useMemo } from 'react';
import { connect } from 'react-redux';
import { CustomCard } from '../../../components';
import { RootState } from '../../../redux';
import { GuestData, Routes, RSVP } from '../../../repos';
import Styles from './GuestListCard.module.scss';

interface GuestListCardProps {
	//TODO: Change this navigate and take from redux for global one
	navigate?: NavigateFn;
	guestsData?: GuestData[];
}
const GuestListCard: FC<GuestListCardProps> = (props) => {
	const { navigate, guestsData } = props;

	const guestsStatus = useMemo(() => {
		if (!guestsData) return;
		let rsvpAccepted = 0;
		let rsvpDeclined = 0;
		let awaiting = 0;
		guestsData.forEach((guestData) => {
			switch (guestData.rsvp) {
				case RSVP.Accepted:
					rsvpAccepted = rsvpAccepted + 1;
					break;
				case RSVP.Declined:
					rsvpDeclined = rsvpDeclined + 1;
					break;
				default:
					awaiting = awaiting + 1;
			}
		});
		return { rsvpAccepted, rsvpDeclined, awaiting };
	}, [guestsData]);

	return (
		<CustomCard
			title={`GuestList`}
			cardColor="#ffd5d5"
			onClick={() => navigate && navigate(`${Routes.GuestList}`)}
		>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="flex-start"
			>
				<Box display="flex" flexDirection="column" p={2}>
					<Typography variant="h5" className={Styles.statsInfoText2}>
						{guestsData ? guestsData.length : null}
					</Typography>
					<Typography className={Styles.statsInfoText}>
						Total Registered
					</Typography>
				</Box>
				<Box display="flex" flexDirection="column" p={2}>
					<Typography variant="h5" className={Styles.statsInfoText2}>
						{guestsStatus ? guestsStatus.rsvpAccepted : null}
					</Typography>
					<Typography className={Styles.statsInfoText}>
						Accepteded RSVP
					</Typography>
				</Box>
				<Box display="flex" flexDirection="column" p={2}>
					<Typography variant="h5" className={Styles.statsInfoText2}>
						{guestsStatus ? guestsStatus.rsvpDeclined : null}
					</Typography>
					<Typography className={Styles.statsInfoText}>
						Rejected RSVP
					</Typography>
				</Box>
				<Box display="flex" flexDirection="column" p={2}>
					<Typography variant="h5" className={Styles.statsInfoText2}>
						{guestsStatus ? guestsStatus.awaiting : null}
					</Typography>
					<Typography className={Styles.statsInfoText}>
						Awaiting Response
					</Typography>
				</Box>
			</Box>
			<Box mt={1}>
				<Typography>
					<strong>NOTIFICATIONS</strong>
				</Typography>
			</Box>
			<Box display="flex" alignItems="center" flexDirection="column">
				<Paper square className={Styles.paperInfo} variant="outlined">
					<Box>
						<Typography>22/11</Typography>
					</Box>
					<Box>
						<Typography>Angad Accepted RSVP</Typography>
					</Box>
				</Paper>
				<Paper square className={Styles.paperInfo} variant="outlined">
					<Box>
						<Typography>25/10</Typography>
					</Box>
					<Box>
						<Typography>Issues with Manufacturing </Typography>
					</Box>
				</Paper>
			</Box>
		</CustomCard>
	);
};

const mapStateToProps = (state: RootState) => {
	const { guestsData } = state.Guest;
	return { guestsData };
};

export default connect(mapStateToProps)(GuestListCard);
