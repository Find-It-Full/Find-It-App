import firestore, {
    FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore"
import { uid } from "../App"
import { DocChanges, Item, ItemID, RegisterTagResult, Report, UserProfile } from "./databaseTypes"
import functions from "@react-native-firebase/functions"

enum CollectionNames {
    Users = 'users',
    Items = 'items',
    Reports = 'reports',
    Tags = 'tags'
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

    public static async addItem(item: Item): Promise<RegisterTagResult> {

        // 1. Attempt to register tag associated with item
        const registerTag = functions().httpsCallable('registerTag')
        const result: RegisterTagResult = (await registerTag({ tagID: item.tagID })).data

        if ( ! result) {
            return 'internal'
        }

        if (result !== 'success') {
            return result
        }

        // 2. Create an item
        const itemRef = this.items().doc()
        this.items().add({
            itemID: itemRef.id,
            tagID: item.tagID,
            name: item.name,
            icon: item.icon,
            ownerID: uid,
            isMissing: false,
            dateAdded: new Date().getTime()
        })

        // 3. Associate the tag with the new item
        this.tags().doc(item.tagID).update({
            isAssociatedWithItem: true,
            associatedItemID: itemRef.id
        })

        // 4. Add the new item to the user's record
        await this.users()
            .doc(uid)
            .set({ items: { [item.itemID]: true } }, { merge: true })

        return 'success'
    }

    public static async removeItem(itemID: ItemID) {
        await this.items().doc(itemID).delete()
        await this.users()
            .doc(uid)
            .set(
                { items: { [itemID]: firestore.FieldValue.delete() } },
                { merge: true }
            )
    }

    public static async setItemIsMissing(itemID: ItemID, isMissing: boolean) {
        await this.items().doc(itemID).set(
            {
                isMissing
            },
            { merge: true }
        )
    }

    public static async getItems(): Promise<Item[]> {
        const query = await this.items().where("ownerID", "==", uid).get()
        return query.docs.map((snap) => snap.data() as Item)
    }

    public static async getUserProfile(): Promise<UserProfile> {
        return (await this.users().doc(uid).get()).data() as UserProfile
    }

    //TODO FIX THIS
    public static async attachItemReportListener(
        itemID: ItemID, 
        onNewReportData: (docs: DocChanges) => void,
        onError: (error: Error) => void) 
    {
        const query = this.items().doc(itemID).collection('reports')

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

    // public static async deleteFoundSheet(foundSheetId: string, itemId: string) {
    //     await this.items()
    //         .doc(itemId)
    //         .set(
    //             {
    //                 foundSheets: {
    //                     [foundSheetId]: firestore.FieldValue.delete(),
    //                 },
    //             },
    //             { merge: true }
    //         )
    // }

    //-------
    //The following will be used both in app and website
    //-------

    ///TODO: cloud function to add foundsheet to user profile and item data
    public static async sendReport(report: Report) {
        throw new Error('Not implemented')

        // Need to add data shared between all reports
        // And serialize and add data for each of the types of ReportFields

        // await this.reports()
        //     .doc()
        //     .set({
        //         ...data,
        //         timeSent: new Date().getTime(),
        //     })
    }
}
