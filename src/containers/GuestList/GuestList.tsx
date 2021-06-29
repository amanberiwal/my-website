import React, { FC, useMemo, useState } from 'react';
import { CssBaseline, Typography, Grid } from '@material-ui/core/';
import { AddUserDialog, CustomTable } from '../../components/ReactTable';
import { RouteComponentProps } from '@reach/router';
import { connect } from 'react-redux';
import { RootState } from '../../redux';
import { GuestData, HeaderType } from '../../repos';
import { Loader, LoaderSize } from '../../components';
import Styles from './GuestList.module.scss';
import { emptyGuestList } from '../../assets';
interface GuestListProps extends RouteComponentProps {
	tableHeaders?: HeaderType;
	guestsData?: GuestData[];
	selectedProjectId: string | null;
}

const GuestList: FC<GuestListProps> = (props) => {
	const { tableHeaders, guestsData, selectedProjectId } = props;

	// console.log(guestsData);

	const [data, setData] = useState(useMemo(() => guestsData, [guestsData]));
	const [skipPageReset, setSkipPageReset] = useState(false);

	// TODO: Revisit for performance
	useMemo(() => {
		setData(guestsData);
	}, [guestsData]);

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

	const { guestHeaders } = tableHeaders;

	if (data.length === 0 || guestHeaders === undefined) {
		return (
			<div className={Styles.pageContainer}>
				<Typography color="inherit" variant="subtitle1">
					You haven't added anyone to the guestlist yet!
				</Typography>
				<AddUserDialog
					selectedProjectId={selectedProjectId as string}
					createHeaders={true}
				/>
				<Grid item>
					<img
						src={emptyGuestList}
						alt="empty-guestlist"
						width="75%"
						style={{ margin: '3% 10%' }}
					></img>
				</Grid>
			</div>
		);
	}

	// const saveToFirebase = () => {
	// 	FirestoreCollectionReference.Guests(
	// 		'YIJ3bLzUXlubsxnDPnDR',
	// 		'm0X20ou9QxoAZSrK2ehH'
	// 	)
	// 		.doc('m0X20ou9QxoAZSrK2ehH')
	// 		.update({ roomHeaders: defaultGuestHeaders })
	// 		.then(() => alert('done'));
	// };

	const initialState = {
		pageSize: data.length,
		// expanded: expandedObject,
		// hiddenColumns: [DataType.RoomGroup],
	};

	return (
		<>
			<CssBaseline />
			{/* Can be used to createGuestHeaders, so uncomment when needed */}
			{/* <button onClick={saveToFirebase}>Save</button> */}
			<CustomTable
				columns={guestHeaders}
				data={data}
				setData={setData}
				updateMyData={updateMyData}
				skipPageReset={skipPageReset}
				selectedProjectId={selectedProjectId}
				initialState={initialState}
			/>
		</>
	);
};

const mapStateToProps = (state: RootState) => {
	const { tableHeaders, guestsData } = state.Guest;

	return { tableHeaders, guestsData };
};

export default connect(mapStateToProps, {})(GuestList);
