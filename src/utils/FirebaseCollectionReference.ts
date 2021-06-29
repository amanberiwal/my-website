import { firestore } from '../firebase.config';

export enum FirestoreCollection {
	Users = 'users',
	Clients = 'clients',
	Projects = 'projects',
	Guests = 'guests',
	GuestsData = 'guest-data', //TODO: Name to be Changed to guests-data
	Events = 'events',
	Todos = 'todos',
	Notifications = 'notifications',
	Hotels = 'hotels'
}

export const FirestoreCollectionReference = {
	Users: () => firestore().collection(FirestoreCollection.Users),
	Client: () => firestore().collection(FirestoreCollection.Clients),
	Hotels:() => firestore().collection(FirestoreCollection.Hotels),
	Projects: (clientId: string) =>
		firestore()
			.collection(FirestoreCollection.Clients)
			.doc(clientId)
			.collection(FirestoreCollection.Projects),
	Guests: (clientId: string, projectId: string) =>
		firestore()
			.collection(FirestoreCollection.Clients)
			.doc(clientId)
			.collection(FirestoreCollection.Projects)
			.doc(projectId)
			.collection(FirestoreCollection.Guests),
	GuestsData: (clientId: string, projectId: string) =>
		firestore()
			.collection(FirestoreCollection.Clients)
			.doc(clientId)
			.collection(FirestoreCollection.Projects)
			.doc(projectId)
			.collection(FirestoreCollection.Guests)
			.doc(projectId)
			.collection(FirestoreCollection.GuestsData),
	Events: (clientId: string) =>
		firestore()
			.collection(FirestoreCollection.Clients)
			.doc(clientId)
			.collection(FirestoreCollection.Events),
	Todos: (clientId: string, projectId: string) =>
		firestore()
			.collection(FirestoreCollection.Clients)
			.doc(clientId)
			.collection(FirestoreCollection.Projects)
			.doc(projectId)
			.collection(FirestoreCollection.Todos),
	Notifications: (clientId: string, projectId: string) =>
		firestore()
			.collection(FirestoreCollection.Clients)
			.doc(clientId)
			.collection(FirestoreCollection.Projects)
			.doc(projectId)
			.collection(FirestoreCollection.Notifications),
	
};
