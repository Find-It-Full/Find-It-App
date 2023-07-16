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
export default function EnterItemDetails({ navigation, route }: EnterItemNotificationsProps) {

    const dispatch = useAppDispatch()

    const tagID = route.params.tagID
    const name = route.params.name
    const icon = route.params.icon
    
    
    const onSubmit = async (emailNotifications: string, pushNotifications: string) => {
        
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
            <ItemNotificationsForm onSubmit={onSubmit} />
        </FormScreenBase>
    )
}
