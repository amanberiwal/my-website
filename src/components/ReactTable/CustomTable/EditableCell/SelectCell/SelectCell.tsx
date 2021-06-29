/* eslint-disable no-use-before-define */
import React, { Dispatch, FC } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Styles from './SelectCell.module.scss';
import { Corpus } from '../../../../../repos';

interface SelectCellProps {
	selectValue: string;
	setSelectValue: Dispatch<any>;
	onBlur: () => void;
	corpus: Corpus[];
	label?: JSX.Element;
}

const SelectCell: FC<SelectCellProps> = (props) => {
	const { selectValue, setSelectValue, onBlur, corpus, label } = props;

	return (
		<Autocomplete
			value={{ title: selectValue }}
			onChange={(event, newValue) => {
				event.stopPropagation();
				if (typeof newValue === 'string') {
					setSelectValue(newValue);
				} else if (newValue && newValue.inputValue) {
					// Create a new selectValue from the user input
					setSelectValue(newValue.inputValue);
				} else {
					setSelectValue(newValue?.title);
				}
			}}
			selectOnFocus
			clearOnBlur
			onBlur={onBlur}
			handleHomeEndKeys
			id="free-solo-with-text-demo"
			options={corpus}
			getOptionLabel={(option) => {
				// Value selected with enter, right from the input

				if (typeof option === 'string') {
					return option;
				}
				// Add "xxx" option created dynamically
				if (option.inputValue) {
					return option.inputValue;
				}
				// Regular option
				return option.title || '';
			}}
			renderOption={(option) => option.title}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="standard"
					onClick={(event) => event.stopPropagation()}
					label={label}
					InputProps={{
						...params.InputProps,
						classes: { underline: Styles.textFieldUnderline },
					}}
				/>
			)}
		/>
	);
};

export default SelectCell;

// filterOptions={(options, params) => {
// 	const filtered = filter(options, params);

// 	// Suggest the creation of a new selectValue
// 	if (params.inputValue !== '') {
// 		filtered.push({
// 			inputValue: params.inputValue,
// 			title: `Add "${params.inputValue}"`,
// 		});
// 	}

// 	return filtered;
// }}
