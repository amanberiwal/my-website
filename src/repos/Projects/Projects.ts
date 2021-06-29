import { from, Observable } from 'rxjs';
import { FirestoreCollectionReference } from '../../utils';

export interface ProjectContact {
	name: string;
	phoneNo: number;
	relation: string;
}

export interface Project {
	projectId?: string;
	manager?: string;
	name: string;
	projectContact: ProjectContact;
	startDate: firebase.default.firestore.Timestamp | null;
	isCompleted?: boolean;
	location: string;
	team?: string[];
	email: string;
	password: string;
	color: string;
	createdAt?: firebase.default.firestore.Timestamp;
}

export const listenToProjects = (clientId: string): Observable<Project[]> => {
	return new Observable<Project[]>((observer) => {
		FirestoreCollectionReference.Projects(clientId)
			.orderBy('createdAt', 'desc')
			.onSnapshot(
				(querySnapshot) => {
					const projects = querySnapshot.docs.map(
						(doc) =>
						({
							projectId: doc.id,
							...doc.data(),
						} as Project)
					);
					observer.next(projects);
				},
				(error) => observer.error(error)
			);
	});
};

export const createProject = (
	clientId: string,
	project: Project
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Projects(clientId)
			.add({
				name: project.name,
				manager: project.manager,
				projectContact: project.projectContact,
				startDate: project.startDate,
				location: project.location,
				isCompleted: false,
				team: project.team,
				email: project.email,
				password: project.password,
				color: project.color,
				createdAt: project.createdAt,
			})
			.then(function (docRef) { })
			.catch(function (error) {
				console.error('Error adding document: ', error);
			})
	);
};

export const updateProject = (
	clientId: string,
	projectId: string,
	project: Project
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Projects(clientId)
			.doc(projectId)
			.update({
				name: project.name,
				manager: project.manager,
				projectContact: project.projectContact,
				startDate: project.startDate,
				location: project.location,
				isCompleted: project.isCompleted,
				team: project.team,
				email: project.email,
				password: project.password,
				color: project.color,
				createdAt: project.createdAt,
			})
			.then(function (docRef) { })
			.catch(function (error) {
				console.error('Error updating document: ', error);
			})
	);
};

export const markCompleteProject = (
	clientId: string,
	projectId: string,
	isCompleted: boolean
): Observable<void> => {
	return from(
		FirestoreCollectionReference.Projects(clientId)
			.doc(projectId)
			.update({
				isCompleted: isCompleted,
			})
			.then(function (docRef) { })
			.catch(function (error) {
				console.error('Error updating document: ', error);
			})
	);
};

export const getSelectedProjectData = (
	clientId: string,
	selectedProjectId: string
): Observable<Project> => {
	return new Observable((observer) => {
		FirestoreCollectionReference.Projects(clientId)
			.doc(selectedProjectId)
			.get()
			.then((doc) => {
				if (doc.exists) observer.next(doc.data() as Project);
				else observer.error('No Such Project Exists');
			});
	});
};
