import { Observable } from 'rxjs';
import { FirestoreCollectionReference } from '../../utils';

export interface RoomList {
	annotation: number[];
	annotationListing: string;
	bedType: string;
	floor: number;
	misc: string;
	roomCategory: string;
	roomNumber: string;
}

export interface Hotel {
	hotelId: string;
	annotationList: string[];
	hotelName: string;
	hotelContact: string;
	hotelLocation: string;
	roomList: RoomList[];
}

export const listenToHotels = (): Observable<Hotel[]> => {
	return new Observable<Hotel[]>((observer) => {
		return FirestoreCollectionReference.Hotels().onSnapshot(
			(querySnapshot) => {
				const roomingList = querySnapshot.docs.map((doc) => {
					return { hotelId: doc.id, ...doc.data() } as Hotel;
				});
				observer.next(roomingList);
			},
			(error) => observer.error(error)
		);
	});
};
