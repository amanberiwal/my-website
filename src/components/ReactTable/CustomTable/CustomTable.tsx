//@ts-nocheck  // TODO: Need to be removed in future (Currently React Table has types issue)

import React, { Dispatch, FC, Fragment, useMemo } from 'react';
import {
	Table as MaUTable,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Box,
	Badge,
	Chip,
} from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import DoneIcon from '@material-ui/icons/Done';
import Avatar from '@material-ui/core/Avatar';
import { TableToolbar } from '..';
import {
	useGlobalFilter,
	usePagination,
	useRowSelect,
	useSortBy,
	useTable,
	useFilters,
	useGroupBy,
	useExpanded,
} from 'react-table';
import { TableHeader, GuestData, Project, DataType } from '../../../repos';
import { updateGuest, deleteGuest, setSelectedRows } from '../../../redux';
import { connect } from 'react-redux';
import Styles from './CustomTable.module.scss';
import {
	EditableCell,
	FilterRow,
	AllColumnsAdd,
	IndeterminateCheckbox,
} from '.';
import { ReplaceHeader } from './ReplaceHeader';
import { TableType } from './AllColumnsAdd';
import { useSticky } from 'react-table-sticky';
import {
	ExpandLessRounded as ExpandLessRoundedIcon,
	ExpandMoreRounded as ExpandMoreRoundedIcon,
} from '@material-ui/icons/';

interface CustomTableProps {
	columns: TableHeader[];
	data: GuestData[];
	updateMyData: (rowIndex: any, columnId: any, value: any) => void;
	setData: Dispatch<any>;
	skipPageReset: boolean;
	updateGuest: typeof updateGuest;
	deleteGuest: typeof deleteGuest;
	selectedProjectId: string | null;
	projects: Project[];
	tableType?: TableType;
	initialState?: any;
	setSelectedRows: typeof setSelectedRows;
}

//to make checkbox to be position = fixed

