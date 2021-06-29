import React, { FC, useEffect, useState } from 'react';
import { updateGuest } from '../../../../redux';
import { Corpus, DataType } from '../../../../repos';
import { SelectCell, MultiSelectCell } from '.';
import { TextField, Typography } from '@material-ui/core';
import { GuestlistDrawer } from '../..';
import Styles from './_EditableCommonStyles.module.scss';

interface EditableCellProps {
	value: any;
	row: { index: number; original: any };
	column: { id: string; type: string; corpus: Corpus[] };
	selectedProjectId: string;
	updateMyData: (index: number, id: string, textValue: any) => void;
	updateGuest: typeof updateGuest;
}

const inputStyle = {
	padding: 0,
	margin: 0,
	border: 0,
	background: 'transparent',
};

// Create an editable cell renderer
const EditableCell: FC<EditableCellProps> = (props) => {
	const {
		value: initialValue,
		row: { original },
		column: { id, type, corpus },
		selectedProjectId,
		updateGuest, // This is a custom function that we supplied to our table instance
	} = props;
	// We need to keep and update the state of the cell normally
	const [textValue = initialValue, setTextValue] = useState();
	const [selectValue = initialValue, setSelectValue] = useState();
	const [multiSelect = initialValue, setMultiSelect] = useState();
	const [drawerState, setDrawerState] = useState(false);

	const toggleDrawer = () => {
		setDrawerState(!drawerState);
	};

	if (id === 'roomNo') {
		console.log(`initialValue`, initialValue);
	}

	const textChangeHandler = (event: any) => {
		setTextValue(event.target.value);
	};

	const onEnterHandler = (event: any, value: any) => {
		const { guestId } = original;
		if (event.key === 'Enter') {
			updateGuest(selectedProjectId, guestId, id, value ? value : '');
			event.target.blur();
		}
	};

	// We'll only update the external data when the input is blurred
	const onBlurHandler = (value: any) => {
		const { guestId } = original;

		if (value === initialValue) {
			return;
		}

		// if (Array.isArray(value)) console.table(id, value);
		updateGuest(selectedProjectId, guestId, id, value ? value : '');
	};

	// If the initialValue is changed externall, sync it up with our state

	const dataType = () => {
		switch (type) {
			case DataType.Text:
				return (
					<TextField
						style={inputStyle}
						variant="standard"
						value={textValue}
						onChange={textChangeHandler}
						onBlur={() => onBlurHandler(textValue)}
						InputProps={{ classes: { underline: Styles.textFieldUnderline } }}
						onKeyDown={(event) => onEnterHandler(event, textValue)}
					/>
				);

			case DataType.Select:
				return (
					<SelectCell
						selectValue={selectValue}
						setSelectValue={setSelectValue}
						onBlur={() => onBlurHandler(selectValue)}
						corpus={corpus}
					></SelectCell>
				);

			case DataType.MultiSelect:
				return (
					<MultiSelectCell
						multiSelect={multiSelect}
						setMultiSelect={setMultiSelect}
						onBlur={() => onBlurHandler(multiSelect)}
						onDelete={(value: any) => onBlurHandler(value)}
						corpus={corpus}
					></MultiSelectCell>
				);

			case DataType.Drawer:
				return (
					<>
						<Typography onClick={() => setDrawerState(true)}>
							{initialValue}
						</Typography>
						{drawerState && (
							<GuestlistDrawer
								clickType="guestDetails"
								state={drawerState}
								toggleState={toggleDrawer}
								guestDetail={original}
								selectedProjectId={selectedProjectId}
							/>
						)}
					</>
				);

			default:
				console.log(`initialValue`, initialValue);
				return <span>{initialValue}</span>;
		}
	};

	return dataType();
};

export default EditableCell;
