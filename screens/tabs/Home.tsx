import * as React from "react"
import { useEffect } from "react"
import {
    Text,
    Button,
    FlatList,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { fetchAllItems } from "../../reducers/items"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { HomeProps } from "../Navigator"

export default function Home(props: HomeProps) {

    const dispatch = useAppDispatch()
    const items = useAppSelector(state => state.items.items)

    useEffect(() => {
        dispatch(fetchAllItems())
    }, [])

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
