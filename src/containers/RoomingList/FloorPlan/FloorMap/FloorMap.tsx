import { Paper } from '@material-ui/core';
import useMouse from '@react-hook/mouse-position';
import React, { useRef } from 'react';

const FloorMap = () => {
	const target = useRef(null);
	const mouse = useMouse(target, {
		fps: 60,
		enterDelay: 100,
		leaveDelay: 100,
	});

	return (
		<Paper elevation={3}>
			<img
				src="https://www.researchgate.net/profile/Susumu-Kunifuji/publication/29681554/figure/fig3/AS:669573997162511@1536650289871/Floor-map-of-Group-Home-Tomarigi.png"
				ref={target}
				alt="floor-map"
			/>
		</Paper>
	);
};

export default FloorMap;
