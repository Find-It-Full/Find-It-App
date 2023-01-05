import * as React from "react"
import { useEffect, useState } from "react"
import { Text, Button, TouchableOpacity } from "react-native"
import { ScanCodeProps } from "./AddItemFlowContainer"
import { check, PERMISSIONS, RESULTS } from "react-native-permissions"
import QRCodeScanner from "react-native-qrcode-scanner"
import { BarCodeReadEvent } from "react-native-camera"

export default function ScanCode({ navigation }: ScanCodeProps) {

    const [scanned, setScanned] = useState("")
    const [cameraAllowed, setCameraAllowed] = useState(false)
    
    function onSuccess(data: BarCodeReadEvent) {
        console.log(`Scanned QR code with data: ${data.data}`)
        const url = data.data.substring(30)
        navigation.navigate('EnterItemDetails', { itemID: url })
    }

    async function checkForCameraPermission() {
        console.log("Checking camera permissions...")

        const result = await check(PERMISSIONS.IOS.CAMERA)
        console.log(`Got result: ${result}`)
        if (result == RESULTS.GRANTED) {
            setCameraAllowed(true)
        }

        const resultAndroid = await check(PERMISSIONS.ANDROID.CAMERA)
        if (resultAndroid == RESULTS.GRANTED) {
            setCameraAllowed(true)
        }
    }

    useEffect(() => {
        checkForCameraPermission()
    }, [cameraAllowed])

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('EnterItemDetails', { itemID: Math.round(Math.random() * 10000).toString() })
        }, 1000)
    }, [])

    return (
        <>
            {
                cameraAllowed ?
                    null
                    :
                    <Text>Grant camera permission to scan QR code.</Text>
            }

            <QRCodeScanner
                onRead={onSuccess}
                topContent={
                    <Text>
                        Scan your QR code {scanned}
                    </Text>
                }
            />
        </>
    )
}