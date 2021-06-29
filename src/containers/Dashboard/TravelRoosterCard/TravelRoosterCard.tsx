import { Box, Paper, Typography } from '@material-ui/core';
import React from 'react';
import { CustomCard } from '../../../components';
import Styles from './TravelRoosterCard.module.scss';
import { Flight, Train } from '@material-ui/icons';

const TravelRoosterCard = () => {
	return (
		<CustomCard title={`Travel Rooster`} cardColor="rgba(18, 173, 125, 0.12)">
			{/* <Box display="flex" alignItems="center" flexDirection="column">
				<Typography variant="h5">150 Arrived</Typography>
				<Typography variant="h5">330 Arriving</Typography>
			</Box> */}
			{/* <Box mt={1}>
				<Typography><strong>UPCOMING ARRIVALS</strong></Typography>
			</Box> */}
			<Box display="flex" alignItems="center" flexDirection="column">
				<Paper square className={Styles.paperInfo} variant="outlined">
					<Box>
						<Typography>22/11</Typography>
					</Box>
					<Box>
						<Typography>Krishna</Typography>
					</Box>
					<Box>
						<Train />
					</Box>
				</Paper>
				<Paper square className={Styles.paperInfo} variant="outlined">
					<Box>
						<Typography>25/10</Typography>
					</Box>
					<Box>
						<Typography>Balram</Typography>
					</Box>
					<Box>
						<Flight />
					</Box>
				</Paper>
				<Paper square className={Styles.paperInfo} variant="outlined">
					<Box>
						<Typography>25/10</Typography>
					</Box>
					<Box>
						<Typography>Parmanu</Typography>
					</Box>
					<Box>
						<Flight />
					</Box>
				</Paper>
				<Paper square className={Styles.paperInfo} variant="outlined">
					<Box>
						<Typography>25/10</Typography>
					</Box>
					<Box>
						<Typography>Akshaj</Typography>
					</Box>
					<Box>
						<Flight />
					</Box>
				</Paper>
			</Box>
		</CustomCard>
	);
};

export default TravelRoosterCard;
