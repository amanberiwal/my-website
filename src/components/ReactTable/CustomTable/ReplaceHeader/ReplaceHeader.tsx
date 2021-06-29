import { Box, TextField, Typography } from '@material-ui/core';
import React, { FC, useState } from 'react';
import { Corpus, DataType } from '../../../../repos';
import Styles from './ReplaceHeader.module.scss';
import { updateGuest } from '../../../../redux';
import { connect } from 'react-redux';
import { MultiSelectCell, SelectCell } from '..';

interface ReplaceHeaderProps {
	column: { id: string; type: string; corpus: Corpus[]; render: any };
	selectedRowArray: any;
	selectedProjectId: string;
	updateGuest: typeof updateGuest;
}
const ReplaceHeader: FC<ReplaceHeaderProps> = (props) => {
	const { column, selectedRowArray, updateGuest, selectedProjectId } = props;

	const [replaceValue, setReplaceValue] = useState<any>('');
	const [selectValue, setSelectValue] = useState<string>('');
	const [multiSelect, setMultiSelect] = useState<any>();

	const handleMultiReplaceText = (event: any) => {
		// setReplaceValue({
		// 	[event.target.id]: event.currentTarget.value,
		// });
		setReplaceValue(event.currentTarget.value);
	};

	const onBlurHandler = (value: any) => {
		if (selectedRowArray.length > 0) {
			selectedRowArray.map((selectedRow: any) =>
				updateGuest(selectedProjectId, selectedRow.guestId, column.id, value)
			);
		}
		//TODO: DO only one with object of replaceValue
		setReplaceValue('');
		setMultiSelect('');
		setSelectValue('');
	};

	const renderReplacer = () => {
		switch (column.type) {
			case DataType.Text:
				return (
					<TextField
						id={column.id}
						className={Styles.textField}
						label={
							<Typography className={Styles.headerText}>
								{column.render('Header')}
							</Typography>
						}
						value={replaceValue || ''} //replaceValue[column.id]
						InputProps={{ disableUnderline: true }}
						onClick={(event) => event.stopPropagation()}
						onChange={handleMultiReplaceText}
						onBlur={(event) => onBlurHandler(replaceValue)}
					/>
				);

			case DataType.Select:
				return (
					<Box display="flex" alignItems="flex-end" mb={3}>
						<SelectCell
							selectValue={selectValue}
							setSelectValue={setSelectValue}
							onBlur={() => onBlurHandler(selectValue)}
							corpus={column.corpus}
							label={
								<Typography className={Styles.headerText}>
									{column.render('Header')}
								</Typography>
							}
						></SelectCell>
						{/* Render the columns filter UI */}
						<div onClick={(event) => event.stopPropagation()}>
							{column.render('Filter')}
						</div>
					</Box>
				);

			case DataType.MultiSelect:
				return (
					<Box display="flex" alignItems="flex-end" mb={3}>
						<MultiSelectCell
							multiSelect={multiSelect}
							setMultiSelect={setMultiSelect}
							onBlur={() => onBlurHandler(multiSelect)}
							onDelete={(value: any) => onBlurHandler(value)}
							corpus={column.corpus}
							label={
								<Typography className={Styles.headerText}>
									{column.render('Header')}
								</Typography>
							}
						></MultiSelectCell>
						{/* Render the columns filter UI */}
						<div onClick={(event) => event.stopPropagation()}>
							{column.render('Filter')}
						</div>
					</Box>
				);

			default:
				return (
					<Box display="flex" flexDirection="column">
						<Typography
							className={
								column.type !== DataType.SelectionCheck
									? Styles.headerText
									: undefined
							}
						>
							{column.render('Header')}
						</Typography>

						{/* Render the columns filter UI */}
						<div onClick={(event) => event.stopPropagation()}>
							{column.render('Filter')}
						</div>
					</Box>
				);
		}
	};

	return renderReplacer();
};

export default connect(null, { updateGuest })(ReplaceHeader);
