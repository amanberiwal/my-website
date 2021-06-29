//@ts-nocheck  // TODO: Need to be removed in future (Currently React Table has types issue)

import React from 'react';
import { Checkbox } from '@material-ui/core';
export const IndeterminateCheckbox = React.forwardRef<HTMLButtonElement | null>(
	({ indeterminate, ...rest }, ref) => {
		const defaultRef = React.useRef<HTMLButtonElement | null>();
		const resolvedRef = ref || defaultRef;

		React.useEffect(() => {
			resolvedRef.current.indeterminate = indeterminate;
		}, [resolvedRef, indeterminate]);

		return (
			<>
				<Checkbox
					ref={resolvedRef}
					{...rest}
					onClick={(event) => event.stopPropagation()}
				/>
			</>
		);
	}
);
