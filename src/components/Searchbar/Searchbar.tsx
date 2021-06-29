import {
	IconButton,
	InputBase,
	InputBaseProps,
	Paper,
} from '@material-ui/core';
import React, { FC } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import Styles from './Searchbar.module.scss';

interface SearchProps extends InputBaseProps {}

export const Searchbar: FC<SearchProps> = (props) => {
	const { onChange, placeholder, value } = props;

	return (
		<Paper component="form" className={Styles.paper}>
			<IconButton aria-label="search">
				<SearchIcon />
			</IconButton>
			<InputBase
				placeholder={placeholder}
				inputProps={{ 'aria-label': 'search projects' }}
				color="primary"
				onChange={onChange}
				value={value || ''}
				
			/>
		</Paper>
	);
};