const CustomTable: FC<CustomTableProps> = (props) => {
	const {
		columns,
		data,
		updateMyData,
		skipPageReset,
		updateGuest,
		deleteGuest,
		selectedProjectId,
		projects,
		tableType,
		initialState,
		setSelectedRows,
	} = props;
	const defaultColumn = useMemo(() => {
		return {
			// Set our editable cell renderer as the default Cell renderer
			Cell: EditableCell,
			// Let's set up our default Filter UI
			Filter: FilterRow,
			aggregate: 'unique',
			Aggregated: ({ value, column, row }) => {
				//TODO: Make all accessor's or column.id's enum and remove string
				console.log('debug',column.id)
				switch (column.id) {
					
					case 'lastName':
						return(
							<div>
								{value[0]}
								<strong className={Styles.randomShit}>{`+${value.length}`}</strong>
							</div>

						);
					case 'hotelName':
					case 'roomNo':
						return <span>{value}</span>;
					case DataType.SelectionCheck:
						return (
							<div>
								<IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
							</div>
						);

					default:
						return (
							<div>
								{/* {value[0]} */}
								{value[0]}
								{/* <Badge badgeContent={`+${value.length}`} color="primary">
									
								</Badge> */}
							</div>
						);
				}
			},
		};
	}, []);

	const {
		getTableProps,
		getToggleHideAllColumnsProps,
		allColumns,
		headerGroups,
		prepareRow,
		page,
		gotoPage,
		setPageSize,
		preGlobalFilteredRows,
		setGlobalFilter,
		state: {
			pageIndex,
			pageSize,
			selectedRowIds,
			globalFilter,
			// groupBy,
			// expanded,
		},
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			autoResetPage: !skipPageReset,
			initialState,
			// updateMyData isn't part of the API, but
			// anything we put into these options will
			// automatically be available on the instance.
			// That way we can call this function from our
			// cell renderer!
			selectedProjectId,
			updateMyData,
			updateGuest,
		},
		useGlobalFilter,
		useFilters,
		useGroupBy,
		useSortBy,
		useExpanded,
		usePagination,
		useRowSelect,
		useSticky,

		(hooks) => {
			hooks.allColumns.push((columns) => AllColumnsAdd(columns, tableType));
		}
	);

	const handleChangePage = (event, newPage) => {
		gotoPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setPageSize(Number(event.target.value));
	};

	const addByIndexs = (array, indexs) =>
		array.filter((_, i) => indexs.includes(i));

	const selectedRowArray = useMemo(() => {
		const newData = addByIndexs(
			data,
			Object.keys(selectedRowIds).map((x) => parseInt(x, 10))
		);
		setSelectedRows(newData);
		return newData;
	}, [data, selectedRowIds, setSelectedRows]);

	const deleteUserHandler = (event) => {
		selectedRowArray.map((selectedRow, index) => {
			return deleteGuest(selectedProjectId, selectedRow.guestId);
		});
	};

	// Render the UI for your table
	return (
		<>
			<TableContainer className={Styles.tableContainer}>
				{/* <pre>
					<code>{JSON.stringify({ groupBy, expanded }, null, 2)}</code>
				</pre> */}
				<TableToolbar
					numSelected={Object.keys(selectedRowIds).length}
					selectedRowIds={Object.keys(selectedRowIds)}
					deleteUserHandler={deleteUserHandler}
					preGlobalFilteredRows={preGlobalFilteredRows}
					setGlobalFilter={setGlobalFilter}
					globalFilter={globalFilter}
					selectedProjectId={selectedProjectId}
					guestData={data}
					projects={projects}
					selectedRowArray={selectedRowArray}
					allColumns={allColumns}
					getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
					tableType={tableType}
				/>
				<MaUTable {...getTableProps()}>
					<TableHead>
						{headerGroups.map((headerGroup) => (
							<TableRow {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => {
									return (
										<TableCell
											{...(column.id === 'selection'
												? column.getHeaderProps()
												: column.getHeaderProps(column.getSortByToggleProps()))}
										>
											<Box
												display="flex"
												justifyContent="space-around"
												alignItems="center"
											>
												{/* Add TextField MUI in this */}

												<ReplaceHeader
													selectedRowArray={selectedRowArray}
													column={column}
													selectedProjectId={selectedProjectId}
												/>

												{column.id !== 'selection' ? (
													<TableSortLabel
														active={column.isSorted}
														// react-table has a unsorted state which is not treated here
														direction={column.isSortedDesc ? 'desc' : 'asc'}
													/>
												) : null}
											</Box>
										</TableCell>
									);
								})}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						{page.map((row: any, i: number) => {
							prepareRow(row);
							return (
								<TableRow {...row.getRowProps()}>
									{row.cells.map((cell: any) => {
										return (
											<TableCell
												{...cell.getCellProps()}
												className={
													cell.isGrouped
														? Styles.groupCell
														: cell.isAggregated
														? Styles.aggregatedCell
														: cell.isPlaceholder
														? Styles.placeholderCell
														: Styles.defaultCell
												}
											>
												{/* {cell.isAggregated
													? // If the cell is aggregated, use the Aggregated
													  // renderer for cell
													  null
													: // For cells with repeated values, render null
													  // Otherwise, just render the regular cell
													  cell.render('Cell')} */}
												{cell.isGrouped ? (
													// If it's a grouped cell, add an expander and row count
													<>
														<span
															{...row.getToggleRowExpandedProps()}
															style={{ width: '10px', padding: '10px' }}
														>
															{row.isExpanded ? (
																<ExpandLessRoundedIcon
																	color="primary"
																	fontSize="large"
																/>
															) : (
																<ExpandMoreRoundedIcon fontSize="large" />
															)}
														</span>
													</>
												) : cell.isAggregated ? (
													// If the cell is aggregated, use the Aggregated
													// renderer for cell
													cell.render('Aggregated')
												) : (
													// For cells with repeated values, render null
													// Otherwise, just render the regular cell
													cell.render('Cell')
												)}
											</TableCell>
										);
									})}
								</TableRow>
							);
						})}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[
									5,
									10,
									25,
									{ label: 'All', value: data.length },
								]}
								colSpan={3}
								count={data.length}
								rowsPerPage={pageSize}
								page={pageIndex}
								SelectProps={{
									inputProps: { 'aria-label': 'rows per page' },
									native: true,
								}}
								onChangePage={handleChangePage}
								onChangeRowsPerPage={handleChangeRowsPerPage}
								// ActionsComponent={TablePaginationActions}
							/>
						</TableRow>
					</TableFooter>
				</MaUTable>
			</TableContainer>
		</>
	);
};

const mapStateToProps = (state: RootState) => {
	const { projects } = state.Project;
	return { projects };
};

export default connect(mapStateToProps, {
	updateGuest,
	deleteGuest,
	setSelectedRows,
})(CustomTable);
