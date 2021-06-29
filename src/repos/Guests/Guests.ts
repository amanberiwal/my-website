import { from, Observable } from 'rxjs';
import { FirestoreCollectionReference } from '../../utils';

export interface TableHeader {
	Header: string;
	accessor: string;
	id?: string;
	type?: string;
	corpus?: Corpus[];
}

export interface HeaderType {
	guestHeaders: TableHeader[];
	roomHeaders: TableHeader[];
}

export interface Corpus {
	title: string;
	inputValue?: string;
}

export enum RSVP {
	Accepted = 'recieved',
	Declined = 'not recieved',
}

export enum DataType {
	Drawer = 'drawer',
	Text = 'text',
	MultiSelect = 'multiselect',
	Select = 'select',
	SelectionCheck = 'selection',
	Group = 'group',
	RoomGroup = 'roomGroup',
	//filter drop down
}

export interface Correspondence {
	content: string;
	date: firebase.default.firestore.Timestamp;
	from: string;
	to: string;
	subject: string;
}

export interface Attachments {
	createdAt: firebase.default.firestore.Timestamp;
	name: string;
	type: string;
	url: string;
}

export interface GuestData {
	guestId: string;
	contactEmail: string;
	contactPhone: number | string;
	correspondence: Correspondence[];
	event: string[];
	group: string[];
	dataId: {};
	firstName: string;
	lastName: string;
	rsvp: string;
	special: string;
	status: number;
	attachments: Attachments[];
	roomGroup?: string;
	hotel?: string;
	roomNo?: string;
}

export enum TableType {
	Guest = 'guest',
	Rooming = 'rooming',
	TravelRooster = 'travel-rooster',
}

//This is default header group that will be used when creating guest table from scratch and update to firebase
export const defaultGuestHeaders: TableHeader[] = [
	{
		Header: 'First Name',
		accessor: 'firstName',
		type: DataType.Drawer,
	},
	{
		Header: 'Last Name',
		accessor: 'lastName',
		type: DataType.Drawer,
	},
	{ Header: 'Hotel Name', accessor: 'hotel', type: DataType.RoomGroup },
	{ Header: 'Room No', accessor: 'roomNo', type: DataType.RoomGroup },
	{
		Header: 'Contact Email',
		accessor: 'contactEmail',
		type: DataType.Text,
	},
	{
		Header: 'Contact Phone',
		accessor: 'contactPhone',
		type: DataType.Text,
	},
	{
		Header: 'Group',
		accessor: 'group',
		corpus: [
			{
				title: 'non smoking',
			},
			{
				title: 'vegan',
			},
		],
		type: DataType.MultiSelect,
	},
	{
		Header: 'RSVP',
		accessor: 'rsvp',
		corpus: [
			{
				title: 'not recieved',
			},
			{
				title: 'recieved',
			},
		],
		type: DataType.Select,
	},
	{
		Header: 'Special Request',
		accessor: 'special',
		type: DataType.Text,
	},
	{
		Header: 'Status',
		accessor: 'status',
		corpus: [
			{
				title: 'status 0',
			},
			{
				title: 'status 1',
			},
		],
		type: DataType.Select,
	},
];

export const listenToGuests = (
	clientId: string,
	projectId: string
): Observable<GuestData[]> => {
	return new Observable<GuestData[]>((observer) => {
		FirestoreCollectionReference.GuestsData(clientId, projectId).onSnapshot(
			(querySnapshot) => {
				const guestsData = querySnapshot.docs.map(
					(doc) =>
						({
							guestId: doc.id,
							...doc.data(),
						} as GuestData)
				);
				observer.next(guestsData);
			},
			(error) => observer.error(error)
		);
	});
};

export const getGuestHeaders = (
	clientId: string,
	projectId: string
): Observable<HeaderType> => {
	return new Observable<HeaderType>((observer) => {
		FirestoreCollectionReference.Guests(clientId, projectId)
			.doc(projectId)
			.onSnapshot(
				(doc) => {
					const tableHeaders = {
						...doc.data(),
					} as HeaderType;
					observer.next(tableHeaders);
				},
				(error) => observer.error(error)
			);
	});
};

export const updateGuest = (
	clientId: string,
	projectId: string,
	guestId: string,
	id: string,
	value: any
): Observable<void> => {
	return from(
		FirestoreCollectionReference.GuestsData(clientId, projectId)
			.doc(guestId)
			.update({ [id]: value })
	);
};

export const createGuest = (
	clientId: string,
	projectId: string,
	guestData: Partial<GuestData>
): Observable<
	firebase.default.firestore.DocumentReference<firebase.default.firestore.DocumentData>
> => {
	return from(
		FirestoreCollectionReference.GuestsData(clientId, projectId).add(guestData)
	);
};

export const createGuestHeaders = (
	clientId: string,
	projectId: string
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Guests(clientId, projectId)
			.doc(projectId)
			.update({ guestHeaders: defaultGuestHeaders })
	);
};

export const deleteGuest = (
	clientId: string,
	projectId: string,
	guestId: string
): Observable<void> => {
	return from(
		FirestoreCollectionReference.GuestsData(clientId, projectId)
			.doc(guestId)
			.delete()
	);
};

// TODO: Batch write for all docs in react table

// export const updateStaffData = (siteId: string, data: StaffType[]) => {
// 	let batches: firestore.WriteBatch[] = [];
// 	for (const staffChunk of chunk(data, 300)) {
// 		const batch = firestore().batch();
// 		for (const staff of staffChunk) {
// 			batch.set(FirestoreCollectionReference.Staffs(siteId).doc(), staff);
// 		}
// 		batches.push(batch);
// 	}
// 	return from(Promise.all(batches.map((batch) => batch.commit())));
// };
