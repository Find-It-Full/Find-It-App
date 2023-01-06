import * as React from "react"
import { useState } from "react"
import {
    Button,
    View,
    TextInput,
    Text,
    Alert
} from "react-native"
import { EnterItemDetailsProps } from "./AddItemFlowContainer"
import { useAppDispatch } from "../../store/hooks"
import { addNewItem } from "../../reducers/items"

export default function EnterItemDetails({ navigation, route }: EnterItemDetailsProps) {

    const dispatch = useAppDispatch()

    const [name, setName] = useState("")
    const [icon, setIcon] = useState("")
    
    const tagID = route.params.tagID

    const nameValid = name.length > 0
    const iconValid = icon.length > 0

    return (
        <View style={{ flex: 1 }}>

            <Text>{`ID: ${tagID}`}</Text>
            <TextInput
                placeholder={"Name"}
                onChangeText={(text: string) => {
                    setName(text)
                }}
            />
            <TextInput
                placeholder={"Icon"}
                onChangeText={(text: string) => {
                    setIcon(text)
                }}
            />

            <Button
                title="Add Item"
                disabled={ ! nameValid || ! iconValid}
                onPress={async () => {
                    try {
                        await dispatch(addNewItem({
                            tagID,
                            itemID: '',
                            name,
                            icon,
                            isMissing: false,
                            reports: { }
                        }))

                        navigation.navigate('Home')

                    } catch (error) {
                        Alert.alert('Failed to add item', error.message)
                    }
                }}
            />

        </View>
    )
}
