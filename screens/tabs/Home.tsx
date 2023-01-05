import * as React from "react"
import { useState } from "react"
import {
    Text,
    Button,
    useColorScheme,
    View,
    Modal,
    FlatList,
} from "react-native"
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context"
import { useAppSelector } from "../../store/hooks"
import AddItemFlowContainer from "../adding-items/AddItemFlowContainer"
import { HomeProps } from "../Navigator"

export default function Home(props: HomeProps) {

    const items = useAppSelector(state => state.items.items)

    const [visible, setVisible] = useState(false)

    return (
        <SafeAreaView>
            <FlatList
                data={Object.values(items)}
                keyExtractor={(item) => item.itemID}
                renderItem={(item) => (
                    <Text>{`${item.item.icon} | ${item.item.name}`}</Text>
                )}
            />
            <Button
                title="Add"
                onPress={() => {
                    props.navigation.navigate('AddItemFlow')
                }}
            />

        </SafeAreaView>
    )
}
