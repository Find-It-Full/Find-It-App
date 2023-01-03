import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { uid } from '../App';
import { itemAdd, itemDetails, userId, userInfo } from './databaseTypes';
enum CollectionNames {
    Users = 'users',
    Items = 'items',
    FoundSheets = 'foundsheets',
    Messages = 'messages',

}
export class FirestoreBackend {

private static users() {
    return firestore().collection(CollectionNames.Users)
}

    private static items() {
    return firestore().collection(CollectionNames.Items)
}

    private static foundsheets() {
    return firestore().collection(CollectionNames.FoundSheets)
}
    private static messages() {
    return firestore().collection(CollectionNames.Messages)
}

   

    public static async  addItemToFirestore(data:itemAdd) {


    await this.items().doc(data.codeID).set({ itemID: data.codeID, name: data.name, pictureURL: data.pictureURL, owner: uid, dateAdded: new Date().getTime() });
    await this.users().doc(uid).set({ items: { [data.codeID]: true } }, { merge: true });

}

public static async  getItems():Promise<itemDetails[]> {
    let items:itemDetails[] = []
    const query = await this.items().where("owner","==",uid).get()
    query.forEach((item) => {
        const itemData = item.data() as itemDetails
        items.push(itemData)
        })
    return items

    

}

public static async  getUserInfo(): Promise<userInfo> {
    return (await this.users().doc(uid).get()).data() as userInfo;
}



public static async  watchForNewMessage(props:any){
    const query = this.messages().where("owner", "==", uid)
    return this.attachListenerForNewMessages(props,query)
}

    public static async watchForNewFoundSheet(props: any) {
        const query = this.messages().where("owner", "==", uid)
        return this.attachListenerForNewFoundSheets(props, query)
    }


    public static async attachListenerForNewMessages(props: any ,query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>){
    const unsubscribe = query.onSnapshot({

        next: (snapshot) => {

            if (snapshot.metadata.hasPendingWrites && snapshot.docChanges()) {
                props.onNewSentMessage(props, snapshot.docChanges())
            } else {
                props.onNewRecievedMessage(props, snapshot.docChanges())
            }
        },
        error: (error) => props.onError(error)
    })

    return () => unsubscribe()


}




    public static async attachListenerForNewFoundSheets(props: any, query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>) {
        const unsubscribe = query.onSnapshot({

            next: (snapshot) => {

                if (snapshot.metadata.hasPendingWrites && snapshot.docChanges()) {
                } else {
                    props.onNewFoundSheet(props, snapshot.docChanges())
                }
            },
            error: (error) => props.onError(error)
        })

        return () => unsubscribe()


    }





}










