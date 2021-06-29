import {
	Checkbox,
	FormControl,
	IconButton,
	List,
	ListItem,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	Popover,
	Select,
} from '@material-ui/core';
import { FilterList as FilterListIcon } from '@material-ui/icons';
import React, { FC, Fragment, useMemo, useState } from 'react';
import { CustomButton } from '../../..';
import { Corpus, DataType } from '../../../../repos';
import Styles from './FilterRow.module.scss';

interface FilterRowProps {
	value: any;
	row: { index: number; original: any };
	column: {
		filterValue: string;
		setFilter: (event: any) => void;
		preFilteredRows: [];
		id: string;
		type: DataType;
		corpus: Corpus[];
	};
}

const FilterRow: FC<FilterRowProps> = (props) => {
	const {
		column: { filterValue, setFilter, id, type, corpus, preFilteredRows },
	} = props;
	const SelectColumnFilter = () => {
		const iconComponent = () => <FilterListIcon />;
		return (
			<FormControl>
				<Select
					disableUnderline
					// IconComponent={iconComponent}
					value={filterValue}
					onChange={(e) => {
						setFilter(e.target.value || undefined);
					}}
				>
					{corpus.map((option, i) => (
						<MenuItem key={i} value={option.title}>
							{option.title}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		);
	};

	const MultiSelectColumnFilter = () => {
		const [checked, setChecked] = useState<string[]>([]);

		const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

		const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
			setAnchorEl(event.currentTarget);
		};

		const handleClose = () => {
			setAnchorEl(null);
		};

		const open = Boolean(anchorEl);

		// Calculate the options for filtering
		// using the preFilteredRows

		const options = useMemo(() => {
			const options = new Set<any>();

			preFilteredRows.forEach((row: any) => {
				if (row.values[id] === undefined || row.values[id].length === 0) {
					return;
				}
				options.add(row.values[id]);
			});

			const reducedOptions = [...options.values()]
				.flat()
				.filter((value, index, array) => array.indexOf(value) === index);

			return reducedOptions;
		}, []);

		const handleToggle = (value: string) => () => {
			const currentIndex = checked.indexOf(value);
			const newChecked = [...checked];

			if (currentIndex === -1) {
				newChecked.push(value);
			} else {
				newChecked.splice(currentIndex, 1);
			}

			setChecked(newChecked);
			setFilter(newChecked);
		};

		// Render a multi-select box
		return (
			<Fragment>
				<IconButton className={Styles.button} onClick={handleClick}>
					<FilterListIcon />
				</IconButton>
				<Popover
					id={id}
					open={open}
					anchorEl={anchorEl}
					onClose={handleClose}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
				>
					<List dense>
						{options.map((value, index) => {
							const labelId = `checkbox-list-secondary-label-${value}`;
							return (
								<ListItem>
									<ListItemText id={labelId} primary={value} />
									<ListItemSecondaryAction>
										<Checkbox
											edge="end"
											onChange={handleToggle(value)}
											checked={checked.indexOf(value) !== -1}
											inputProps={{ 'aria-labelledby': labelId }}
										/>
									</ListItemSecondaryAction>
								</ListItem>
							);
						})}
					</List>
				</Popover>
			</Fragment>
		);
	};
	const renderFilter = () => {
		switch (type) {
			case DataType.Select:
				return SelectColumnFilter();
			case DataType.MultiSelect:
				return MultiSelectColumnFilter();
			default:
				return <Fragment></Fragment>;
		}
	};

	return renderFilter();
};

export default FilterRow;
