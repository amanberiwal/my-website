import React, { FC, useState } from 'react';
import MailOutlineRoundedIcon from '@material-ui/icons/MailOutlineRounded';
import { IconButton, Tooltip, Box } from '@material-ui/core';
import { GuestlistDrawer } from '../GuestlistDrawer';
import { CustomButton } from '../../CustomButton';
import { GuestData } from '../../../repos';

interface SendInvitesProps {
	selectedProjectId: string;
	selectedRowArray: GuestData[];
}

const SendInvitesDialog: FC<SendInvitesProps> = (props) => {
	const { selectedProjectId, selectedRowArray } = props;

	const [drawerState, setDrawerState] = useState(false);

	const toggleDrawer = () => setDrawerState(!drawerState);

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			// width="30vw"
		>
			<Tooltip title="Add">
				<CustomButton startIcon={<MailOutlineRoundedIcon />} onClick={toggleDrawer}>
					Send Invites
				</CustomButton>
			</Tooltip>
			{drawerState && (
				<GuestlistDrawer
					clickType="sendInvites"
					state={drawerState}
					toggleState={toggleDrawer}
					selectedProjectId={selectedProjectId}
					selectedRowArray={selectedRowArray}
				/>
			)}
		</Box>
	);
};

export default SendInvitesDialog;
