import * as React from "react"
import { useState } from "react"
import {
    Button,
    View,
    TextInput,
    Text,
    Alert,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import { EnterItemDetailsProps } from "./AddItemFlowContainer"
import { useAppDispatch } from "../../store/hooks"
import { addNewItem } from "../../reducers/items"
import { ScreenBase, ScreenBaseNoInsets } from "../../ui-base/containers"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { Colors } from "../../ui-base/colors"
import { Radii } from "../../ui-base/radii"

export default function EnterItemDetails({ navigation, route }: EnterItemDetailsProps) {

    const dispatch = useAppDispatch()

    const [name, setName] = useState("")
    const [icon, setIcon] = useState("")
    
    const tagID = route.params.tagID

    const nameValid = name.length > 0
    const iconValid = icon.length > 0

    return (
        <ScreenBaseNoInsets style={{ paddingTop: Spacing.BigGap * 2 }}>

            <Text style={TextStyles.h2}>Item Information</Text>
            <Text style={[TextStyles.p2, { marginVertical: Spacing.Gap }]}>{`ID: ${tagID}`}</Text>
            <TextInput
                placeholder={"Name"}
                style={[TextStyles.h3, styles.input]}
                onChangeText={(text: string) => {
                    setName(text)
                }}
            />
            <TextInput
                placeholder={"Icon"}
                style={[TextStyles.h3, styles.input, { marginBottom: Spacing.BigGap }]}
                onChangeText={(text: string) => {
                    setIcon(text)
                }}
            />

            <TouchableOpacity
                disabled={ ! nameValid || ! iconValid}
                style={styles.addItemButton}
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
            >
                <Text style={[TextStyles.h3, { color: Colors.Black }]}>Add Item</Text>
            </TouchableOpacity>

        </ScreenBaseNoInsets>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.ButtonColor,
        padding: Spacing.ThreeQuartersGap,
        borderRadius: Radii.ItemRadius,
        borderWidth: 1,
        borderColor: Colors.ItemBorder,
        marginBottom: Spacing.Gap
    },
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
