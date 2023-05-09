import firestore, {
    FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import { Collections, DocChanges, isUserData, Item, ItemID, linkId, RegisterTagResult, Report, ReportID, ReportViewStatus, TagID, UserData } from "./databaseTypes"
import functions from "@react-native-firebase/functions"

export class FirestoreBackend {
    private static users() {
        return firestore().collection(Collections.Users)
    }

    private static items() {
        return firestore().collection(Collections.Items)
    }

    private static reports() {
        return firestore().collection(Collections.Reports)
    }

    private static tags() {
        return firestore().collection(Collections.Tags)
    }
    
    private static tagList() {
        return firestore().collection(Collections.ReportableTagIDs)
    }

    public static async addItem(item: Item): Promise<void> {

        // 1. Attempt to register tag associated with item
        const registerTag = functions().httpsCallable('addItem')
        await registerTag({ tagID: item.tagID, itemInfo:item })

    }

    public static async editItem(item: { itemID: string, name: string, icon: string }): Promise<RegisterTagResult> {
        const itemRef = this.items().doc(item.itemID)
        console.log('Starting update...')
        return firestore().runTransaction(async (transaction) => {
            const itemDoc = await transaction.get(itemRef)

            if ( ! itemDoc.exists) {
                console.log('Item DNE.')
                return 'no-such-tag'
            }

            console.log('Updating...')

            transaction.update(itemRef, {
                name: item.name,
                icon: item.icon
            })

            return 'success'
        })
    }

    public static async removeItem(itemID: ItemID) {

        const removeItem = functions().httpsCallable('removeItem')
        const result = (await removeItem({ itemID })).data
        console.log(result)
        return result
    }

    public static async setItemIsMissing(itemID: ItemID, isMissing: boolean, clearRecentReports: boolean) {
        const changeItemLostState = functions().httpsCallable('changeItemLostState')
        const result = (await changeItemLostState({ itemID, isMissing, shouldClearReports: clearRecentReports })).data

        return result
    }

    public static async getItems(): Promise<Item[]> {
        const uid = auth().currentUser?.uid
        const query = await this.items().where("ownerID", "==", uid).get()
        return query.docs.map((snap) => snap.data() as Item)
    }

    public static async getUserProfile(): Promise<UserData> {
        const uid = auth().currentUser?.uid
        return (await this.users().doc(uid).get()).data() as UserData
    }
    public static async addNotificationToken(token) {
        const uid = auth().currentUser?.uid
        return (await this.users().doc(uid).update({"notificationTokens": firestore.FieldValue.arrayUnion(token)}))
    }

    public static async getTagId(linkId) {
        console.log(linkId)
        return (( (await this.tagList().doc(linkId).get()).data())as linkId).tagId
    }

    public static async deleteUser() {
        const changeItemLostState = functions().httpsCallable('deleteAccount')
        await changeItemLostState()
        return true
    }

    public static attachItemReportListener(
        itemID: ItemID, 
        onNewReportData: (docs: DocChanges) => void,
        onError: (error: Error) => void): () => void
    {
        const query = this.reports().where('itemID', '==', itemID)

        return query.onSnapshot({
            next: (snapshot) => {

                if ( ! snapshot.docChanges()) {
                    return
                }

                if (snapshot.metadata.hasPendingWrites) {
                    console.error('INVARIANT VIOLATION: reports cannot be generated locally')
                } else {
                    onNewReportData(snapshot.docChanges())
                }
            },
            error: onError
        })
    }

    public static attachItemsListener(onNewItemData: (docs: DocChanges) => void, onError: (error: Error) => void): () => void {

        const userID = auth().currentUser?.uid

        if ( ! userID) {
            onError(new Error('Cannot retrieve items; user is not authenticated.'))
        }

        const query = this.items().where('ownerID', '==', userID)

        return query.onSnapshot({
            next: (snapshot) => {

                if ( ! snapshot.docChanges()) {
                    return
                }

                onNewItemData(snapshot.docChanges())
            },
            error: onError
        })
    }

    public static attachViewedReportsListener(onNewViewedReports: (snapshot: UserData) => void, onError: (error: Error) => void): () => void {

        const userID = auth().currentUser?.uid

        if ( ! userID) {
            onError(new Error('Cannot retrieve viewed reports; user is not authenticated'))
        }

        const query = this.users().doc(userID)

        console.log(`Retrieving viewed reports for ${userID}`)

        return query.onSnapshot({
            next: (snapshot) => {

                if ( ! snapshot.data()) {
                    return
                }

                const data = snapshot.data()

                if ( ! isUserData(data)) {
                    console.error('Got invalid user data from Firestore.')
                    return
                }

                onNewViewedReports(data)
            },
            error: onError
        })
    }

    public static async setViewedReport(reportID: ReportID) {

        const userID = auth().currentUser?.uid

        await this.users().doc(userID).set(
            { viewedReports: { [reportID]: ReportViewStatus.SEEN }}, 
            { merge: true }
        )
    }

    public static async setNotifiedOfReport(reportID: ReportID) {

        const userID = auth().currentUser?.uid

        await this.users().doc(userID).set(
            { viewedReports: { [reportID]: ReportViewStatus.NOTIFIED }}, 
            { merge: true }
        )
    }
}
