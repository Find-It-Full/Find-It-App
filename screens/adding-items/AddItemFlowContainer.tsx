import * as React from "react"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import ScanCode from "./ScanCode"
import EnterItemDetails from "./EnterItemDetails"
import { AddItemFlowProps } from "../Navigator"

type AddItemStackParamList = {
    ScanCode: undefined
    EnterItemDetails: { tagID: string }
    Home: undefined
}

export type ScanCodeProps = NativeStackScreenProps<AddItemStackParamList, 'ScanCode'>
export type EnterItemDetailsProps = NativeStackScreenProps<AddItemStackParamList, 'EnterItemDetails'>

const AddItemStack = createNativeStackNavigator<AddItemStackParamList>()

export default function AddItemFlowContainer(props: AddItemFlowProps) {
    return (
        <AddItemStack.Navigator>
            <AddItemStack.Screen name='ScanCode' component={ScanCode} />
            <AddItemStack.Screen name='EnterItemDetails' component={EnterItemDetails} />
        </AddItemStack.Navigator>
    )
}
