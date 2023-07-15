import React from 'react'
import {
    Alert} from "react-native"
import { EnterItemDetailsProps } from "./AddItemFlowContainer"
import { useAppDispatch } from "../../store/hooks"
import { addNewItem } from "../../reducers/items"
import ItemDetailsForm from "../../components/items/ItemDetailsForm"
import { FormScreenBase } from "../../ui-base/containers"
import analytics from '@react-native-firebase/analytics';
export default function EnterItemDetails({ navigation, route }: EnterItemDetailsProps) {

    const dispatch = useAppDispatch()

    const tagID = route.params.tagID

    const onSubmit = async (name: string, icon: string) => {
        try {
            await dispatch(addNewItem({
                tagID,
                name,
                icon,
                emailNotifications:"always",
                pushNotifications:"always"
            }))
            console.log("analytics --- item added")
            await analytics().logEvent('item_added', {tagID:tagID,name:name,icon:icon})
            navigation.navigate('Home')

        } catch (error) {
            Alert.alert('Failed to add item', error.message)
        }
    }

    return (
        <FormScreenBase>
            <ItemDetailsForm onSubmit={onSubmit} />
        </FormScreenBase>
    )
}
