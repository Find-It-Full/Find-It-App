import { useNavigation } from "@react-navigation/native";
import * as React from "react"
import { Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Item } from "../../backend/databaseTypes";
import { ItemDetailsProps, RootStackParamList } from "../../screens/Navigator";

export default function ItemSummary(props: Item) {

    const navigation = useNavigation<ItemDetailsProps['navigation']>()

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('ItemDetails', { item: props })
            }}
        >
            <Text>{`${props.icon}   ${props.name}`}</Text>
        </TouchableOpacity>
    )
}