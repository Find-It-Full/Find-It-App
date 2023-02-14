import * as React from "react"
import { useState } from "react"
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native"
import { FormScreenBase, ScreenBaseNoInsets } from "../../ui-base/containers"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { Colors } from "../../ui-base/colors"
import { Radii } from "../../ui-base/radii"
import { Spacer, VerticallyCenteringRow } from "../../ui-base/layouts"
import { useNavigation } from "@react-navigation/native"
import CancelButton from "../CancelButton"
import BigButton from "../BigButton"
import { SafeAreaInsetsContext } from "react-native-safe-area-context"

export default function ItemDetailsForm(props: { onSubmit: (name: string, icon: string) => Promise<void>, currentValues?: { name: string, icon: string } }) {

    const [name, setName] = useState(props.currentValues?.name ?? '')
    const [icon, setIcon] = useState(props.currentValues?.icon ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)

    const nameValid = name.length > 0
    const iconValid = icon.length > 0

    const navigation = useNavigation()

    return (
        <FormScreenBase>
            <View style={{ flex: 1, justifyContent: 'center' }}>
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
            </View>
            <VerticallyCenteringRow style={{ marginBottom: safeAreaInsets?.bottom }}>
                {
                    props.currentValues ? 
                        <>
                            <CancelButton label='Cancel' onPress={() => navigation.goBack()} disabled={isSubmitting}/>
                            <Spacer size={Spacing.BigGap} />
                        </> :
                        null
                }
                <BigButton 
                    label={props.currentValues ? `Save Changes` : `Add Item`} 
                    disabled={ ! nameValid || ! iconValid || (props.currentValues && (props.currentValues.icon === icon && props.currentValues.name === name))} 
                    isLoading={isSubmitting}
                    onPress={ async () => {
                        setIsSubmitting(true)
                        await props.onSubmit(name, icon)
                        setIsSubmitting(false)
                    }}
                />
            </VerticallyCenteringRow>

        </FormScreenBase>
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
