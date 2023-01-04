import firestore, {
    FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore"
import { uid } from "../App"
import {
    foundSheet,
    itemAdd,
    itemDetails,
    userId,
    userInfo,
} from "./databaseTypes"
enum CollectionNames {
    Users = "users",
    Items = "items",
    FoundSheets = "foundSheets",
    Messages = "messages",
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

    public static async addItemToFirestore(data: itemAdd) {
        await this.items().doc(data.codeID).set({
            itemID: data.codeID,
            name: data.name,
            pictureURL: data.pictureURL,
            owner: uid,
            lost: false,
            dateAdded: new Date().getTime(),
            lastFound: new Date().getTime(),
        })
        await this.users()
            .doc(uid)
            .set({ items: { [data.codeID]: true } }, { merge: true })
    }

    public static async removeItemToFirestore(itemId: string) {
        await this.items().doc(itemId).delete()
        await this.users()
            .doc(uid)
            .set(
                { items: { [itemId]: firestore.FieldValue.delete() } },
                { merge: true }
            )
    }

    public static async markItemLost(data: itemAdd) {
        await this.items().doc(data.codeID).set(
            {
                lost: true,
                lastLost: new Date().getTime(),
            },
            { merge: true }
        )
    }

    public static async markItemFound(itemId: string) {
        await this.items().doc(itemId).set({
            lost: false,
            lastFound: new Date().getTime(),
            foundSheets: {},
        })
    }

    public static async getItems(): Promise<itemDetails[]> {
        let items: itemDetails[] = []
        const query = await this.items().where("owner", "==", uid).get()
        query.forEach((item) => {
            const itemData = item.data() as itemDetails
            items.push(itemData)
        })
        return items
    }

    public static async getUserInfo(): Promise<userInfo> {
        return (await this.users().doc(uid).get()).data() as userInfo
    }

    //TODO FIX THIS
    public static async watchForNewFoundSheet(props: any) {
        const query = this.foundsheets().where("owner", "==", uid)
        return this.attachListenerForNewFoundSheets(props, query)
    }
    //TODO FIX THIS
    public static async attachListenerForNewFoundSheets(
        props: any,
        query: FirebaseFirestoreTypes.Query<FirebaseFirestoreTypes.DocumentData>
    ) {
        const unsubscribe = query.onSnapshot({
            next: (snapshot) => {
                if (
                    snapshot.metadata.hasPendingWrites &&
                    snapshot.docChanges()
                ) {
                } else {
                    props.onNewFoundSheet(props, snapshot.docChanges())
                }
            },
            error: (error) => props.onError(error),
        })

        return () => unsubscribe()
    }

    public static async deleteFoundSheet(foundSheetId: string, itemId: string) {
        await this.items()
            .doc(itemId)
            .set(
                {
                    foundSheets: {
                        [foundSheetId]: firestore.FieldValue.delete(),
                    },
                },
                { merge: true }
            )
    }

    //-------
    //The following will be used both in app and website
    //-------

    ///TODO: cloud function to add foundsheet to user profile and item data
    public static async sendFoundSheet(data: foundSheet) {
        await this.foundsheets()
            .doc()
            .set({
                ...data,
                timeSent: new Date().getTime(),
            })
    }
}
