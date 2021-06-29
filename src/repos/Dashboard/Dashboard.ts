import { from, Observable } from 'rxjs';
import { FirestoreCollectionReference } from '../../utils';

export interface ProjectEvent {
	eventId?: string;
	projectId?: string;
	createdAt: firebase.default.firestore.Timestamp | null;
	eventDate?: firebase.default.firestore.Timestamp | null;
	updatedAt?: firebase.default.firestore.Timestamp;
	venue?: string;
	name: string;
	isCalendar?: boolean;
}

export interface ProjectTodo {
	todoId?: string;
	createdAt: firebase.default.firestore.Timestamp | null;
	todoDate: firebase.default.firestore.Timestamp;
	isCalendar?: boolean;
	description?: string;
	isCompleted?: boolean;
	name: string;
	expectedAt?: firebase.default.firestore.Timestamp;
	assigned?: string;
	updatedAt?: firebase.default.firestore.Timestamp;
}

export interface ProjectNotification {
	notificationId: string;
	context: string;
	content: string;
	createdAt: firebase.default.firestore.Timestamp;
	userRef: string;
}

export interface CalendarTask extends ProjectEvent, ProjectTodo {}

export const listenToProjectEvents = (clientId: string) => {
	return new Observable<ProjectEvent[]>((observer) => {
		FirestoreCollectionReference.Events(clientId).onSnapshot(
			(querySnapshot) => {
				const projects = querySnapshot.docs.map(
					(doc) =>
						({
							eventId: doc.id,
							...doc.data(),
						} as ProjectEvent)
				);
				observer.next(projects);
			},
			(error) => observer.error(error)
		);
	});
};

export const listenToProjectTodos = (clientId: string, projectId: string) => {
	return new Observable<ProjectTodo[]>((observer) => {
		FirestoreCollectionReference.Todos(clientId, projectId).onSnapshot(
			(querySnapshot) => {
				const projects = querySnapshot.docs.map(
					(doc) =>
						({
							todoId: doc.id,
							...doc.data(),
						} as ProjectTodo)
				);
				observer.next(projects);
			},
			(error) => observer.error(error)
		);
	});
};

export const listenToProjectNotifications = (
	clientId: string,
	projectId: string
) => {
	return new Observable<ProjectNotification[]>((observer) => {
		FirestoreCollectionReference.Notifications(clientId, projectId).onSnapshot(
			(querySnapshot) => {
				const projects = querySnapshot.docs.map(
					(doc) =>
						({
							notificationId: doc.id,
							...doc.data(),
						} as ProjectNotification)
				);
				observer.next(projects);
			},
			(error) => observer.error(error)
		);
	});
};

export const createEvent = (
	clientId: string,
	event: ProjectEvent
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Events(clientId)
			.add(event)
			.then(function (docRef) {})
			.catch(function (error) {
				console.error('Error adding document: ', error);
			})
	);
};

export const createTodo = (
	clientId: string,
	projectId: string,
	todo: ProjectTodo
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Todos(clientId, projectId)
			.add(todo)
			.then(function (docRef) {})
			.catch(function (error) {
				console.error('Error adding document: ', error);
			})
	);
};

export const updateEvent = (
	clientId: string,
	projectId: string,
	eventId: string,
	event: Partial<ProjectEvent>
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Events(clientId)
			.doc(eventId)
			.update(event)
			.then(function (docRef) {})
			.catch(function (error) {
				console.error('Error adding document: ', error);
			})
	);
};

export const updateTodoMark = (
	clientId: string,
	projectId: string,
	todoId: string,
	isCompleted: boolean
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Todos(clientId, projectId)
			.doc(todoId)
			.update({ isCompleted: isCompleted })
			.then(function (docRef) {})
			.catch(function (error) {
				console.error('Error adding document: ', error);
			})
	);
};

export const updateTodo = (
	clientId: string,
	projectId: string,
	todoId: string,
	todo: Partial<ProjectTodo>
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Todos(clientId, projectId)
			.doc(todoId)
			.update(todo)
			.then(function (docRef) {})
			.catch(function (error) {
				console.error('Error adding document: ', error);
			})
	);
};

export const deleteTodo = (
	clientId: string,
	projectId: string,
	todoId: string
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Todos(clientId, projectId)
			.doc(todoId)
			.delete()
			.then(function (docRef) {})
			.catch(function (error) {
				console.error('Error deleting document: ', error);
			})
	);
};
