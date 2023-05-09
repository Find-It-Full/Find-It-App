import React from 'react'
import { useEffect, useState } from "react"
import { Text, Button, TouchableOpacity, View, Linking, Alert } from "react-native"
import { ScanCodeProps } from "./AddItemFlowContainer"
import { check, PERMISSIONS, RESULTS } from "react-native-permissions"
import QRCodeScanner from "react-native-qrcode-scanner"
import { BarCodeReadEvent } from "react-native-camera"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import auth from '@react-native-firebase/auth'
import { FirestoreBackend } from "../../backend/firestoreBackend"
import { TagID } from "../../backend/databaseTypes"
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ScanCode({ navigation }: ScanCodeProps) {

    const scannerRef = React.useRef<QRCodeScanner>(null)
    const [cameraAllowed, setCameraAllowed] = useState(false)
    const [didCheckForCameraPermission, setDidCheckForCameraPermission] = useState(false)
    
    async function onSuccess(data: BarCodeReadEvent) {
        console.log(`Scanned QR code with data: ${data.data}`)
        try {
            const url = data.data
            const pathSegments = url.split('/')

            const id = pathSegments[(pathSegments.length)-1]
            console.log(id)
            const tagID = await FirestoreBackend.getTagID(id)
            
            navigation.navigate('EnterItemDetails', { tagID: tagID })
        } catch (e) {
            console.log(`Read invalid URL: ${e}`)
            scannerRef.current?.reactivate()
        }
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

        setDidCheckForCameraPermission(true)
    }

    async function checkForPriorCameraDenial() {
        try {
            const didDeny = await AsyncStorage.getItem('didDenyCameraPermissions')
            if (didDeny !== null) {
                Alert.alert('Camera Access Denied', 'Access to your camera is required to add an item.', [
                    {
                        text: 'Go to Settings',
                        onPress: () => { Linking.openSettings() }
                    },
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ])
            } else {
                await AsyncStorage.setItem('didDenyCameraPermissions', 'true')
                navigation.goBack()
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        checkForCameraPermission()
    }, [cameraAllowed, didCheckForCameraPermission])

    useEffect(() => {
        if (didCheckForCameraPermission && ! cameraAllowed) {
            checkForPriorCameraDenial()
        }
    }, [cameraAllowed, didCheckForCameraPermission])

    // useEffect(() => {
    //     setTimeout(() => {
    //        onSuccess({
    //            data: "https://gobilabsllc.page.link/TC1ExH5Xzv9Bd8S8A",
    //            type: "aztec",
    //            bounds: {
    //                width: 0,
    //                height: 0,
    //                origin: []
    //            },
    //            image: ""
    //        })
    //     }, 1000)
    // }, [])

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
                    reactivateTimeout={4}
                    ref={scannerRef}
                    vibrate={false}
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