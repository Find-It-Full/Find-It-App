import * as React from "react"
import { useState, useEffect } from "react"
import {
    StyleSheet,
} from "react-native"
import { check, PERMISSIONS, RESULTS } from "react-native-permissions"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import ScanCode from "./ScanCode"
import EnterItemDetails from "./EnterItemDetails"
import { AddItemFlowProps } from "../Navigator"

type AddItemStackParamList = {
    ScanCode: undefined
    EnterItemDetails: { itemID: string }
}

export type ScanCodeProps = NativeStackScreenProps<AddItemStackParamList, 'ScanCode'>
export type EnterItemDetailsProps = NativeStackScreenProps<AddItemStackParamList, 'EnterItemDetails'>

const AddItemStack = createNativeStackNavigator<AddItemStackParamList>()

export default function AddItemFlowContainer(props: AddItemFlowProps) {
    const [scaned, setScanned] = useState("")
    const [allowed, setAllowed] = useState(false)
    function onSuccess(data) {
        console.warn(data)
        const url = data.data.substring(30)
        // props.navigation.navigate("DetailsAdd", { id: url })
    }
    async function conf() {
        const result = await check(PERMISSIONS.IOS.CAMERA)
        if (result == RESULTS.GRANTED) {
            setAllowed(true)
        }
        const resultAndroid = await check(PERMISSIONS.ANDROID.CAMERA)
        if (resultAndroid == RESULTS.GRANTED) {
            setAllowed(true)
        }
    }
    useEffect(() => {
        conf()
    }, [])

    // props.navigation.navigate("DetailsAdd", { id: "abc123" })

    return (
        <AddItemStack.Navigator>
            <AddItemStack.Screen name='ScanCode' component={ScanCode} />
            <AddItemStack.Screen name='EnterItemDetails' component={EnterItemDetails} />
        </AddItemStack.Navigator>
    )
}

/*
    <QRCodeScanner
        onRead={onSuccess}
        topContent={
            <Text style={styles.centerText}>
                Scan your QR code {scaned}
            </Text>
        }
    />
*/

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: "#777",
    },
    textBold: {
        fontWeight: "500",
        color: "#000",
    },
    buttonText: {
        fontSize: 21,
        color: "rgb(0,122,255)",
    },
    buttonTouchable: {
        padding: 16,
    },
})
