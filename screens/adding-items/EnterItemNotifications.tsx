import React, { useState } from 'react'
import {
    Alert, View, Text } from "react-native"
import { EnterItemNotificationsProps } from "./AddItemFlowContainer"
import { useAppDispatch } from "../../store/hooks"
import { addNewItem } from "../../reducers/items"
import { FormScreenBase, PopoverFormScreenbase } from "../../ui-base/containers"
import analytics from '@react-native-firebase/analytics';
import BackButton from '../../components/BackButton'
import { VerticallyCenteringRow } from '../../ui-base/layouts'
import { Spacing } from '../../ui-base/spacing'
import BigButton from '../../components/BigButton'
import NotificationsSettingsSelector from '../../components/items/NotificationsSettingsSelector'
import { TextStyles } from '../../ui-base/text'

export default function EnterItemDetails({ navigation, route }: EnterItemNotificationsProps) {

    const dispatch = useAppDispatch()

    const [emailNotifications, setEmailNotifications] = useState(true)
    const [pushNotifications, setPushNotifications] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const tagID = route.params.tagID
    const name = route.params.name
    const icon = route.params.icon
    
    const onSubmit = async (emailNotifications: boolean, pushNotifications: boolean) => {
        
        try {
            await dispatch(addNewItem({
                tagID,
                name,
                icon,
                emailNotifications:emailNotifications,
                pushNotifications:pushNotifications
            }))
            console.log("analytics --- item added")
            await analytics().logEvent('item_added', {tagID:tagID,name:name,icon:icon, pushNotifications:pushNotifications, emailNotifications:emailNotifications})
            navigation.navigate('Home')

        } catch (error) {
            Alert.alert('Failed to add item', error.message)
        }
    }

    const buttons = (
        <BigButton 
            label={`Add Item`} 
            isLoading={isSubmitting}
            onPress={ async () => {
                setIsSubmitting(true)
                await onSubmit(emailNotifications, pushNotifications)
                setIsSubmitting(false)
            }}
            isInColumn
        />
    )

    return (
        <PopoverFormScreenbase externalChildren={<BackButton top={Spacing.Gap} />} buttons={buttons}>
            <View style={{ flex: 1 }}>
                <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap }]}>Notification Settings</Text>
                <Text style={[TextStyles.p, { marginBottom: Spacing.Gap }]}>When this item is spotted, how would you like to be notified?</Text>
                <NotificationsSettingsSelector 
                    emailNotificationsChanged={setEmailNotifications}
                    pushNotificationsChanged={setPushNotifications}
                    currentValues={{ emailNotifications, pushNotifications }} 
                    isSubmitting={isSubmitting} 
                />
            </View>
        </PopoverFormScreenbase>
    )
}
