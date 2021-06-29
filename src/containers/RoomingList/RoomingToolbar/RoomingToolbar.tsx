import {
	Box,
	Button,
	Chip,
	FormControl,
	Input,
	InputLabel,
	MenuItem,
	Select,
	Switch,
	Typography,
} from '@material-ui/core';
import React, { Dispatch, FC, Fragment, SetStateAction } from 'react';
import { RoomList } from '../../../repos';
import Styles from './RoomingToolbar.module.scss';

interface RoomingToolbarProps {
	filterKeys: (keyof RoomList)[];
	filterOptions: (
		propertyValue: keyof RoomList
	) => (string | number | number[])[];
	filterState: number[] | RoomList[] | undefined;
	switchFloor: boolean;
	setFilterState: Dispatch<SetStateAction<number[] | RoomList[] | undefined>>;
	setSwitchFloor: Dispatch<React.SetStateAction<boolean>>;
}
const RoomingToolbar: FC<RoomingToolbarProps> = (props) => {
	const {
		filterKeys,
		filterOptions,
		filterState,
		setFilterState,
		setSwitchFloor,
		switchFloor,
	} = props;

	const selectHandler = (event: any, index: number) => {
		if (!filterState) return;
		let filterChange = [...filterState];
		filterChange[index] = event.target.value;
		console.log(`filterChange`, filterChange);
		setFilterState(filterChange as RoomList[]);
		console.log(`index`, index);
	};

	const renderFilterKeys = () => {
		return filterKeys.map((roomingKey, index) => {
			return (
				//TODO: Varaint Outlined not working
				<FormControl variant="outlined" className={Styles.formControl}>
					<InputLabel id="demo-mutiple-chip-label">
						{filterKeys[index]}
					</InputLabel>
					<Select
						labelId="demo-mutiple-chip-label"
						id="demo-mutiple-chip"
						// value={filterOptions(roomingKey)[index]}
						onChange={(event) => selectHandler(event, index)}
						input={<Input id="select-multiple-chip" className={Styles.input} />}
						renderValue={(selected: any) => (
							<div className={Styles.chips}>
								<Chip key={selected} label={selected} className={Styles.chip} />
							</div>
						)}
					>
						{filterOptions(roomingKey).map((filterOption, index) => (
							<MenuItem key={index.toString()} value={filterOption as string}>
								{filterOption}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			);
		});
	};

	return (
		<Box
			display="flex"
			alignItems="space-around"
			justifyContent="center"
			flexDirection="column"
		>
			<Box display="flex" alignItems="center" justifyContent="space-around">
				<Button
					onClick={() => {
						//TODOM: prevState didn't work see for it
						if (!filterState) return;
						let clearFilterState = [...filterState];
						clearFilterState = new Array(filterState.length).fill(-1);
						//TODOM: refactor this
						setFilterState(
							clearFilterState as number[] | RoomList[] | undefined
						);
					}}
					color="primary"
				>
					Clear All
				</Button>
				<Box display="flex" alignItems="center">
					{switchFloor ? (
						<Typography color="primary">Floor Map View</Typography>
					) : (
						<Typography color="primary">Room Card View</Typography>
					)}
					<Switch
						// classes={switchStyles}
						checked={switchFloor}
						onChange={(e) => setSwitchFloor(e.target.checked)}
					/>
				</Box>
			</Box>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				className={Styles.formControlContainer}
			>
				{renderFilterKeys()}
			</Box>
		</Box>
	);
};

export default RoomingToolbar;
