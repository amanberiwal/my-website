//To be implemented at later stage

export interface ValidationResult<T> {
	data: T;
	error?: string;
	valid: boolean;
}

export enum ErrorMessage {
	Password = 'Use atleast 6 characters with at least one number, one uppercase & amp; one lowercase letter',
	Email = 'Please enter a valid email. Example you@example.com',
}

export const validateEmail = (email: string): ValidationResult<string> => {
	const regExp = /^\w+[@][a-zA-Z0-9]+\.[a-zA-Z0-9]{2,4}$/;
	if (email.match(regExp)) {
		return {
			data: email,
			valid: true,
		};
	}
	return {
		data: email,
		valid: false,
		error: ErrorMessage.Email,
	};
};

export const validatePassword = (
	password: string
): ValidationResult<string> => {
	const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
	if (password.match(regExp)) {
		return {
			data: password,
			valid: true,
		};
	}
	return {
		data: password,
		valid: false,
		error: ErrorMessage.Password,
	};
};
