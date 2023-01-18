import { useNavigation } from "@react-navigation/native";
import * as React from "react"
import { Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Item } from "../../backend/databaseTypes";
import { TextStyles } from "../../ui-base/text";
import { ItemDetailsProps, RootStackParamList } from "../Navigator";

export default function ItemSummary(props: Item) {

    const navigation = useNavigation<ItemDetailsProps['navigation']>()

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('ItemDetails', { item: props })
            }}
        >
            <Text style={TextStyles.p}>{`${props.icon}   ${props.name}`}</Text>
        </TouchableOpacity>
    )
}