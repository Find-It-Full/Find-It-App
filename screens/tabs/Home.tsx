import React from 'react'
import { useContext, useEffect } from "react"
import {
    Text,
    Button,
    FlatList,
    TouchableOpacity,
    StyleSheet,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { SubscriptionManagerContext } from "../../backend/SubscriptionManager"
import ItemSummary from "../../components/items/ItemSummary"
import Items, { fetchAllItems } from "../../reducers/items"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { VerticallyCenteringRow } from "../../ui-base/layouts"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { HomeProps, ItemDetailsProps } from "../Navigator"
import { ScreenBase } from "../../ui-base/containers"
import { Colors } from "../../ui-base/colors"
import BigButton from "../../components/BigButton"
import { useNavigation } from "@react-navigation/native";
import messaging from '@react-native-firebase/messaging';


export default function Home(props: HomeProps) {

    const dispatch = useAppDispatch()
    const subscriptions = useContext(SubscriptionManagerContext)
    const items = useAppSelector(state => state.items.items)
    if(props.route.params.itemGoTo != null){
        const navigation = useNavigation<ItemDetailsProps['navigation']>()
        navigation.navigate('ItemDetails', { item: items[props.route.params.itemGoTo] })

    }

    useEffect(() => {

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
        // Assume a message-notification contains a "type" property in the data payload of the screen to open
    
        messaging().onNotificationOpenedApp(remoteMessage => {
        if(remoteMessage.data != null && remoteMessage.data.itemId != null){
            const navigation = useNavigation<ItemDetailsProps['navigation']>()
            navigation.navigate('ItemDetails', { item: items[remoteMessage.data.itemId] })
            }

        });

        // Check whether an initial notification is available
        messaging()
          .getInitialNotification()
          .then(remoteMessage => {
            if (remoteMessage) {
                if(remoteMessage.data != null && remoteMessage.data.itemId != null){
                    const navigation = useNavigation<ItemDetailsProps['navigation']>()
                    navigation.navigate('ItemDetails', { item: items[remoteMessage.data.itemId] })
                    }
                
                
             
            }
           
          });
      }, []);




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
            />
            
            <BigButton label='Add Item' isInColumn onPress={() => {
                props.navigation.navigate('AddItemFlow')
            }}/>
            
        </ScreenBase>
    )
}
