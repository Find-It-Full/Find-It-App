import React, { createContext } from "react"
import { deleteItem, directlyAddItem, updateItem } from "../reducers/items"
import { addReportToItem, removeAllReportsFromItem, removeReportFromItem } from "../reducers/reports"
import { notifyUserOfReport, setViewedReports } from "../reducers/userData"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { DocChanges, isReport, Item, ItemID, Report, ReportViewStatus, UserData } from "./databaseTypes"
import { FirestoreBackend } from "./firestoreBackend"

interface SubscriptionManagerInterface {
    subscribeToItemReports: (itemID: ItemID) => (() => void)
    subscribeToItems: () => (() => void)
    subscribeToViewedReports: () => (() => void)
}

const SubscriptionManagerContext = createContext({ } as SubscriptionManagerInterface)
export { SubscriptionManagerContext }

const SubscriptionManager = (props: { children?: React.ReactNode }) => {

    const dispatch = useAppDispatch()
    const viewedReports = useAppSelector(state => state.userData.viewedReports)
    const didFetchViewedReports = useAppSelector(state => state.userData.didFetchViewedReports)

    const subscribeToItemReports = (itemID: ItemID) => {

        console.log(`Subscribing to reports for: ${itemID}; did fetch view state ${didFetchViewedReports}; viewed count ${Object.keys(viewedReports).length}`)

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

                        if ( ! Object.keys(viewedReports).includes(data.reportID) || viewedReports[data.reportID] === ReportViewStatus.UNSEEN) {
                            console.log('Notifying of report')
                            dispatch(notifyUserOfReport({ itemID: data.itemID, reportID: data.reportID }))
                        }

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
            console.error(`Error when attempting to retrieve item reports for ${itemID}: ${error.message}`)
            if (error.message.includes('permission-denied')) {
                console.log('User does not have permissions to view reports on item. Clearing...')
                dispatch(removeAllReportsFromItem(itemID))
            }
        }

        const unsubscribe = FirestoreBackend.attachItemReportListener(itemID, onNewReportData, onError)

        return unsubscribe
    }

    const subscribeToViewedReports = () => {
        const onNewViewedReports = (snapshot: UserData) => {

            if ( ! snapshot.viewedReports) {
                return
            }

            console.log(`Got viewed reports: ${Object.keys(snapshot.viewedReports).length}`)

            dispatch(setViewedReports(snapshot.viewedReports))
        }

        const onError = (error: Error) => {
            console.error(`Error while attempting to retrieve viewed reports: ${error.message}`)
        }

        const unsubscribe = FirestoreBackend.attachViewedReportsListener(onNewViewedReports, onError)

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
            console.error(`Error when attempting to retrieve item updates: ${error.message}`)
        }

        const unsubscribe = FirestoreBackend.attachItemsListener(onNewItemData, onError)

        return unsubscribe
    }

    const subscriptions: SubscriptionManagerInterface = {
        subscribeToItemReports: subscribeToItemReports,
        subscribeToItems: subscribeToItems,
        subscribeToViewedReports: subscribeToViewedReports
    }

    return (
        <SubscriptionManagerContext.Provider value={subscriptions} >
            {props.children}
        </SubscriptionManagerContext.Provider>
    )
}

export default SubscriptionManager