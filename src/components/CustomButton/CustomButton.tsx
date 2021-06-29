import { Button, ButtonProps } from '@material-ui/core';
import { FC, ReactNode } from 'react';
import Styles from './CustomButton.module.scss';

interface CustomButtonProps extends ButtonProps {
	children: ReactNode;
	className?: string;
}

export const CustomButton: FC<CustomButtonProps> = (props) => {
	const { children, className } = props;
	return (
		<Button
			{...props}
			variant="contained"
			color="primary"
			className={`${Styles.button} ${className}`}
			size="medium"
		>
			{children}
		</Button>
	);
};
