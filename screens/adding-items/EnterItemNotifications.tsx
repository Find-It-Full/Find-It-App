import React from 'react'
import {
    Alert} from "react-native"
import { EnterItemDetailsProps, EnterItemNotificationsProps } from "./AddItemFlowContainer"
import { useAppDispatch } from "../../store/hooks"
import { addNewItem } from "../../reducers/items"
import ItemDetailsForm from "../../components/items/ItemDetailsForm"
import { FormScreenBase } from "../../ui-base/containers"
import analytics from '@react-native-firebase/analytics';
import ItemNotificationsForm from '../../components/items/ItemNotificationsForm'
import BackButton from '../../components/BackButton'
import { Spacer } from '../../ui-base/layouts'
import { Spacing } from '../../ui-base/spacing'
export default function EnterItemDetails({ navigation, route }: EnterItemNotificationsProps) {

    const dispatch = useAppDispatch()

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

    return (
        <FormScreenBase>
            <BackButton top={Spacing.Gap} />
            <Spacer size={Spacing.BigGap * 2} />
            <ItemNotificationsForm onSubmit={onSubmit} />
        </FormScreenBase>
    )
}
