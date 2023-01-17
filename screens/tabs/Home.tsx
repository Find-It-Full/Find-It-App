import * as React from "react"
import { useContext, useEffect } from "react"
import {
    Text,
    Button,
    FlatList,
    TouchableOpacity,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { SubscriptionManagerContext } from "../../backend/SubscriptionManager"
import ItemSummary from "../../components/items/ItemSummary"
import Items, { fetchAllItems } from "../../reducers/items"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { VerticallyCenteringRow } from "../../ui-base/layouts"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { HomeProps } from "../Navigator"

export default function Home(props: HomeProps) {

    const dispatch = useAppDispatch()
    const subscriptions = useContext(SubscriptionManagerContext)
    const items = useAppSelector(state => state.items.items)

    useEffect(() => {
        dispatch(fetchAllItems())
    }, [])

    useEffect(() => {

        const unsubscribeCallbacks: (() => void)[] = []

        for (const [itemID, _] of Object.entries(items)) {
            unsubscribeCallbacks.push(subscriptions.subscribeToItemReports(itemID))
        }

        return () => { unsubscribeCallbacks.map((cb) => cb()) }
    }, [items])

    return (
        <SafeAreaView style={{ padding: Spacing.ScreenPadding }}>
            <VerticallyCenteringRow style={{ marginBottom: Spacing.Gap }}>
                <Text style={TextStyles.h1}>Items</Text>
                <TouchableOpacity
                    onPress={() => {
                        props.navigation.navigate('AddItemFlow')
                    }}
                >
                    <Text style={TextStyles.b1}>+ Add</Text>
                </TouchableOpacity>
            </VerticallyCenteringRow>
            
            <FlatList
                data={Object.values(items)}
                keyExtractor={(item) => item.itemID}
                renderItem={(item) => (
                    <ItemSummary {...item.item} />
                )}
            />
            
        </SafeAreaView>
    )
}
