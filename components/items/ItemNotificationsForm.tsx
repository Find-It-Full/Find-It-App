import React from 'react'
import { useState } from "react"
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
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
import EmojiPickerManager from '../../screens/EmojiPicker'
import DropDown from '../DropDown'

export default function ItemNotificationsForm(props: { onSubmit: (emailNotifications: string, pushNotifications: string) => Promise<void>, currentValues?: { emailNotifications: string, pushNotifications: string }, onCancel?: () => void }) {

    const [emailNotifications, setEmailNotifications] = useState(props.currentValues?.emailNotifications ?? "Always")
    const [pushNotifications, setPushNotifications] = useState(props.currentValues?.pushNotifications ?? "Always")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const emailNotificationsValid =  ["Always","Never","When Missing"].includes(emailNotifications); 
    const pushNotificationsValid =   ["Always","Never","When Missing"].includes(pushNotifications); 

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
                    <Text style={[TextStyles.h3, { marginBottom: Spacing.BigGap, marginTop: props.currentValues ? 0 : Spacing.BigGap }]}>{"Email Notifications"}</Text>
                    <DropDown currentValue={emailNotifications} onSelect={setEmailNotifications}></DropDown>  
                    <Text style={[TextStyles.h3, { marginBottom: Spacing.BigGap, marginTop: props.currentValues ? 0 : Spacing.BigGap }]}>{"Push Notifications"}</Text>
                    <DropDown currentValue={pushNotifications} onSelect={setPushNotifications}></DropDown>

                </>
                <Text style = {[TextStyles.p,{paddingTop:Spacing.Gap}]}>* Always: Always get notified when your item is scanned</Text>
                <Text style = {[TextStyles.p,{paddingTop:Spacing.HalfGap}]}>* When Missing: Only get notified when you mark your item as lost</Text>
                <Text style = {[TextStyles.p,{paddingTop:Spacing.HalfGap}]}>* Never: Never get notified</Text>
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
                    disabled={ ! emailNotificationsValid || ! pushNotificationsValid || (props.currentValues && (props.currentValues.pushNotifications === pushNotifications && props.currentValues.emailNotifications === emailNotifications))} 
                    isLoading={isSubmitting}
                    onPress={ async () => {
                        setIsSubmitting(true)
                        await props.onSubmit(emailNotifications, pushNotifications)
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
