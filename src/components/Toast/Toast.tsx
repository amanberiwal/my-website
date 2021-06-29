import { FC } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { setError, setMessage } from '../../redux';
import { connect } from 'react-redux';

const Alert = (props: AlertProps) => {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export enum Variant {
	Success = 'success',
	Error = 'error',
}

interface ToastProps {
	message?: string;
	setError: typeof setError;
	setMessage: typeof setMessage;
	variant: Variant;
}

const Toast: FC<ToastProps> = (props) => {
	const { message, variant, setError, setMessage } = props;

	const alertCloseHandler = () => {
		setMessage('');
		setError('');
	};

	return (
		<Snackbar
			open={message ? true : false}
			autoHideDuration={2000}
			onClose={alertCloseHandler}
		>
			<Alert onClose={alertCloseHandler} severity={variant}>
				{message}
			</Alert>
		</Snackbar>
	);
};

export default connect(null, { setError, setMessage })(Toast);
