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
import EmojiPickerComponent from '../../components/EmojiPicker'
import NotificationsSettingsSelector from '../../components/items/NotificationsSettingsSelector'

export default function EditItemDetails(props: EditItemProps) {

    const dispatch = useAppDispatch()

    const item = props.route.params.item
    const [untrimmedName, setUntrimmedName] = useState(item.name)
    const [icon, setIcon] = useState(item.icon)
    const [emailNotifications, setEmailNotifications] = useState(item.emailNotifications)
    const [pushNotifications, setPushNotifications] = useState(item.pushNotifications)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const name = untrimmedName.trim()

    const nameValid = name.length > 0
    const iconValid = icon.length > 0

    const onEditSubmit = async (name: string, icon: string, emailNotifications: boolean, pushNotifications: boolean) => {
        await dispatch(editItemDetails({ name, icon, itemID: item.itemID, emailNotifications: emailNotifications, pushNotifications: pushNotifications }))
        props.navigation.goBack()
    }

    const onCancel = () => {
        props.navigation.goBack()
    }

    const buttons = (
        <VerticallyCenteringRow>
            <CancelButton label='Cancel' onPress={onCancel} disabled={isSubmitting}/>
            <Spacer size={Spacing.BigGap} />
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
    )

    return (
        <FormScreenBase externalChildren={<BackButton />} buttons={buttons}>
            <View style={{ flex: 1, paddingTop: Spacing.BigGap }}>
                <Text style={[TextStyles.h3, { marginBottom: Spacing.Gap, marginTop: Spacing.Gap }]}>Item Information</Text>
                <Text style={[TextStyles.h4, { marginBottom: Spacing.HalfGap, marginTop: Spacing.QuarterGap }]}>Name</Text>
                <TextField
                    placeholder='Name'
                    value={untrimmedName}
                    onChangeText={(text) => {
                        setUntrimmedName(text)
                    }}
                    style={{ marginBottom: Spacing.ThreeQuartersGap }}
                />
                <Text style={[TextStyles.h4, { marginBottom: Spacing.HalfGap, marginTop: Spacing.QuarterGap }]}>Icon</Text>
                <EmojiPickerComponent currentValue={icon} onSelect={setIcon} />          
                
                <Text style={[TextStyles.h3, { marginBottom: Spacing.Gap, marginTop: Spacing.BigGap }]}>Notification Settings</Text>
                <NotificationsSettingsSelector currentValues={{ emailNotifications, pushNotifications }} emailNotificationsChanged={setEmailNotifications} pushNotificationsChanged={setPushNotifications} isSubmitting={isSubmitting} />
            </View> 
        </FormScreenBase>
    )
}
