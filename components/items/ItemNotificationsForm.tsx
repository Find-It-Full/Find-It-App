import React from 'react'
import { useState } from "react"
import {
    Text,
    StyleSheet,
    View} from "react-native"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { Colors } from "../../ui-base/colors"
import { Spacer, VerticallyCenteringRow } from "../../ui-base/layouts"
import { useNavigation } from "@react-navigation/native"
import CancelButton from "../CancelButton"
import BigButton from "../BigButton"
import NotificationsSettingsSelector from './NotificationsSettingsSelector'

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
                <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap, marginTop: props.currentValues ? 0 : Spacing.BigGap }]}>{'Notification Settings'}</Text>
                <Text style={[TextStyles.p, { marginBottom: Spacing.Gap }]}>When this item is spotted, how would you like to be notified?</Text>
                <NotificationsSettingsSelector 
                    emailNotificationsChanged={setEmailNotifications}
                    pushNotificationsChanged={setPushNotifications}
                    currentValues={{ emailNotifications, pushNotifications }} 
                    isSubmitting={isSubmitting} 
                />
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
