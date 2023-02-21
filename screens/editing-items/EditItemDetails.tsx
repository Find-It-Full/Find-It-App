import React from 'react'
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { EditItemFlowProps } from "../Navigator"
import ItemDetailsForm from "../../components/items/ItemDetailsForm"
import { useAppDispatch } from "../../store/hooks"
import { editItemDetails } from "../../reducers/items"

type EditItemStackParams = {
    EditItemDetails: { itemID: string, name: string, icon: string }
}

export type EditItemDetailsProps = NativeStackScreenProps<EditItemStackParams, 'EditItemDetails'>

const EditItemStack = createNativeStackNavigator<EditItemStackParams>()

export default function EditItemFlowContainer(props: EditItemFlowProps) {
    return (
        <EditItemStack.Navigator screenOptions={{ headerShown: false }}>
            <EditItemStack.Screen name='EditItemDetails' component={EditItemDetails} initialParams={props.route.params.item} />
        </EditItemStack.Navigator>
    )
}

function EditItemDetails({ navigation, route }: EditItemDetailsProps) {

    const dispatch = useAppDispatch()

    const onSubmit = async (name: string, icon: string) => {
        await dispatch(editItemDetails({ name, icon, itemID: route.params.itemID }))
        navigation.goBack()
    }

    return (
        <>
            <ItemDetailsForm onSubmit={onSubmit} currentValues={route.params}/>
        </>
    )
}
