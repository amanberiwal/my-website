/* eslint-disable no-use-before-define */
import React, { Dispatch, FC } from 'react';
import Chip from '@material-ui/core/Chip';
import {
	createFilterOptions,
	Autocomplete,
	FilterOptionsState,
} from '@material-ui/lab';
import TextField from '@material-ui/core/TextField';
import Styles from './MultiSelectCell.module.scss';
import { Close as CloseIcon } from '@material-ui/icons';
import { Corpus } from '../../../../../repos';

interface MultiSelectProps {
	multiSelect: any;
	setMultiSelect: Dispatch<any>;
	onBlur: () => void;
	onDelete: (value: any) => void;
	corpus: Corpus[];
	label?: JSX.Element;
}

const filter = createFilterOptions<Corpus>();

const MultiSelectCell: FC<MultiSelectProps> = (props) => {
	const {
		multiSelect,
		setMultiSelect,
		onBlur,
		onDelete,
		corpus,
		label,
	} = props;

	//This is being used to convert the array into interface FilmOptionType
	const multiSelectArray =
		Array.isArray(multiSelect) &&
		multiSelect.map((option: string) => {
			return { title: option };
		});

	return (
		<Autocomplete
			multiple
			limitTags={3}
			value={(multiSelectArray as Corpus[]) || []}
			id="tags-filled"
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
				return option.title;
			}}
			freeSolo
			filterOptions={(
				options: Corpus[],
				params: FilterOptionsState<Corpus>
			) => {
				const filtered = filter(options, params);

				// Suggest the creation of a new value
				if (params.inputValue !== '') {
					filtered.push({
						inputValue: `Add "${params.inputValue}"`,
						title: params.inputValue,
					});
				}

				return filtered;
			}}
			renderTags={(value: Corpus[], getTagProps: any) =>
				value.map((option: Corpus, index: number) => {
					return (
						<Chip
							size="small"
							deleteIcon={<CloseIcon />}
							label={option.title}
							{...getTagProps({ index })}
							onDelete={(event) => {
								const multiArray = multiSelect.filter(
									(array: string) => !array.includes(option.title)
								);

								//TODO: This onDelete is Our Function to delete the chip from firebase
								onDelete(multiArray);
								setMultiSelect(multiArray);
							}}
						/>
					);
				})
			}
			//TODO: Fix Typing issue below since value in union type
			onChange={(event, value) =>
				setMultiSelect(value.map((option: any) => option.title))
			}
			onBlur={onBlur}
			renderInput={(params) => (
				<TextField
					{...params}
					variant="standard"
					onClick={(event) => event.stopPropagation()}
					label={label}
					InputProps={{
						...params.InputProps,
						classes: {
							root: Styles.textFieldWidth,
							underline: Styles.textFieldUnderline,
						},
					}}
				/>
			)}
		/>
	);
};

export default MultiSelectCell;
