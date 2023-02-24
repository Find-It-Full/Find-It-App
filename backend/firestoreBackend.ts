import firestore, {
    FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore"
import auth from "@react-native-firebase/auth"
import { ChangeItemLostStateResult, DocChanges, Item, ItemID, linkId, RegisterTagResult, Report, TagID, UserProfile } from "./databaseTypes"
import functions from "@react-native-firebase/functions"

enum CollectionNames {
    Users = 'users',
    Items = 'items',
    Reports = 'reports',
    Tags = 'tags',
    LinkId = "linkId"
}

export class FirestoreBackend {
    private static users() {
        return firestore().collection(CollectionNames.Users)
    }

    private static items() {
        return firestore().collection(CollectionNames.Items)
    }

    private static reports() {
        return firestore().collection(CollectionNames.Reports)
    }

    private static tags() {
        return firestore().collection(CollectionNames.Tags)
    }
    private static tagList() {
        return firestore().collection(CollectionNames.LinkId)
    }

    public static async addItem(item: Item): Promise<RegisterTagResult> {

        // 1. Attempt to register tag associated with item
        const registerTag = functions().httpsCallable('registerTag')
        const result: RegisterTagResult = (await registerTag({ tagID: item.tagID })).data

        if ( ! result) {
            return 'internal'
        }

        if (result !== 'success' ){ //&& result !== 'registered-to-caller') {
            return result
        }

        console.log('Creating item...')

        const itemRef = this.items().doc()
        const uid = auth().currentUser?.uid
        return firestore().runTransaction(async (transaction) => {
            // 2. Create an item
            transaction.set(itemRef, {
                itemID: itemRef.id,
                tagID: item.tagID,
                name: item.name,
                icon: item.icon,
                ownerID: uid,
                isMissing: false,
                dateAdded: new Date().getTime()
            })
            // 3. Associate the tag with the new item


            transaction.update(this.tags().doc(item.tagID), {
                isAssociatedWithItem: true,
                associatedItemID: itemRef.id
            })
            // console.log("passed 2")
            // 4. Add the new item to the user's record
            transaction.set(this.users().doc(uid), {
                items: { [itemRef.id]: true }
            }, { merge: true })
            return 'success'
        })
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
        const uid = auth().currentUser?.uid
        await this.items().doc(itemID).delete()
        await this.users()
            .doc(uid)
            .set(
                { items: { [itemID]: firestore.FieldValue.delete() } },
                { merge: true }
            )
    }

    public static async setItemIsMissing(itemID: ItemID, isMissing: boolean, clearRecentReports: boolean) {
        const changeItemLostState = functions().httpsCallable('changeItemLostState')
        const result: ChangeItemLostStateResult = (await changeItemLostState({ itemID, isMissing, shouldClearReports: clearRecentReports })).data

        return result
    }

    public static async getItems(): Promise<Item[]> {
        const uid = auth().currentUser?.uid
        const query = await this.items().where("ownerID", "==", uid).get()
        return query.docs.map((snap) => snap.data() as Item)
    }

    public static async getUserProfile(): Promise<UserProfile> {
        const uid = auth().currentUser?.uid
        return (await this.users().doc(uid).get()).data() as UserProfile
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
        const uid = auth().currentUser?.uid
        const query = this.items().where('ownerID', '==', uid)

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
}
