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


    
    const tagID = route.params.tagID
    const onSubmit = async (name: string, icon: string) => {
        navigation.navigate('EnterItemNotifications',{name:name, icon:icon, tagID:tagID})
    }

    return (
        <FormScreenBase>
            <ItemDetailsForm onSubmit={onSubmit} />
        </FormScreenBase>
    )
}
