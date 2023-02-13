import React, { createContext } from "react"
import { deleteItem, directlyAddItem, updateItem } from "../reducers/items"
import { addReportToItem, removeReportFromItem } from "../reducers/reports"
import { useAppDispatch } from "../store/hooks"
import { DocChanges, isReport, Item, ItemID, Report } from "./databaseTypes"
import { FirestoreBackend } from "./firestoreBackend"

interface SubscriptionManagerInterface {
    subscribeToItemReports: (itemID: ItemID) => (() => void)
    subscribeToItems: () => (() => void)
}

const SubscriptionManagerContext = createContext({ } as SubscriptionManagerInterface)
export { SubscriptionManagerContext }

const SubscriptionManager = (props: { children?: React.ReactNode }) => {

    const dispatch = useAppDispatch()

    const subscribeToItemReports = (itemID: ItemID) => {

        const onNewReportData = (changes: DocChanges) => {
            console.log(`Got item report updates (${changes.length})...`)

            changes.forEach((change) => {

                const data = change.doc.data()

                if ( ! isReport(data)) {
                    console.error('<- Report is invalid.')
                    return
                }

                switch (change.type) {
                    case 'added':
                        console.log('<- Report is new, added.')
                        dispatch(addReportToItem(data))
                        break
                    case 'modified':
                        console.error('<- INVARIANT VIOLATION: reports cannot be modified.')
                        break
                    case 'removed':
                        console.log('<- Report was removed, removing.')
                        dispatch(removeReportFromItem(data))
                        break
                }
            })
        }

        const onError = (error: Error) => {
            console.error(`Error when attempting to retrieve item reports: ${JSON.stringify(error)}`)
        }

        const unsubscribe = FirestoreBackend.attachItemReportListener(itemID, onNewReportData, onError)

        return unsubscribe
    }

    const subscribeToItems = () => {

        const onNewItemData = (changes: DocChanges) => {
            changes.forEach((change) => {
                const data = change.doc.data()

                switch (change.type) {
                    case 'added':
                        dispatch(directlyAddItem(data as Item))
                        break
                    case 'modified':
                        dispatch(updateItem(data as Item))
                        break
                    case 'removed':
                        dispatch(deleteItem(data.itemID))
                }
            })
        }

        const onError = (error: Error) => {
            console.error(`Error when attempting to retrieve item updates: ${JSON.stringify(error)}`)
        }

        const unsubscribe = FirestoreBackend.attachItemsListener(onNewItemData, onError)

        return unsubscribe
    }

    const subscriptions: SubscriptionManagerInterface = {
        subscribeToItemReports: subscribeToItemReports,
        subscribeToItems: subscribeToItems
    }

    return (
        <SubscriptionManagerContext.Provider value={subscriptions} >
            {props.children}
        </SubscriptionManagerContext.Provider>
    )
}

export default SubscriptionManager