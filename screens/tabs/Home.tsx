import React, { useState } from 'react'
import { useContext, useEffect } from "react"
import {
    Text,
    FlatList,
    TouchableOpacity,
} from "react-native"
import { SubscriptionManagerContext } from "../../backend/SubscriptionManager"
import ItemSummary from "../../components/items/ItemSummary"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { VerticallyCenteringRow } from "../../ui-base/layouts"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { HomeProps, ItemDetailsProps } from "../Navigator"
import { ScreenBase } from "../../ui-base/containers"
import BigButton from "../../components/BigButton"
import { useNavigation } from "@react-navigation/native";
import messaging from '@react-native-firebase/messaging';
import { setDidNotify } from '../../reducers/reports'
import { fetchAllItems } from '../../reducers/items'
import { ItemID, ReportID } from '../../backend/databaseTypes'
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/Ionicons'
import SettingsButton from '../../components/SettingsButton'

interface RemoteNotificationPayload {
    itemID: ItemID
    reportID: ReportID
}

export default function Home(props: HomeProps) {

    const dispatch = useAppDispatch()
    const subscriptions = useContext(SubscriptionManagerContext)
    const items = useAppSelector(state => state.items.items)
    const [incomingNotificationPayload, setIncomingNotificationPayload] = useState<RemoteNotificationPayload | null>(null)
    
    console.log(`Got item count ${Object.keys(items)}`)
    
    useEffect(() => {

        console.log(`Attempting to fetch reports`)

        const unsubscribeCallbacks: (() => void)[] = []
        
        for (const [itemID, _] of Object.entries(items)) {
            unsubscribeCallbacks.push(subscriptions.subscribeToItemReports(itemID))
        }

        return () => { unsubscribeCallbacks.map((cb) => cb()) }
    }, [items])

    useEffect(() => {
        const unsubscribe = subscriptions.subscribeToItems()
        return unsubscribe
    }, [])

    useEffect(() => {
        const unsubscribe = subscriptions.subscribeToAccount()
        return unsubscribe
    }, [])

    useEffect(() => {
        messaging().onNotificationOpenedApp(async remoteMessage => {
            console.log("analytics --- app opened from notification")
            await analytics().logEvent('app_opened_from_notification', {message:remoteMessage})
            if (remoteMessage.data != null && remoteMessage.data.itemID != null && remoteMessage.data.reportID != null) {
                setIncomingNotificationPayload({ itemID: remoteMessage.data.itemID, reportID: remoteMessage.data.reportID })
            }
        })

        messaging().getInitialNotification().then(async remoteMessage => {
            if (remoteMessage) {
                console.log("analytics --- app opened from notification 2")
                await analytics().logEvent('app_opened_from_notification', {message:remoteMessage})
                if (remoteMessage.data != null && remoteMessage.data.itemID != null && remoteMessage.data.reportID != null) {
                    setIncomingNotificationPayload({ itemID: remoteMessage.data.itemID, reportID: remoteMessage.data.reportID })
                }
            }
        })
    }, [])

    useEffect(() => {
        if (Object.keys(items).length > 0 && incomingNotificationPayload) {
            dispatch(setDidNotify(incomingNotificationPayload.reportID))
            props.navigation.navigate('ItemDetails', { itemID: incomingNotificationPayload.itemID })
        }
    }, [items, incomingNotificationPayload])

    return (
        <ScreenBase>
            <VerticallyCenteringRow style={{ marginBottom: Spacing.BigGap }}>
                <Text style={TextStyles.h1}>Items</Text>
                <TouchableOpacity
                    onPress={async () => { console.log("analytics --- open settings")
                    await analytics().logEvent('open_settings', {})
                    props.navigation.navigate('AccountSettings') }}
                    style={{ padding: Spacing.HalfGap, marginRight: -Spacing.HalfGap }}
                >
                    {/* ICON */}
                    <SettingsButton />
                </TouchableOpacity>
            </VerticallyCenteringRow>

            <FlatList
                data={Object.values(items)}
                keyExtractor={(item) => item.itemID}
                renderItem={(item) => (
                    <ItemSummary {...item.item} />
                )}
                ListEmptyComponent={() => <Text style={TextStyles.p}>You don't have any items yet.</Text>}
            />

            <BigButton label='Add Item' isInColumn onPress={async () => {
                console.log("analytics --- add item")
                await analytics().logEvent('add_item_clicked', {})

                props.navigation.navigate('AddItemFlow')
            }} />

        </ScreenBase>
    )
}
