import React, { FC, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import { GuestlistDrawer } from '../GuestlistDrawer';
import { CustomButton } from '../../CustomButton';
import { connect } from 'react-redux';
import { createGuestHeaders } from '../../../redux';

interface AddUserProps {
	selectedProjectId: string;
	createHeaders?: boolean;
	createGuestHeaders: typeof createGuestHeaders;
}

const AddUserDialog: FC<AddUserProps> = (props) => {
	const { selectedProjectId, createHeaders, createGuestHeaders } = props;

	const [drawerState, setDrawerState] = useState(false);

	const toggleDrawer = () => {
		if (!drawerState && createHeaders) {
			createGuestHeaders(selectedProjectId);
		}
		setDrawerState(!drawerState);
	};

	return (
		<div>
			<Tooltip title="Add Guest">
				<CustomButton startIcon={<AddIcon />} onClick={toggleDrawer}>
					Add Guests
				</CustomButton>
			</Tooltip>
			{drawerState && (
				<GuestlistDrawer
					clickType="addGuest"
					state={drawerState}
					toggleState={toggleDrawer}
					selectedProjectId={selectedProjectId}
				/>
			)}
		</div>
	);
};

export default connect(null, { createGuestHeaders })(AddUserDialog);
