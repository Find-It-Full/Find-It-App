import React from 'react'
import { useState } from "react"
import {
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    View,
    Keyboard,
    Switch
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

export default function ItemNotificationsForm(props: { onSubmit: (emailNotifications: boolean, pushNotifications: boolean) => Promise<void>, currentValues?: { emailNotifications: boolean, pushNotifications: boolean }, onCancel?: () => void }) {

    const [emailNotifications, setEmailNotifications] = useState(props.currentValues?.emailNotifications ?? true)
    const [pushNotifications, setPushNotifications] = useState(props.currentValues?.pushNotifications ?? true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    

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
                    
                    
                    <Text style={[TextStyles.h3, {  marginTop: props.currentValues ? 0 : Spacing.BigGap, paddingRight:Spacing.BigGap }]}>{"Push Notifications "}</Text>
                    <Switch value = {pushNotifications} onValueChange={setPushNotifications}/>
                    
                    
                    
                    
                    <View style ={{paddingBottom:Spacing.BigGap}}/>
                    <Text style={[TextStyles.h3, {  marginTop: props.currentValues ? 0 : Spacing.BigGap }]}>{"Email Notifications "}
                    </Text>
                    <Switch value = {emailNotifications} onValueChange={setEmailNotifications}/>

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
                    disabled={  (props.currentValues && (props.currentValues.pushNotifications === pushNotifications && props.currentValues.emailNotifications === emailNotifications))} 
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
