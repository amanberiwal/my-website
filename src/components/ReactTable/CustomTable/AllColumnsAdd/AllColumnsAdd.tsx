import { Box, TableCell } from '@material-ui/core';
import React from 'react';
import { IndeterminateCheckbox } from '..';
import { DataType, TableType } from '../../../../repos';

export const AllColumnsAdd = (columns: any, tableType: TableType) => {
	switch (tableType) {
		case TableType.Rooming:
			return [
				// Let's make a column for selection
				{
					id: DataType.SelectionCheck,
					type: DataType.SelectionCheck,
					// The header can use the table's getToggleAllRowsSelectedProps method
					// to render a checkbox.  Pagination is a problem since this will select all
					// rows even though not all rows are on the current page.  The solution should
					// be server side pagination.  For one, the clients should not download all
					// rows in most cases.  The client should only download data for the current page.
					// In that case, getToggleAllRowsSelectedProps works fine.
					Header: ({
						getToggleAllRowsSelectedProps,
					}: {
						getToggleAllRowsSelectedProps: any;
					}) => (
						<Box>
							<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
						</Box>
					),
					// The cell can use the individual row's getToggleRowSelectedProps method
					// to the render a checkbox
					Cell: ({ row }: { row: any }) => {
						return (
							<Box>
								<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
							</Box>
						);
					},
					sticky: 'left',
				},
				{
					id: DataType.RoomGroup,
					type: DataType.Drawer,
					accessor: DataType.RoomGroup,
					// The header can use the table's getToggleAllRowsSelectedProps method
					// to render a checkbox.  Pagination is a problem since this will select all
					// rows even though not all rows are on the current page.  The solution should
					// be server side pagination.  For one, the clients should not download all
					// rows in most cases.  The client should only download data for the current page.
					// In that case, getToggleAllRowsSelectedProps works fine.
					Header: ({ column }: { column: any }) => (
						<span {...column.getGroupByToggleProps()}></span>
					),
					Cell: ({ value, row }: { value: any; row: any }) => {
						if (!value) {
							return <span>{null}</span>;
						} else {
							return <span></span>;
						}
					},
					// The cell can use the individual row's getToggleRowSelectedProps method
					// to the render a checkbox
				},
				...columns,
			];
		case TableType.Guest:
		default:
			return [
				// Let's make a column for selection
				{
					id: DataType.SelectionCheck,
					type: DataType.SelectionCheck,
					// The header can use the table's getToggleAllRowsSelectedProps method
					// to render a checkbox.  Pagination is a problem since this will select all
					// rows even though not all rows are on the current page.  The solution should
					// be server side pagination.  For one, the clients should not download all
					// rows in most cases.  The client should only download data for the current page.
					// In that case, getToggleAllRowsSelectedProps works fine.
					Header: ({
						getToggleAllRowsSelectedProps,
					}: {
						getToggleAllRowsSelectedProps: any;
					}) => (
						<Box>
							<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
						</Box>
					),
					// The cell can use the individual row's getToggleRowSelectedProps method
					// to the render a checkbox
					Cell: ({ row }: { row: any }) => {
						return (
							<Box>
								<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
							</Box>
						);
					},
					sticky: 'left',
				},
				...columns,
			];
	}
};
