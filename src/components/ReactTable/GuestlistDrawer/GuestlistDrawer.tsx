import React, { FC, useCallback, useState } from 'react';
import clsx from 'clsx';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Styles from './GuestlistDrawer.module.scss';
import { CustomButton } from '../../CustomButton';
import { AddRounded } from '@material-ui/icons';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DescriptionIcon from '@material-ui/icons/Description';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { GuestData, Project, User } from '../../../repos';
import { createGuest, RootState, updateGuest } from '../../../redux';
import { connect } from 'react-redux';
import { Email, FirebaseStorageReference, uploadFiles } from '../../../utils';
import { CircularProgress, Drawer } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { generate } from 'rxjs';
import { Toast, Variant } from '../../../components';
import firebase from '../../../firebase.config';
import parse from 'html-react-parser';
import IconButton from '@material-ui/core/IconButton';
import AttachmentIcon from '@material-ui/icons/Attachment';
import { generateEmailBody } from './utils';
import { Alert, AlertTitle } from '@material-ui/lab';

const initialUser: Partial<GuestData> = {
	firstName: '',
	lastName: '',
	contactEmail: '',
	contactPhone: '',
};

interface GuestlistDrawerProps {
	clickType: string;
	state: boolean;
	toggleState: (state: boolean) => void;
	guestDetail?: GuestData;
	createGuest: typeof createGuest;
	updateGuest: typeof updateGuest;
	selectedProjectId: string;
	currentUser?: User | null;
	projects?: Project[];
	guestsData?: GuestData[];
	selectedRowArray?: GuestData[];
}

const useStyles = makeStyles({
	list: {
		width: 400,
		padding: '40px 25px',
	},
	fullList: {
		width: 'auto',
	},
});

