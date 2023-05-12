import React from 'react'
import { useState } from "react"
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    TouchableWithoutFeedback,
    Keyboard
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
import TextField from "../TextField"
import EmojiPicker from '../../screens/EmojiPicker'

export default function ItemDetailsForm(props: { onSubmit: (name: string, icon: string) => Promise<void>, currentValues?: { name: string, icon: string }, onCancel?: () => void }) {

    const [name, setName] = useState(props.currentValues?.name ?? '')
    const [icon, setIcon] = useState(props.currentValues?.icon ?? '')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const nameValid = name.length > 0
    const iconValid = icon.length > 0

    const navigation = useNavigation()

    const cancel = () => {
        if (props.onCancel) {
            props.onCancel()
        } else {
            navigation.goBack()
        }
    }

    return (
        <>
            <View style={{ flex: props.currentValues ? 0 : 1 }}>
                <>
                    <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap, marginTop: props.currentValues ? 0 : Spacing.BigGap }]}>{ props.currentValues ? 'Edit Item' : 'Item Information'}</Text>
                    {   
                        props.currentValues ?
                            null
                            :
                            <Text style={[TextStyles.p2, { marginBottom: Spacing.Gap }]}>{`What sort of item is this?`}</Text>
                    }
                    <TextField
                        placeholder='Name'
                        value={name}
                        onChangeText={(text) => {
                            setName(text)
                        }}
                    />
                    <EmojiPicker currentValue={icon} onSelect={setIcon} />               
                </>
            </View>
            <VerticallyCenteringRow>
                {
                    props.currentValues ? 
                        <>
                            <CancelButton label='Cancel' onPress={cancel} disabled={isSubmitting}/>
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
        </>
    )
}

const styles = StyleSheet.create({
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
