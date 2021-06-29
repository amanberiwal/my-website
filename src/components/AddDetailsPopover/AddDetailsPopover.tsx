import {
	Box,
	Paper,
	Popover,
	Typography,
	CircularProgress,
} from '@material-ui/core';
import React, { ReactNode } from 'react';
import { CustomButton } from '..';
import Styles from './AddDetailsPopover.module.scss';

interface AddDetailsPopoverProps {
	open: boolean;
	onClose: () => void;
	anchorEl: HTMLDivElement | HTMLButtonElement | null;
	id?: string;
	onClickSave: () => void;
	disabledSave?: boolean;
	children: ReactNode;
	title: ReactNode | string;
	loading?: boolean;
	bgColor?: string;
}

const AddDetailsPopover = (props: AddDetailsPopoverProps) => {
	const {
		open,
		onClose,
		anchorEl,
		id,
		onClickSave,
		disabledSave,
		children,
		title,
		loading,
		bgColor,

	} = props;

	return (
		<Popover
			id={id}
			open={open}
			anchorEl={anchorEl}
			onClose={onClose}
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'center',
			}}
			transformOrigin={{
				vertical: 'center',
				horizontal: 'center',
			}}
		>
			<Box className={Styles.popover}>
				<Paper
					square
					style={{ backgroundColor: bgColor }}
					className={Styles.popoverHeader}
				>
					<Typography>{title}</Typography>
				</Paper>
				<Box
					display="flex"
					p={2}
					flexDirection="column"
					alignItems="flex-start"
					width="100%"
					height="100%"
				>
					{children}
				</Box>
				<CustomButton
					style={{
						backgroundColor: bgColor,
						color: bgColor === '#fff1b0cf' ? '#000' : '#fff',
					}}
					className={Styles.saveButton}
					onClick={onClickSave}
					disabled={disabledSave}
					endIcon={
						loading && (
							<CircularProgress
								size={20}
								classes={{ colorPrimary: Styles.circleColor }}
							/>
						)
					}
				>
					Save
				</CustomButton>
			</Box>
		</Popover>
	);
};

export default AddDetailsPopover;
