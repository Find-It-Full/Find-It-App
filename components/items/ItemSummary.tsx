import { useNavigation } from "@react-navigation/native";
import React from 'react'
import { Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Item } from "../../backend/databaseTypes";
import { ActionCard } from "../../ui-base/containers";
import { Spacing } from "../../ui-base/spacing";
import { TextStyles } from "../../ui-base/text";
import { ItemDetailsProps, RootStackParamList } from "../../screens/Navigator";
import ItemProfile from "./ItemProfile";
import { Spacer, VerticallyCenteringRow } from "../../ui-base/layouts";
import { useAppSelector } from "../../store/hooks";
import { Colors } from "../../ui-base/colors";
import Icon from 'react-native-vector-icons/Ionicons'
import PlatformIcon, { Icons } from "../PlatformIcon";
export default function ItemSummary(props: Item) {

    const navigation = useNavigation<ItemDetailsProps['navigation']>()
    const newReports = useAppSelector(state => state.items.newReports[props.itemID]) ?? { }

    return (
        <ActionCard style={{ flexGrow: 1, padding: Spacing.Gap, marginBottom: Spacing.Gap }}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('ItemDetails', { itemID: props.itemID })
                }}
            >
                <VerticallyCenteringRow>   
                    <ItemProfile {...props} />
                    <VerticallyCenteringRow style={{ flexGrow: 1 }}>
                        {
                            Object.keys(newReports).length > 0 ?
                                <View style={{ backgroundColor: Colors.Red, borderRadius: 10, width: 8, height: 8 }} />
                                :
                                null
                        }
                        <Spacer size={Spacing.HalfGap} />
                        <PlatformIcon icon={Icons.FORWARD} />
                    </VerticallyCenteringRow>
                </VerticallyCenteringRow>
            </TouchableOpacity>
        </ActionCard>
    )
}