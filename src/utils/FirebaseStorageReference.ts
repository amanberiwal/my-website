import { storage } from '../firebase.config';

export const FirebaseStorageReference = {
	SheetQueueFiles: (clientId: string, projectId: string, currentUserId: string) => storage().ref('clients').child(clientId).child('projects').child(projectId).child('sheetQueue').child(currentUserId),

	ProfilePicture: (currentUserId: string) => storage().ref('users').child(currentUserId).child('profilePicture'),

	GuestDocumentAttachments: (clientId: string, projectId: string, currentUserId: string) => storage().ref('clients').child(clientId).child('projects').child(projectId).child('guestDocuments'),

	SendInvitesAttachments: (clientId: string, projectId: string) => storage().ref('clients').child(clientId).child('projects').child(projectId).child('guestDocuments'),
};
