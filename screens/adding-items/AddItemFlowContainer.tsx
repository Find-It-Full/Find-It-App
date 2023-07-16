import React from 'react'
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import ScanCode from "./ScanCode"
import EnterItemDetails from "./EnterItemDetails"
import { AddItemFlowProps } from "../Navigator"
import EnterItemNotifications from './EnterItemNotifications'

type AddItemStackParamList = {
    ScanCode: undefined
    EnterItemDetails: { tagID: string }
    EnterItemNotifications: { tagID: string, name:string, icon:string }
    Home: undefined
}

export type ScanCodeProps = NativeStackScreenProps<AddItemStackParamList, 'ScanCode'>
export type EnterItemDetailsProps = NativeStackScreenProps<AddItemStackParamList, 'EnterItemDetails'>
export type EnterItemNotificationsProps = NativeStackScreenProps<AddItemStackParamList, 'EnterItemNotifications'>

const AddItemStack = createNativeStackNavigator<AddItemStackParamList>()

export default function AddItemFlowContainer(props: AddItemFlowProps) {
    return (
        <AddItemStack.Navigator screenOptions={{ headerShown: false }}>
            <AddItemStack.Screen name='ScanCode' component={ScanCode} />
            <AddItemStack.Screen name='EnterItemDetails' component={EnterItemDetails} />
            <AddItemStack.Screen name='EnterItemNotifications' component={EnterItemNotifications} />
        </AddItemStack.Navigator>
    )
}
