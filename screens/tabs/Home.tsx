import React from 'react'
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
import { resetViewedReports } from '../../reducers/userData'


export default function Home(props: HomeProps) {

    const dispatch = useAppDispatch()
    const subscriptions = useContext(SubscriptionManagerContext)
    const items = useAppSelector(state => state.items.items)
    const didFetchViewedReports = useAppSelector(state => state.userData.didFetchViewedReports)

    console.log(`Got item count ${Object.keys(items)}`)

    useEffect(() => {

        console.log(`Attempting to fetch reports`)

        if ( ! didFetchViewedReports) {
            console.log(`View status has not been fetched.`)
            return
        }

        const unsubscribeCallbacks: (() => void)[] = []

        for (const [itemID, _] of Object.entries(items)) {
            unsubscribeCallbacks.push(subscriptions.subscribeToItemReports(itemID))
        }

        return () => { unsubscribeCallbacks.map((cb) => cb()) }
    }, [items, didFetchViewedReports])

    useEffect(() => {
        const unsubscribe = subscriptions.subscribeToItems()
        return unsubscribe
    }, [])

    useEffect(() => {
        console.log(`Resetting viewed reports`)
        dispatch(resetViewedReports())
        console.log(`Subscribing to viewed reports`)
        const unsubscribe = subscriptions.subscribeToViewedReports()
        return unsubscribe
    }, [])

    useEffect(() => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            if (remoteMessage.data != null && remoteMessage.data.itemId != null) {
                const navigation = useNavigation<ItemDetailsProps['navigation']>()
                navigation.navigate('ItemDetails', { item: items[remoteMessage.data.itemId] })
            }
        })

        messaging().getInitialNotification().then(remoteMessage => {
            if (remoteMessage) {
                if (remoteMessage.data != null && remoteMessage.data.itemId != null) {
                    const navigation = useNavigation<ItemDetailsProps['navigation']>()
                    navigation.navigate('ItemDetails', { item: items[remoteMessage.data.itemId] })
                }
            }
        })
    }, [])

    return (
        <ScreenBase>
            <VerticallyCenteringRow style={{ marginBottom: Spacing.BigGap }}>
                <Text style={TextStyles.h1}>Items</Text>
                <TouchableOpacity
                    onPress={() => { props.navigation.navigate('AccountSettings') }}
                    style={{ padding: Spacing.HalfGap, marginRight: -Spacing.HalfGap }}
                >
                    <Text style={TextStyles.b1}>􀣌</Text>
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

            <BigButton label='Add Item' isInColumn onPress={() => {
                props.navigation.navigate('AddItemFlow')
            }} />

        </ScreenBase>
    )
}
