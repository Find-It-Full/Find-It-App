import * as React from "react"
import { useState } from "react"
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity
} from "react-native"
import { ScreenBaseNoInsets } from "../../ui-base/containers"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { Colors } from "../../ui-base/colors"
import { Radii } from "../../ui-base/radii"
import { VerticallyCenteringRow } from "../../ui-base/layouts"
import { useNavigation } from "@react-navigation/native"

export default function ItemDetailsForm(props: { onSubmit: (name: string, icon: string) => void, currentValues?: { name: string, icon: string } }) {

    const [name, setName] = useState(props.currentValues?.name ?? '')
    const [icon, setIcon] = useState(props.currentValues?.icon ?? '')

    const nameValid = name.length > 0
    const iconValid = icon.length > 0

    const navigation = useNavigation()

    return (
        <ScreenBaseNoInsets style={{ paddingTop: Spacing.BigGap * 2 }}>

            <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap }]}>{props.currentValues ? 'Edit' : 'Item'} Information</Text>
            {/* <Text style={[TextStyles.p2, { marginVertical: Spacing.Gap }]}>{`ID: ${tagID}`}</Text> */}
            <TextInput
                placeholder={"Name"}
                style={[TextStyles.h3, styles.input]}
                value={name}
                onChangeText={(text: string) => {
                    setName(text)
                }}
            />

            <TextInput
                placeholder={"Icon"}
                style={[TextStyles.h3, styles.input, { marginBottom: Spacing.BigGap }]}
                value={icon}
                onChangeText={(text: string) => {
                    setIcon(text)
                }}
            />

            <VerticallyCenteringRow>
                {
                    props.currentValues ? 
                        <TouchableOpacity 
                            style={[styles.addItemButton, { backgroundColor: 'transparent', marginRight: Spacing.BigGap }]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={[TextStyles.h3, { paddingHorizontal: Spacing.BigGap }]}>Cancel</Text>
                        </TouchableOpacity> :
                        null
                }
                <TouchableOpacity
                    disabled={ ! nameValid || ! iconValid}
                    style={[styles.addItemButton, { opacity: nameValid && iconValid ? 1 : 0.6, flex: 1 }]}
                    onPress={() => props.onSubmit(name, icon)}
                >
                    <Text style={[TextStyles.h3, { color: Colors.Black }]}>{props.currentValues ? `Save Changes` : `Add Item`}</Text>
                </TouchableOpacity>
            </VerticallyCenteringRow>

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
        paddingVertical: Spacing.Gap - 4,
        paddingHorizontal: Spacing.Gap + 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.White,
        borderRadius: 100,
        flexShrink: 1, 
        borderColor: Colors.White, 
        borderWidth: 4
    }
})
