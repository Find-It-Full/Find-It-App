import * as React from "react"
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
import { HomeProps } from "../Navigator"
import { ScreenBase } from "../../ui-base/containers"
import { Colors } from "../../ui-base/colors"

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

    useEffect(() => {
        const unsubscribe = subscriptions.subscribeToItems()
        return unsubscribe
    }, [])

    return (
        <ScreenBase>
            <VerticallyCenteringRow style={{ marginBottom: Spacing.BigGap }}>
                <Text style={TextStyles.h1}>Items</Text>
                <TouchableOpacity
                    
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

            <TouchableOpacity 
                style={styles.addItemButton}
                onPress={() => {
                    props.navigation.navigate('AddItemFlow')
                }}
            >
                <Text style={[TextStyles.h3, { color: Colors.Black }]}>Add Item</Text>
            </TouchableOpacity>
            
        </ScreenBase>
    )
}

const styles = StyleSheet.create({
    addItemButton: {
        paddingVertical: Spacing.Gap,
        paddingHorizontal: Spacing.Gap + 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.White,
        borderRadius: 100,
        flexShrink: 1
    }
})
