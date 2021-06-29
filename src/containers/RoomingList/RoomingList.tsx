import React, { FC, useEffect, useMemo, useState } from 'react';
import { CssBaseline, Typography, Grid } from '@material-ui/core/';
import { AddUserDialog, CustomTable } from '../../components/ReactTable';
import { RouteComponentProps } from '@reach/router';
import { connect } from 'react-redux';
import { RootState, listenToHotels } from '../../redux';
import { DataType, GuestData, HeaderType, TableType } from '../../repos';
import { Loader, LoaderSize } from '../../components';
import { emptyGuestList } from '../../assets';
import Styles from './RoomingList.module.scss';
import { FloorPlan } from '.';
interface RoomingListProps extends RouteComponentProps {
	tableHeaders?: HeaderType;
	guestsData?: GuestData[];
	selectedProjectId: string | null;
	listenToHotels: typeof listenToHotels;
}

const RoomingList: FC<RoomingListProps> = (props) => {
	const { tableHeaders, guestsData, selectedProjectId, listenToHotels } = props;

	// console.log(guestsData);

	const [data, setData] = useState(useMemo(() => guestsData, [guestsData]));
	const [skipPageReset, setSkipPageReset] = useState(false);

	// TODO: Revisit for performance
	useMemo(() => {
		setData(guestsData);
	}, [guestsData]);

	useEffect(() => {
		listenToHotels();
	}, [listenToHotels]);

	// We need to keep the table from resetting the pageIndex when we
	// Update data. So we can keep track of that flag with a ref.

	// When our cell renderer calls updateMyData, we'll use
	// the rowIndex, columnId and new value to update the
	// original data
	const updateMyData = (rowIndex: any, columnId: any, value: any) => {
		// We also turn on the flag to not reset the page
		setSkipPageReset(true);
		setData((old: any) => {
			if (!old) {
				return;
			}
			return old.map((row: any, index: number) => {
				if (index === rowIndex) {
					return {
						...old[rowIndex],
						[columnId]: value,
					};
				}
				return row;
			});
		});
	};

	if (!tableHeaders || !data) {
		return (
			<Grid
				container
				item
				justify="center"
				alignItems="center"
				className={Styles.loaderContainer}
			>
				<Loader size={LoaderSize.lg} />
				<Typography variant="h5" color="primary">
					Loading Your Table
				</Typography>
			</Grid>
		);
	}

	const { roomHeaders } = tableHeaders;

	if (data.length === 0 || roomHeaders === undefined) {
		return (
			<div className={Styles.pageContainer}>
				<Typography color="inherit" variant="subtitle1">
					You haven't added anyone to the RoomingList yet!
				</Typography>
				<AddUserDialog
					selectedProjectId={selectedProjectId as string}
					createHeaders={true}
				/>
				<Grid item>
					<img
						src={emptyGuestList}
						alt="empty-RoomingList"
						width="75%"
						style={{ margin: '3% 10%' }}
					></img>
				</Grid>
			</div>
		);
	}

	// const expandedObject = data.reduce((acc, element, index) => {
	// 	return { ...acc, [`${DataType.RoomGroup}:${element.roomGroup}`]: true };
	// }, {});

	const initialState = {
		groupBy: [DataType.RoomGroup],
		pageSize: data.length,
		// expanded: expandedObject,
		// hiddenColumns: [DataType.RoomGroup],
	};

	return (
		<>
			<Grid container className={Styles.allGridContainer}>
				<Grid item container className={Styles.roomingTable}>
					<CssBaseline />
					<CustomTable
						columns={roomHeaders}
						data={data}
						setData={setData}
						updateMyData={updateMyData}
						skipPageReset={skipPageReset}
						selectedProjectId={selectedProjectId}
						tableType={TableType.Rooming}
						initialState={initialState}
					/>
				</Grid>
				<Grid
					item
					container
					justify="flex-start"
					alignItems="center"
					direction="column"
				>
					<FloorPlan selectedProjectId={selectedProjectId}></FloorPlan>
				</Grid>
			</Grid>
		</>
	);
};

const mapStateToProps = (state: RootState) => {
	const { tableHeaders, guestsData } = state.Guest;

	return { tableHeaders, guestsData };
};

export default connect(mapStateToProps, { listenToHotels })(RoomingList);
