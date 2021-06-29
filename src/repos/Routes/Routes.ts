export const parse = (searchQuery: string): { [key: string]: string } => {
	return searchQuery
		.replace('?', '')
		.split('&')
		.reduce((accumulator, currentValue) => {
			const [key, value] = currentValue.split('=');
			return { ...accumulator, [key]: value };
		}, {});
};

export enum Routes {
	Index = '/',
	SignIn = 'sign-in',
	//SignUp can be used for future reference if need any
	SignUp = 'sign-up',
	ForgotPassword = 'forgot-Password',
	ProjectSelection = 'projects',
	ProjectDashboard = 'project-dashboard',
	Dashboard = 'dashboard',
	GuestList = 'guest-list',
	TravelRoaster = 'travel-roaster',
	RoomingList = 'rooming-list',
	VendorList = 'vendor-list',
}
