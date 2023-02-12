import { useNavigation } from "@react-navigation/native";
import * as React from "react"
import { Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { Item } from "../../backend/databaseTypes";
import { ActionCard } from "../../ui-base/containers";
import { Spacing } from "../../ui-base/spacing";
import { TextStyles } from "../../ui-base/text";
import { ItemDetailsProps, RootStackParamList } from "../../screens/Navigator";
import ItemProfile from "./ItemProfile";
import { VerticallyCenteringRow } from "../../ui-base/layouts";

export default function ItemSummary(props: Item) {

    const navigation = useNavigation<ItemDetailsProps['navigation']>()

    return (
        <ActionCard style={{ flexGrow: 1, padding: Spacing.Gap, marginBottom: Spacing.Gap }}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('ItemDetails', { item: props })
                }}
            >
                <VerticallyCenteringRow>
                    <ItemProfile {...props} />
                    <Text style={TextStyles.h3}>􀆊</Text>
                </VerticallyCenteringRow>
            </TouchableOpacity>
        </ActionCard>
    )
}