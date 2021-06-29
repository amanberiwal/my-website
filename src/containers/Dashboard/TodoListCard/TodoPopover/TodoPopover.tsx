import React, { SetStateAction, useState } from 'react';
import { AddDetailsPopover } from '../../../../components';
import { TextField, MenuItem, Box, Avatar } from '@material-ui/core';
import Styles from './TodoPopover.module.scss';
import { connect } from 'react-redux';
import { createTodo, updateTodo } from '../../../../redux';
import { ProjectTodo, User } from '../../../../repos';
import firebase from '../../../../firebase.config';
import format from 'date-fns/format/index';

interface TodoPopoverProps {
	id: string | undefined;
	anchorEl: HTMLDivElement | HTMLButtonElement | null;
	onClose: () => void;
	loading?: boolean;
	selectedProjectId: string | null;
	createTodo: typeof createTodo;
	updateTodo: typeof updateTodo;
	users?: User[];
	selectedTodo?: ProjectTodo;
	setAnchorEl: (
		value: SetStateAction<HTMLDivElement | HTMLButtonElement | null>
	) => void;
}

const TodoPopover = (props: TodoPopoverProps) => {
	const {
		id,
		anchorEl,
		onClose,
		selectedProjectId,
		loading,
		createTodo,
		updateTodo,
		users,
		selectedTodo,
		setAnchorEl,
	} = props;

	const [todoName = selectedTodo ? selectedTodo.name : '', setTodoName] =
		useState<string>();
	const [
		todoDescription = selectedTodo ? selectedTodo.description : '',
		setTodoDescription,
	] = useState<string>();
	const [
		todoDate = selectedTodo ? selectedTodo.todoDate.toDate() : new Date(),
		setTodoDate,
	] = useState<Date | string>();
	const [
		todoAssigned = selectedTodo ? selectedTodo.assigned : '',
		setTodoAssigned,
	] = useState<string>();

	const saveTodoHandler = () => {
		if (!selectedProjectId) return;
		createTodo(selectedProjectId, {
			name: todoName,
			createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
			description: todoDescription,
			assigned: todoAssigned,
			todoDate: firebase.firestore.Timestamp.fromDate(new Date(todoDate)),
			isCalendar: false,
		});
		setAnchorEl(null);
	};

	const updateTodoHandler = () => {
		if (!selectedProjectId || !selectedTodo || !selectedTodo.todoId) return;
		updateTodo(selectedProjectId, selectedTodo.todoId, {
			name: todoName,
			updatedAt: firebase.firestore.Timestamp.fromDate(new Date()),
			description: todoDescription,
			assigned: todoAssigned,
			todoDate: firebase.firestore.Timestamp.fromDate(new Date(todoDate)),
		});
		setAnchorEl(null);
	};

	return (
		<AddDetailsPopover
			id={id}
			open={Boolean(anchorEl)}
			anchorEl={anchorEl}
			onClose={onClose}
			title={<span className={Styles.popoverTitle}>Add a Todo</span>}
			onClickSave={selectedTodo ? updateTodoHandler : saveTodoHandler}
			disabledSave={!todoName}
			loading={loading}
			bgColor="#fff1b0cf"
		>
			<TextField
				className={Styles.eventTitleTextField}
				id="title-for-event"
				label="Name"
				value={todoName}
				onChange={(event) => setTodoName(event.target.value)}
			/>
			<TextField
				id="todo-description"
				label="Description"
				multiline
				rows={2}
				value={todoDescription}
				onChange={(event) => setTodoDescription(event.target.value)}
			/>
			<TextField
				id="date"
				label="Compeletion Date"
				type="date"
				defaultValue={
					todoDate instanceof Date ? format(todoDate, 'yyyy-MM-dd') : todoDate
				}
				onChange={(event) => setTodoDate(event.target.value)}
				InputLabelProps={{
					shrink: true,
				}}
			/>
			<TextField
				id="standard-select-currency"
				select
				label="Assigned To"
				helperText="Please select a member"
				value={todoAssigned}
				onChange={(event) => setTodoAssigned(event.target.value)}
				SelectProps={{ classes: { root: Styles.menuItem } }}
			>
				{users
					? users.map((user) => (
							<MenuItem key={user.userId} value={user.userId}>
								<Avatar alt="user-avatar" src={user.profilePicture} />
								<Box mx={2}>{user.name}</Box>
							</MenuItem>
					  ))
					: null}
			</TextField>
		</AddDetailsPopover>
	);
};

export default connect(null, { createTodo, updateTodo })(TodoPopover);
