import React, { createContext } from "react"
import { deleteItem, directlyAddItem, addNewReport, updateItem } from "../reducers/items"
import { addReportToItem, changeReportViewStatus, removeAllReportsFromItem, removeReportFromItem } from "../reducers/reports"
import { notifyUserOfReport } from "../reducers/reports"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { isReport, Item, ItemID, Report, ReportViewStatus, UserData } from "./databaseTypes"
import { FirestoreBackend } from "./firestoreBackend"
import { DocChanges } from "./appOnlyDatabaseTypes"
import auth from '@react-native-firebase/auth'
import { User } from "@react-native-google-signin/google-signin"
import { setAccountDetails } from "../reducers/userData"

interface SubscriptionManagerInterface {
    subscribeToItemReports: (itemID: ItemID) => (() => void)
    subscribeToItems: () => (() => void)
    subscribeToAccount: () => (() => void)
}

const SubscriptionManagerContext = createContext({ } as SubscriptionManagerInterface)
export { SubscriptionManagerContext }

const SubscriptionManager = (props: { children?: React.ReactNode }) => {

    const dispatch = useAppDispatch()

    const subscribeToItemReports = (itemID: ItemID) => {

        console.log(`Subscribing to reports for: ${itemID}`)

        const onNewReportData = (changes: DocChanges) => {
            console.log(`Got item report updates (${changes.length})...`)

            changes.forEach((change) => {

                const data = change.doc.data()

                if ( ! isReport(data)) {
                    console.error('<- Report is invalid.')
                    return
                }

                const userID = auth().currentUser?.uid

                switch (change.type) {
                    case 'added':
                        console.log('<- Report is new, added.')

                        dispatch(addReportToItem(data))

                        if (userID && data.viewStatus[userID] === ReportViewStatus.UNSEEN) {
                            console.log('Notifying of report')
                            dispatch(notifyUserOfReport({ itemID: data.itemID, reportID: data.reportID }))
                        }

                        if (userID && data.viewStatus[userID] !== ReportViewStatus.SEEN) {
                            dispatch(addNewReport({ itemID: data.itemID, reportID: data.reportID }))
                        }

                        break
                    case 'modified':
                        if ( ! userID) {
                            return
                        }
                        dispatch(changeReportViewStatus({ report: data, userID: userID }))
                        console.log(`<- Report view status changed to ${data.viewStatus[userID]}`)
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

    const subscribeToAccount = () => {

        FirestoreBackend.updateLastLogin().catch(e => console.error('failed to update last login'))

        const onNewAccountData = (data: any) => {
            dispatch(setAccountDetails(data as UserData))
        }

        const onError = (error: Error) => {
            console.error(`Error when attempting to retrieve User Data: ${error.message}`)
        }

        const unsubscribe = FirestoreBackend.attachAccountListener(onNewAccountData, onError)

        return unsubscribe
    }

    const subscriptions: SubscriptionManagerInterface = {
        subscribeToItemReports: subscribeToItemReports,
        subscribeToItems: subscribeToItems,
        subscribeToAccount: subscribeToAccount
    }

    return (
        <SubscriptionManagerContext.Provider value={subscriptions} >
            {props.children}
        </SubscriptionManagerContext.Provider>
    )
}

export default SubscriptionManager