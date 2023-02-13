import * as React from "react"
import {
    Alert} from "react-native"
import { EnterItemDetailsProps } from "./AddItemFlowContainer"
import { useAppDispatch } from "../../store/hooks"
import { addNewItem } from "../../reducers/items"
import ItemDetailsForm from "../../components/items/ItemDetailsForm"

export default function EnterItemDetails({ navigation, route }: EnterItemDetailsProps) {

    const dispatch = useAppDispatch()

    const tagID = route.params.tagID

    const onSubmit = async (name: string, icon: string) => {
        try {
            await dispatch(addNewItem({
                tagID,
                itemID: '',
                name,
                icon,
                isMissing: false,
                reports: { }
            }))

            navigation.navigate('Home')

        } catch (error) {
            Alert.alert('Failed to add item', error.message)
        }
    }

    return (
        <ItemDetailsForm onSubmit={onSubmit} />
    )
}