const GuestlistDrawer: FC<GuestlistDrawerProps> = (props) => {
	const {
		clickType,
		state,
		toggleState,
		guestDetail,
		createGuest,
		updateGuest,
		selectedProjectId,
		currentUser,
		projects,
		guestsData,
		selectedRowArray,
	} = props;

	const classes = useStyles();
	const toggleDrawer = (open: boolean) => (
		event: React.KeyboardEvent | React.MouseEvent
	) => {
		if (
			event &&
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}
		toggleState(open);
	};

	// ---------- Add a new Guest/Upload Guestlist sheet handlers ----------
	const [user, setUser] = useState(
		clickType === 'addGuest' ? initialUser : guestDetail
	);
	const [
		guestSheetUploadProgress,
		setGuestSheetUploadProgress,
	] = useState<boolean>();
	const [attachmentProgress, setAttachmentProgress] = useState<boolean>();

	const handleAddUser = (event: any) => {
		// TODO: change user to guest in states
		if (user) {
			createGuest(selectedProjectId, user);
		}
		setUser(initialUser);
		toggleDrawer(false);
	};

	const uploadGuestSheet = useCallback(
		(file: File) => {
			if (!currentUser) {
				return;
			}
			setGuestSheetUploadProgress(true);
			const folderReference = FirebaseStorageReference.SheetQueueFiles(
				currentUser.clientId,
				selectedProjectId,
				currentUser.userId
			);
			uploadFiles(folderReference.fullPath, file).subscribe((progress) => {
				if (progress.downloadURL) {
					setGuestSheetUploadProgress(false);
				}
			});
		},
		[currentUser, selectedProjectId]
	);
	// ---------------------------------------------------------------------

	// ------ Edit User Details, Add Document and Send Email handlers ------
	const [tabValue, setTabValue] = useState(0);
	const [emailData, setEmailData] = useState({
		rxEmailId: guestDetail?.contactEmail,
		subject: '',
		message: '',
	});

	const [sendEmailStatus, setSendEmailStatus] = useState<boolean>();
	const smtpPassword =
		projects &&
		projects.filter(
			(project: Project) => project.projectId === selectedProjectId
		)[0].password
			? true
			: false;

	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
		setTabValue(newValue);
	};

	const handleUserDetailsUpdate = (name: string) => ({
		target: { value },
	}: any) => {
		if (user) {
			setUser({ ...user, [name]: value });
		}
	};

	const updateGuestDetails = () => {
		if (user && guestDetail) {
			const userKeys = Object.keys(user) as Array<keyof GuestData>;
			userKeys.forEach((value) => {
				user[value] !== guestDetail[value] &&
					user.guestId &&
					updateGuest(selectedProjectId, user.guestId, value, user[value]);
			});
		}
	};

	const uploadAttachment = useCallback(
		(file: File) => {
			if (!currentUser) {
				return;
			}
			setAttachmentProgress(true);
			const folderReference = FirebaseStorageReference.GuestDocumentAttachments(
				currentUser.clientId,
				selectedProjectId,
				currentUser.userId
			);
			uploadFiles(folderReference.fullPath, file).subscribe((progress) => {
				if (progress.downloadURL && guestDetail) {
					updateGuest(
						selectedProjectId,
						guestDetail.guestId || '',
						'attachments',
						guestDetail.attachments
							? [
									...guestDetail.attachments,
									{
										name: file.name,
										url: progress.downloadURL,
										createdAt: firebase.firestore.Timestamp.fromDate(
											new Date()
										),
										type: 'document',
									},
							  ]
							: [
									{
										name: file.name,
										url: progress.downloadURL,
										createdAt: firebase.firestore.Timestamp.fromDate(
											new Date()
										),
										type: 'document',
									},
							  ]
					);
					setAttachmentProgress(false);
				}
			});
		},
		[currentUser, selectedProjectId, guestDetail, updateGuest]
	);

	const sendEmail = () => {
		if (!projects) return;
		setSendEmailStatus(true);
		const smtpDetails = projects.filter(
			(project: Project) => project.projectId === selectedProjectId
		);
		const subject = JSON.parse(emailData.subject);
		const message = generateEmailBody(JSON.parse(emailData.message));
		Email.send({
			Host: 'smtp.gmail.com',
			Username: smtpDetails[0].email,
			Password: smtpDetails[0].password,
			From: smtpDetails[0].email,
			To: emailData.rxEmailId,
			Subject: subject,
			Body: message,
		}).then((status) => {
			if (!guestDetail) return;
			updateGuest(
				selectedProjectId,
				guestDetail.guestId,
				'correspondence',
				guestDetail.correspondence
					? [
							...guestDetail.correspondence,
							{
								from: smtpDetails[0].email,
								to: emailData.rxEmailId,
								date: firebase.firestore.Timestamp.fromDate(new Date()),
								subject: subject,
								content: message,
							},
					  ]
					: [
							{
								from: smtpDetails[0].email,
								to: emailData.rxEmailId,
								date: firebase.firestore.Timestamp.fromDate(new Date()),
								subject: subject,
								content: message,
							},
					  ]
			);
			setEmailData({
				rxEmailId: guestDetail?.contactEmail,
				subject: '',
				message: '',
			});
			setSendEmailStatus(false);
		});
	};
	// ---------------------------------------------------------------------

	// -------------------------- Send Invites handler ---------------------
	const [sendInvitesStatus, setSendInvitesStatus] = useState<boolean>();
	const [invitesEmailData, setInvitesEmailData] = useState({
		subject: '',
		message: '',
	});
	const [inviteAttachments, setInviteAttachments] = useState<string[]>([]);

	const handleEmailDataChange = (name: string, type: string) => ({
		target: { value },
	}: any) => {
		if (user && type === 'individualGuestEmail') {
			setEmailData({ ...emailData, [name]: JSON.stringify(value) });
		} else if (type === 'allGuestsEmail') {
			setInvitesEmailData({
				...invitesEmailData,
				[name]: JSON.stringify(value),
			});
		}
	};

	const addAttachment = useCallback(
		(file: File) => {
			if (!currentUser) {
				return;
			}
			const folderReference = FirebaseStorageReference.SendInvitesAttachments(
				currentUser.clientId,
				selectedProjectId
			);
			uploadFiles(folderReference.fullPath, file).subscribe((progress) => {
				if (progress.downloadURL) {
					setInviteAttachments([...inviteAttachments, file.name]);
				}
			});
		},
		[currentUser, selectedProjectId, inviteAttachments]
	);

	const handleSendInvites = () => {
		if (!projects) return;
		setSendInvitesStatus(true);
		const smtpDetails = projects.filter(
			(project: Project) => project.projectId === selectedProjectId
		);
		async function mailer() {
			let promise = new Promise((resolve, reject) => {
				if (!selectedRowArray) return;
				const loopOverData =
					selectedRowArray.length > 0 ? selectedRowArray : guestsData;
				if (!loopOverData) return;
				loopOverData.forEach((data, i) => {
					Email.send({
						Host: 'smtp.gmail.com',
						Username: smtpDetails[0].email,
						Password: smtpDetails[0].password,
						From: smtpDetails[0].email,
						To: data.contactEmail,
						Subject: 'subject',
						Body: 'message',
						// Attachments: [
						//   {
						//     name: "smtpjs.png",
						//     path: "https://networkprogramming.files.wordpress.com/2017/11/smtpjs.png",
						//   },
						// ],
					}).then((status) => {
						console.log(i, data.contactEmail, status);
					});
				});
				resolve('done');
			});
			let result = await promise;
			console.log('result :>> ', result);
			setInviteAttachments([]);
			setSendInvitesStatus(false);
		}
		mailer();
	};
	// ---------------------------------------------------------------------

	const list = () => {
		// ---------- Add a new Guest/Upload Guestlist sheet handlers ----------
		if (clickType === 'addGuest') {
			return (
				<div className={clsx(classes.list)} role="presentation">
					<div className={Styles.drawerHeading}>
						<Typography variant="h5" color="primary" gutterBottom>
							Add Guests
						</Typography>
					</div>
					<div className={Styles.importGuestList}>
						<Typography
							variant="subtitle1"
							gutterBottom
							className={Styles.importSubtitle}
						>
							Import Guestlist
						</Typography>
						<DescriptionIcon className={Styles.guestListFileIcon} />
						<CustomButton
							className={Styles.upload}
							startIcon={<CloudUploadIcon />}
							endIcon={
								guestSheetUploadProgress && (
									<CircularProgress size="1rem" color="inherit" />
								)
							}
						>
							<label>
								<span>Upload</span>
								<input
									type="file"
									onChange={(event) => {
										event.target.files &&
											uploadGuestSheet(event.target.files[0]);
									}}
									multiple={false}
								/>
							</label>
						</CustomButton>
					</div>
					<Divider />
					<div className={Styles.addNewGuest}>
						<Typography variant="subtitle1" gutterBottom>
							Add New Guest
						</Typography>
						<div>
							<TextField
								margin="dense"
								label="First Name"
								type="text"
								variant="outlined"
								fullWidth
								onChange={handleUserDetailsUpdate('firstName')}
							/>
							<TextField
								margin="dense"
								label="Last Name"
								type="text"
								variant="outlined"
								fullWidth
								onChange={handleUserDetailsUpdate('lastName')}
							/>
							<TextField
								margin="dense"
								label="Email"
								type="text"
								variant="outlined"
								fullWidth
								onChange={handleUserDetailsUpdate('contactEmail')}
							/>
							<TextField
								margin="dense"
								label="Mobile Number"
								type="text"
								variant="outlined"
								fullWidth
								onChange={handleUserDetailsUpdate('contactPhone')}
							/>
						</div>
						<div className={Styles.drawerBtn}>
							<CustomButton
								size="small"
								startIcon={<AddRounded />}
								onClick={handleAddUser}
							>
								Add Guest
							</CustomButton>
						</div>
					</div>
				</div>
			);
		}
		// ---------------------------------------------------------------------

		// ------ Edit User Details, Add Document and Send Email handlers ------
		else if (clickType === 'guestDetails') {
			return (
				<div className={clsx(classes.list)} role="presentation">
					<Typography variant="h5" color="primary" gutterBottom>
						{`${guestDetail?.firstName} ${guestDetail?.lastName}`}
					</Typography>
					<Divider />
					<div className={Styles.tabContainer}>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="primary"
							textColor="primary"
							centered
						>
							<Tab label="Guest Details" />
							<Tab label="Email" />
						</Tabs>
					</div>
					{tabValue === 0 ? (
						// ----- Guest Details and Add Document -----
						<div className={Styles.guestDetails}>
							<TextField
								margin="dense"
								label="First Name"
								variant="outlined"
								fullWidth
								defaultValue={guestDetail?.firstName}
								onChange={handleUserDetailsUpdate('firstName')}
							/>
							<TextField
								margin="dense"
								label="Last Name"
								type="text"
								variant="outlined"
								fullWidth
								defaultValue={guestDetail?.lastName}
								onChange={handleUserDetailsUpdate('lastName')}
							/>
							<TextField
								margin="dense"
								label="Email"
								type="text"
								variant="outlined"
								fullWidth
								defaultValue={guestDetail?.contactEmail}
								onChange={handleUserDetailsUpdate('contactEmail')}
							/>
							<TextField
								margin="dense"
								label="Mobile Number"
								type="text"
								variant="outlined"
								fullWidth
								defaultValue={guestDetail?.contactPhone}
								onChange={handleUserDetailsUpdate('contactPhone')}
							/>
							<CustomButton
								onClick={updateGuestDetails}
								disabled={JSON.stringify(user) === JSON.stringify(guestDetail)}
							>
								Save Changes
							</CustomButton>
							<div className={Styles.guestAttachments}>
								<Typography variant="subtitle1" gutterBottom>
									ID and Ticket
								</Typography>
								{guestDetail && guestDetail.attachments?.length > 0
									? guestDetail?.attachments?.map((attachment, _index) => {
											return (
												<a
													href={attachment.url}
													rel="noreferrer"
													target="_blank"
													key={_index}
												>
													<div className={Styles.attachments}>
														<div className={Styles.firstRow}>
															{attachment.name}
															{/* <DeleteIcon
                                onClick={() => console.log("clicked")}
                              /> */}
														</div>
														<div className={Styles.secondRow}>
															{`Received: ${attachment?.createdAt
																.toDate()
																.toDateString()} @ ${attachment?.createdAt
																.toDate()
																.toLocaleTimeString()}`}
														</div>
													</div>
												</a>
											);
									  })
									: null}
							</div>
							<CustomButton
								className={Styles.upload}
								startIcon={<CloudUploadIcon />}
								endIcon={
									attachmentProgress && (
										<CircularProgress size="1rem" color="inherit" />
									)
								}
							>
								<label>
									<span>Add an attachment</span>
									<input
										type="file"
										onChange={(event) => {
											event.target.files &&
												uploadAttachment(event.target.files[0]);
										}}
										multiple={false}
									/>
								</label>
							</CustomButton>
						</div>
					) : (
						// ------------------------------------------

						// ------------ Guest Send Email ------------
						<div className={Styles.guestCorrespondence}>
							{!smtpPassword && (
								<React.Fragment>
									<br />
									<Alert severity="error">
										<AlertTitle>
											<strong>Error</strong>
										</AlertTitle>
										Please setup the 2FA security and password for the project
										email.
									</Alert>
								</React.Fragment>
							)}
							<div className={Styles.guestEmail}>
								<TextField
									margin="dense"
									label="Recipient's Email"
									variant="outlined"
									fullWidth
									defaultValue={emailData.rxEmailId}
									onChange={handleEmailDataChange(
										'rxEmailId',
										'individualGuestEmail'
									)}
								/>
								<TextField
									margin="dense"
									label="Subject"
									type="text"
									variant="outlined"
									fullWidth
									onChange={handleEmailDataChange(
										'subject',
										'individualGuestEmail'
									)}
								/>
								<TextField
									margin="dense"
									label="Message"
									type="text"
									multiline
									rows={10}
									variant="outlined"
									fullWidth
									onChange={handleEmailDataChange(
										'message',
										'individualGuestEmail'
									)}
								/>
								<div className={Styles.sendEmailBtn}>
									<CustomButton
										onClick={sendEmail}
										disabled={
											emailData.rxEmailId?.length === 0 ||
											emailData.subject.length === 0 ||
											emailData.message.length === 0 ||
											!smtpPassword
										}
										endIcon={
											sendEmailStatus && (
												<CircularProgress size="1rem" color="inherit" />
											)
										}
									>
										Send
									</CustomButton>
								</div>
							</div>
							<Typography variant="subtitle1" gutterBottom>
								Conversation
							</Typography>
							{guestDetail && guestDetail?.correspondence?.length > 0
								? guestDetail?.correspondence?.map((conversation, _index) => {
										return (
											<div className={Styles.guestConversation} key={_index}>
												From: {conversation?.from}
												<br />
												To: {conversation?.to}
												<br />
												Subject: {conversation?.subject}(
												{`${conversation?.date
													.toDate()
													.toDateString()} @ ${conversation?.date
													.toDate()
													.toLocaleTimeString()}`}
												)
												<br />
												Message: {parse(conversation?.content)}
											</div>
										);
								  })
								: null}
						</div>
						// ------------------------------------------
					)}
					{sendEmailStatus && (
						<Toast
							message="Email Sent Successfully"
							variant={Variant.Success}
						></Toast>
					)}
				</div>
			);
		}
		// ---------------------------------------------------------------------

		// -------------------------- Send Invites handler ---------------------
		else if (clickType === 'sendInvites') {
			return (
				<div className={clsx(classes.list)} role="presentation">
					<div className={Styles.drawerHeading}>
						<Typography variant="h5" color="primary" gutterBottom>
							Send Invites
						</Typography>
					</div>
					<Divider />
					{!smtpPassword && (
						<React.Fragment>
							<br />
							<Alert severity="error">
								<AlertTitle>
									<strong>Error</strong>
								</AlertTitle>
								Please setup the 2FA security and password for the project
								email.
							</Alert>
						</React.Fragment>
					)}
					<div className={Styles.guestEmail}>
						<TextField
							margin="dense"
							label="Subject"
							type="text"
							variant="outlined"
							fullWidth
							onChange={handleEmailDataChange('subject', 'allGuestsEmail')}
						/>
						<TextField
							margin="dense"
							label="Message"
							type="text"
							multiline
							rows={10}
							variant="outlined"
							fullWidth
							onChange={handleEmailDataChange('message', 'allGuestsEmail')}
						/>
						<CustomButton
							className={Styles.upload}
							startIcon={<AttachmentIcon />}
							endIcon={
								attachmentProgress && (
									<CircularProgress size="1rem" color="inherit" />
								)
							}
						>
							<label>
								<span>Add an attachment</span>
								<input
									type="file"
									onChange={(event) => {
										event.target.files && addAttachment(event.target.files[0]);
									}}
									multiple={false}
								/>
							</label>
						</CustomButton>
						<div className={Styles.sendEmailBtn}>
							<CustomButton
								onClick={handleSendInvites}
								disabled={
									invitesEmailData.subject.length === 0 ||
									invitesEmailData.message.length === 0 ||
									!smtpPassword
								}
								endIcon={
									sendInvitesStatus && (
										<CircularProgress size="1rem" color="inherit" />
									)
								}
							>
								Send
							</CustomButton>
						</div>
					</div>
				</div>
				// ---------------------------------------------------------------------
			);
		}
	};

	return (
		// @ts-ignore //TODO: To be discussed with prateek
		<SwipeableDrawer
			anchor="right"
			open={state}
			onClose={toggleState}
			onOpen={toggleState}
		>
			{list()}
		</SwipeableDrawer>
	);
};

const mapStateToProps = (state: RootState) => {
	const { currentUser } = state.Auth;
	const { projects } = state.Project;
	const { guestsData } = state.Guest;
	return { currentUser, projects, guestsData };
};

export default connect(mapStateToProps, { createGuest, updateGuest })(
	GuestlistDrawer
);
