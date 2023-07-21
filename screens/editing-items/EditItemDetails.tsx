import React from 'react'
import { useState } from "react"
import {
    Text,
    StyleSheet,
    View,
} from "react-native"
import { FormScreenBase, ScreenBase } from "../../ui-base/containers"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import { Colors } from "../../ui-base/colors"
import { Spacer, VerticallyCenteringRow } from "../../ui-base/layouts"
import BigButton from '../../components/BigButton'
import CancelButton from '../../components/CancelButton'
import TextField from '../../components/TextField'
import BooleanField from '../../components/BooleanField'
import { EditItemProps } from '../Navigator'
import BackButton from '../../components/BackButton'
import { useAppDispatch } from '../../store/hooks'
import { editItemDetails } from '../../reducers/items'
import ActionButtonList from '../../components/ActionButtonList'
import EmojiPicker from '../../components/EmojiPicker'
import NotificationsSettingsSelector from '../../components/items/NotificationsSettingsSelector'

export default function EditItemDetails(props: EditItemProps) {

    const dispatch = useAppDispatch()

    const item = props.route.params.item
    const [name, setName] = useState(item.name)
    const [icon, setIcon] = useState(item.icon)
    const [emailNotifications, setEmailNotifications] = useState(item.emailNotifications)
    const [pushNotifications, setPushNotifications] = useState(item.pushNotifications)
    const [isSubmitting, setIsSubmitting] = useState(false)


    const nameValid = name.length > 0
    const iconValid = icon.length > 0

    const onEditSubmit = async (name: string, icon: string, emailNotifications: boolean, pushNotifications: boolean) => {
        await dispatch(editItemDetails({ name, icon, itemID: item.itemID, emailNotifications: emailNotifications, pushNotifications: pushNotifications }))
        props.navigation.goBack()
    }

    const onCancel = () => {
        props.navigation.goBack()
    }

    return (
        <FormScreenBase externalChildren={<BackButton />}>
            <View style={{ flex: 1, paddingTop: Spacing.BigGap }}>
                <Text style={[TextStyles.h3, { marginBottom: Spacing.Gap, marginTop: Spacing.Gap }]}>Item Info</Text>
                <TextField
                    placeholder='Item Name'
                    value={name}
                    onChangeText={(text) => {
                        setName(text)
                    }}
                    style={{ marginBottom: Spacing.ThreeQuartersGap }}
                />
                <EmojiPicker currentValue={icon} onSelect={setIcon} />          
                
                <Text style={[TextStyles.h3, { marginBottom: Spacing.Gap, marginTop: Spacing.BigGap }]}>Notification Settings</Text>
                <NotificationsSettingsSelector currentValues={{ emailNotifications, pushNotifications }} emailNotificationsChanged={setEmailNotifications} pushNotificationsChanged={setPushNotifications} isSubmitting={isSubmitting} />
            </View> 
            <VerticallyCenteringRow>
                <BigButton 
                    label={'Save Changes'} 
                    disabled={ 
                        ! nameValid || 
                        ! iconValid || 
                        ((item.icon === icon && item.name === name && item.emailNotifications === emailNotifications && item.pushNotifications === pushNotifications))} 
                    isLoading={isSubmitting}
                    onPress={ async () => {
                        setIsSubmitting(true)
                        await onEditSubmit(name, icon, emailNotifications, pushNotifications)
                        setIsSubmitting(false)
                    }}
                />
            </VerticallyCenteringRow>
        </FormScreenBase>
    )
}
