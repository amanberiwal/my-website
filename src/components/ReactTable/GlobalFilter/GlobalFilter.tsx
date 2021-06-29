import React, { FC } from 'react';
import { Box, IconButton, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

interface GlobalFilterProps {
	preGlobalFilteredRows: [];
	globalFilter: string;
	setGlobalFilter: (event: string | undefined) => void;
}

const GlobalFilter: FC<GlobalFilterProps> = (props) => {
	const { preGlobalFilteredRows, globalFilter, setGlobalFilter } = props;

	const count = preGlobalFilteredRows.length;

	// Global filter only works with pagination from the first page.
	// This may not be a problem for server side pagination when
	// only the current page is downloaded.

	return (
		<Box
			justifyContent="center"
			display="flex"
			border={1}
			borderRadius={50}
			width="30vw"
		>
			<IconButton aria-label="search">
				<SearchIcon />
			</IconButton>
			<InputBase
				value={globalFilter || ''}
				onChange={(e) => {
					setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
				}}
				placeholder={`${count} records...`}
				inputProps={{ 'aria-label': 'search' }}
			/>
		</Box>
	);
};

export default GlobalFilter;
