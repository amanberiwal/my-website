import { Box, IconButton, Button } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { connect } from 'react-redux';
import { LongCard, LongCardType } from '../../../components';
import { RootState, updateGuest } from '../../../redux';
import { Hotel, RoomList } from '../../../repos';
import Styles from './FloorPlan.module.scss';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { RoomingToolbar } from '../RoomingToolbar';
import { FloorMap } from '.';

interface FloorPlanProps {
	hotels?: Hotel[];
	selectedRows?: [];
	updateGuest: typeof updateGuest;
	selectedProjectId: string | null;
}

const FloorPlan: FC<FloorPlanProps> = (props) => {
	const { hotels, selectedRows, updateGuest, selectedProjectId } = props;

	const [filterState, setFilterState] = useState<
		RoomList[] | number[] | undefined
	>(new Array(10).fill(-1));
	const [switchFloor, setSwitchFloor] = useState(false);

	if (!hotels) {
		return null;
	}
	const corpus = hotels
		.map((hotel) => {
			return hotel.roomList.map((roomList, index) => {
				return { ...roomList, hotelName: hotel.hotelName };
			});
		})
		.flat();

	// STEP 1
	// getting unique keys from the corpus -> convert to select filterOptions
	const filterKeys = Object.keys(
		corpus.reduce(function (result, obj) {
			return Object.assign(result, obj);
		}, {} as RoomList)
	);

	// STEP 2
	// getting unique values from corpus
	const filterOptions = (propertyValue: keyof RoomList) => [
		...new Set(corpus.map((corpusValue) => corpusValue[propertyValue])),
	]; // construct filterOptions

	const generateOutput = () => {
		let tempArray = [...corpus];
		if (!filterState) return [];

		filterState.forEach((element: RoomList | number, index: number) => {
			if (element !== -1) {
				tempArray = tempArray.filter(
					(corpus) => corpus[filterKeys[index] as keyof RoomList] === element
				);
			}
		});
		return tempArray;
	};

	const roomActionHandler = (hotel: string, roomNo: string) => {
		console.log(`selectedProjectId`, selectedProjectId);
		if (selectedRows && selectedRows.length > 0 && selectedProjectId) {
			selectedRows.forEach((selectedRow: any) => {
				updateGuest(selectedProjectId, selectedRow.guestId, 'roomNo', roomNo);
				updateGuest(selectedProjectId, selectedRow.guestId, 'hotelName', hotel);
			});
		}
	};

	const renderRoomCards = () => {
		return generateOutput().map((roomCard, index) => {
			return (
				<LongCard
					title={roomCard.roomNumber}
					subTitle={roomCard.bedType}
					type={LongCardType.FloorPlan}
					key={index.toString()}
				>
					<Box display="flex" flexDirection="column" alignItems="center">
						<IconButton>{<DeleteIcon />}</IconButton>
						<Button
							color="secondary"
							onClick={() =>
								roomActionHandler(roomCard.hotelName, roomCard.roomNumber)
							}
						>
							Assign Room
						</Button>
					</Box>
				</LongCard>
			);
		});
	};

	return (
		<Box
			display="flex"
			justifyContent="space-around"
			flexWrap="wrap"
			className={Styles.cardContainer}
		>
			<RoomingToolbar
				filterKeys={filterKeys as (keyof RoomList)[]}
				filterOptions={filterOptions}
				filterState={filterState}
				switchFloor={switchFloor}
				setFilterState={setFilterState}
				setSwitchFloor={setSwitchFloor}
			/>
			{switchFloor ? <FloorMap /> : renderRoomCards()}
		</Box>
	);
};

const mapStateToProps = (state: RootState) => {
	const { hotels, selectedRows } = state.Rooming;
	return { hotels, selectedRows };
};

export default connect(mapStateToProps, { updateGuest })(FloorPlan);
