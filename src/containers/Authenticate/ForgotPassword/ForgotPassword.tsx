import {
	Box,
	Button,
	CircularProgress,
	Grid,
	TextField,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { navigate, RouteComponentProps } from '@reach/router';
import React, { FC, FormEventHandler, useState } from 'react';
import { connect } from 'react-redux';
import { forgotPassword } from '../../../assets';
import { RootState, resetPassword } from '../../../redux';
import { Routes } from '../../../repos';
import Styles from './ForgotPassword.module.scss';

interface ResetProps extends RouteComponentProps {
	loading?: boolean;
	resetPassword: typeof resetPassword;
}

const ForgotPassword: FC<ResetProps> = (props) => {
	const { resetPassword, loading } = props;

	const [email = '', setEmail] = useState();

	const emailHandler = (event: any) => {
		setEmail(event.target.value);
	};

	const resetPasswordHandler: FormEventHandler = (event) => {
		event.preventDefault();
		if (!email) {
			return;
		}
		resetPassword(email);
		navigate(Routes.Index);
	};

	const navigateToSignIn = () => {
		navigate(Routes.SignIn);
	};

	return (
		<Grid
			container
			className={Styles.marginTop}
			justify="space-around"
			alignItems="center"
		>
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
			>
				<span className={Styles.loginHeader}>Reset Password</span>
				<form noValidate autoComplete="off" onSubmit={resetPasswordHandler}>
					<Grid container spacing={2} alignItems="flex-end">
						<Grid item>
							<AccountCircle />
						</Grid>
						<Grid item>
							<TextField
								style={{ width: 200 }}
								id="input-with-icon-grid"
								label="Username/Email"
								onChange={emailHandler}
							/>
						</Grid>
					</Grid>
					<Box
						display="flex"
						justifyContent="flex-end"
						flexDirection="column"
						mt={4}
					>
						<Button
							color="secondary"
							type="submit"
							variant="contained"
							disabled={!email}
							endIcon={loading && <CircularProgress color="inherit" />}
						>
							Submit
						</Button>
						<Button
							color="secondary"
							className={Styles.signInLink}
							onClick={navigateToSignIn}
						>
							Sign-in instead ?
						</Button>
					</Box>
				</form>
			</Box>
			<Box display="flex">
				<img
					src={forgotPassword}
					alt="forgot-password"
					className={Styles.forgotPasswordImage}
				></img>
			</Box>
		</Grid>
	);
};

const mapStateToProps = (state: RootState) => {
	const { loading } = state.Auth;
	return { loading };
};

export default connect(mapStateToProps, { resetPassword })(ForgotPassword);
