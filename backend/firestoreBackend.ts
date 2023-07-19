import firestore, {
    FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import { Collections, isUserData, Item, ItemID, Link, RegisterTagResult, Report, ReportID, ReportViewStatus, TagID, UserData } from "./databaseTypes"
import { DocChanges } from "./appOnlyDatabaseTypes"
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

    private static links() {
        return firestore().collection(Collections.Links)
    }

    public static async addItem(item: { name: string, icon: string, tagID: string, emailNotifications:boolean, pushNotifications:boolean }): Promise<void> {

        // 1. Attempt to register tag associated with item
        const addItem = functions().httpsCallable('addItem')
        await addItem({ tagID: item.tagID, itemInfo:item })

    }

    public static async editItem(item: { itemID: string, name: string, icon: string,emailNotifications:boolean, pushNotifications:boolean }): Promise<RegisterTagResult> {
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
                icon: item.icon,
                emailNotifications: item.emailNotifications, 
                pushNotifications: item.pushNotifications
            })

            return 'success'
        })
    }


    public static async editItemNotifications(item: { itemID: string, emailNotifications:boolean, pushNotifications:boolean }): Promise<RegisterTagResult> {
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
                emailNotifications: item.emailNotifications, 
                pushNotifications: item.pushNotifications
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
    public static async updateLastLogin() {
        const uid = auth().currentUser?.uid
        return (await this.users().doc(uid).update({"lastLogin": new Date().getTime()}))
    }

    public static async getUserProfile(): Promise<UserData> {
        const uid = auth().currentUser?.uid
        return (await this.users().doc(uid).get()).data() as UserData
    }

    public static async editAccount(accountDetails: {firstName: string, lastName: string,  secondaryEmail: string}) {
        const uid = auth().currentUser?.uid
        return await this.users().doc(uid).set(accountDetails,{merge:true})
    }
    



    public static async addNotificationToken(token: string) {
        const uid = auth().currentUser?.uid
        return (await this.users().doc(uid).update({"notificationTokens": firestore.FieldValue.arrayUnion(token)}))
    }

    public static async getTagID(linkID: string) {
        return (((await this.links().doc(linkID).get()).data()) as Link).tagID
    }

    public static async deleteUser() {
        const deleteAccount = functions().httpsCallable('deleteAccount')
        await deleteAccount()
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

                onNewReportData(snapshot.docChanges())
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

    // public static async checkRequirements(){
        

    // }

    public static async setViewedReport(reportID: ReportID) {

        const userID = auth().currentUser?.uid

        if ( ! userID) { return }

        await this.reports().doc(reportID).set(
            { viewStatus: { [userID]: ReportViewStatus.SEEN } }, 
            { merge: true }
        )
    }

    public static async setNotifiedOfReport(reportID: ReportID) {

        const userID = auth().currentUser?.uid

        if ( ! userID) { return }

        await this.reports().doc(reportID).set(
            { viewStatus: { [userID]: ReportViewStatus.NOTIFIED } }, 
            { merge: true }
        )
    }
}
