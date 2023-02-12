import * as React from "react"
import { useEffect, useState } from "react"
import { Text, Button, TouchableOpacity, View } from "react-native"
import { ScanCodeProps } from "./AddItemFlowContainer"
import { check, PERMISSIONS, RESULTS } from "react-native-permissions"
import QRCodeScanner from "react-native-qrcode-scanner"
import { BarCodeReadEvent } from "react-native-camera"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"

export default function ScanCode({ navigation }: ScanCodeProps) {

    const [scanned, setScanned] = useState("")
    const [cameraAllowed, setCameraAllowed] = useState(false)
    
    function onSuccess(data: BarCodeReadEvent) {
        console.log(`Scanned QR code with data: ${data.data}`)
        const url = data.data.substring(30)
        navigation.navigate('EnterItemDetails', { tagID: url })
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
            navigation.navigate('EnterItemDetails', { tagID: 'bHBE8KHnDdkEiATsv8GE' })
        }, 1000)
    }, [])

    return (
        <View style={{ height: '100%', backgroundColor: 'black' }}>
            {
                cameraAllowed ?
                    null
                    :
                    <Text>Grant camera permission to scan QR code.</Text>
            }
            <TouchableOpacity style={{ margin: Spacing.Gap * 1.5, zIndex: 1 }} onPress={() => navigation.goBack()}>
                <Text style={[TextStyles.i1, { color: 'white' }]}>􀆄</Text>
            </TouchableOpacity>
            <View style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%' }}>
                <QRCodeScanner
                    onRead={onSuccess}
                    cameraStyle={{ height: '100%' }}
                    cameraContainerStyle={{ width: '100%', height: '100%' }}
                    showMarker={false}
                />
            </View>
            <View style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%' }}>
                <View style={{ width: '100%', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}/>
                <View style={{ width: '100%', flex: 1, flexDirection: 'row' }}>
                    <View style={{ height: '100%', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', marginRight: -5 }}/>
                    <View style={{ height: '100%', flex: 4, backgroundColor: 'rgba(0, 0, 0, 0)', borderColor: 'white', borderWidth: 5, borderRadius: 8 }}/>
                    <View style={{ height: '100%', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', marginLeft: -5, zIndex: -1 }}/>
                </View>
                <View style={{ width: '100%', flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}/>
            </View>
            <View style={{ position: 'absolute', top: '66%', width: '100%', alignItems: 'center' }}>
                <Text style={[TextStyles.h2, { color: 'white', marginTop: Spacing.Gap * 2 }]}>Scan a tag to add</Text>
            </View>
        </View>
    )
}