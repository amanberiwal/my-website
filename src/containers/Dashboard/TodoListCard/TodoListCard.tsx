import {
	Box,
	Checkbox,
	FormControl,
	FormGroup,
	IconButton,
} from '@material-ui/core';
import React, {
	ChangeEvent,
	Fragment,
	useState,
	MouseEvent,
	FC,
	useMemo,
} from 'react';
import { CustomCard } from '../../../components';
import { Add } from '@material-ui/icons';
import Styles from './TodoListCard.module.scss';
import { DeleteOutline as DeleteOutlineIcon } from '@material-ui/icons';
import { RootState, updateTodoMark, deleteTodo } from '../../../redux';
import { connect } from 'react-redux';
import { ProjectTodo, User } from '../../../repos';
import { TodoPopover } from '.';

interface TodoListCardProps {
	selectedProjectId: string | null;
	updateTodoMark: typeof updateTodoMark;
	deleteTodo: typeof deleteTodo;
	projectTodos?: ProjectTodo[];
	users?: User[];
	loading?: boolean;
}

const TodoListCard: FC<TodoListCardProps> = (props) => {
	const { selectedProjectId, deleteTodo, updateTodoMark, users, loading } =
		props;

	const projectTodos = useMemo(() => {
		if (!props.projectTodos) return;
		return props.projectTodos.filter((projectTodo) => !projectTodo.isCalendar);
	}, [props.projectTodos]);

	const [anchorEl, setAnchorEl] = useState<
		HTMLButtonElement | HTMLDivElement | null
	>(null);
	const [
		todoComplete = projectTodos &&
			projectTodos.map((projectTodo) => projectTodo.isCompleted),
		setTodoComplete,
	] = useState<(boolean | undefined)[]>();
	const [selectedTodo, setSelectedTodo] = useState<ProjectTodo>();

	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		setSelectedTodo(undefined);
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? 'simple-popover-todo' : undefined;

	const handleChange = (
		event: ChangeEvent<HTMLInputElement>,
		index: number,
		todoId: string
	) => {
		if (!todoComplete || !selectedProjectId) return;
		let todoArray = [...todoComplete];
		todoArray[index] = event.target.checked;
		updateTodoMark(selectedProjectId, todoId, event.target.checked);
		setTodoComplete(todoArray);
	};

	const editTodoHandler = (
		event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
		todo: ProjectTodo
	) => {
		setSelectedTodo(todo);
		setAnchorEl(event.currentTarget);
	};

	const deleteTodoHandler = (todoId: string | undefined) => {
		if (!selectedProjectId || !todoId) return;
		deleteTodo(selectedProjectId, todoId);
	};

	return (
		<CustomCard
			title={`To Do List`}
			cardColor="#fff1b0cf"
			action={
				<Fragment>
					<IconButton
						aria-label="todo-list-creator"
						className={Styles.pointer}
						onClick={handleClick}
					>
						<Add />
					</IconButton>
					{/* Todo: Make this popover for event card & todo common */}
					<TodoPopover
						id={id}
						anchorEl={anchorEl}
						loading={loading}
						onClose={handleClose}
						selectedProjectId={selectedProjectId}
						users={users}
						key={
							selectedTodo
								? selectedTodo.todoId
								: `${projectTodos ? projectTodos.length : '1'}`
						}
						selectedTodo={selectedTodo}
						setAnchorEl={setAnchorEl}
					/>
				</Fragment>
			}
		>
			<FormControl component="fieldset">
				<FormGroup>
					{projectTodos
						? projectTodos.map((projectTodo, index) => {
								return (
									<Box
										display="flex"
										alignItems="center"
										justifyContent="space-between"
									>
										<Box display="flex" alignItems="center">
											<Checkbox
												checked={todoComplete && todoComplete[index]}
												onChange={(event) =>
													handleChange(
														event,
														index,
														projectTodo.todoId as string
													)
												}
												name={projectTodo.name}
											/>
											<Box
												mx={2}
												onClick={(
													event: MouseEvent<
														HTMLDivElement,
														globalThis.MouseEvent
													>
												) => editTodoHandler(event, projectTodo)}
											>
												{projectTodo.name}
											</Box>
										</Box>
										<IconButton
											onClick={() => deleteTodoHandler(projectTodo.todoId)}
										>
											<DeleteOutlineIcon
												className={Styles.delete}
											></DeleteOutlineIcon>
										</IconButton>
									</Box>
								);
						  })
						: null}
				</FormGroup>
			</FormControl>
		</CustomCard>
	);
};

const mapStateToProps = (state: RootState) => {
	const { projectTodos, loading } = state.Dashboard;
	const { users } = state.Project;
	return { projectTodos, users, loading };
};

export default connect(mapStateToProps, {
	updateTodoMark,
	deleteTodo,
})(TodoListCard);
