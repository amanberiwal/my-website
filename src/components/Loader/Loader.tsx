//TODO: Clean the code and write scss counterpart;
import {
	CircularProgress,
	CircularProgressProps,
	createStyles,
	makeStyles,
	Theme,
} from '@material-ui/core';
import React, { FC } from 'react';
import { pencilSVG } from '../../assets';
import Styles from './Loader.module.scss';

export enum LoaderSize {
	sm = '50px',
	lg = '150px',
}

interface LoaderProps {
	size?: LoaderSize;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			position: 'relative',
			marginRight: '1rem',
		},
		bottom: {
			color: 'white',
		},
		top: {
			color: '#a42167',
			animationDuration: '550ms',
			position: 'absolute',
			left: 0,
		},
		circle: {
			strokeLinecap: 'round',
		},
	})
);

function Spinner(props: CircularProgressProps) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<CircularProgress
				variant="determinate"
				className={classes.bottom}
				size={40}
				thickness={4}
				{...props}
				value={100}
			/>
			<CircularProgress
				variant="indeterminate"
				disableShrink
				className={classes.top}
				classes={{
					circle: classes.circle,
				}}
				size={40}
				thickness={4}
				{...props}
			/>
		</div>
	);
}

const Loader: FC<LoaderProps> = (props) => {
	const { size } = props;
	return <Spinner />;
};

export default Loader;
