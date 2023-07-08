import React from 'react'
import { useEffect, useState } from "react"
import { Text, Button, TouchableOpacity, View, Linking, Alert } from "react-native"
import { ScanCodeProps } from "./AddItemFlowContainer"
import { check, PERMISSIONS, request, RESULTS } from "react-native-permissions"
import QRCodeScanner from "react-native-qrcode-scanner"
import { Spacing } from "../../ui-base/spacing"
import { TextStyles } from "../../ui-base/text"
import auth from '@react-native-firebase/auth'
import { FirestoreBackend } from "../../backend/firestoreBackend"
import { TagID } from "../../backend/databaseTypes"
import AsyncStorage from '@react-native-async-storage/async-storage'
import analytics from '@react-native-firebase/analytics';
import Icon from 'react-native-vector-icons/Ionicons'
export default function ScanCode({ navigation }: ScanCodeProps) {

    const scannerRef = React.useRef<QRCodeScanner>(null)
    const [cameraAllowed, setCameraAllowed] = useState(false)
    const [didCheckForCameraPermission, setDidCheckForCameraPermission] = useState(false)
    
    async function onSuccess(data: any) {
        console.log(`Scanned QR code with data: ${data.data}`)
        
        try {
            const url = data.data
            const pathSegments = url.split('/')

            const id = pathSegments[(pathSegments.length)-1]
            console.log(id)
            const tagID = await FirestoreBackend.getTagID(id)
            console.log("analysitcs --- item scanned valid")
            await analytics().logEvent('item_scanned', {valid_tag:true})
            navigation.navigate('EnterItemDetails', { tagID: tagID })
        } catch (e) {
            console.log("analysitcs --- item scanned error")
            await analytics().logEvent('item_scanned', {valid_tag:false,error:e})
            console.log(`Read invalid URL: ${e}`)
            scannerRef.current?.reactivate()
        }
    }

    async function checkForCameraPermission() {
        console.log("Checking camera permissions...")

        const checkResult = await check(PERMISSIONS.IOS.CAMERA)
        console.log(`Got result: ${checkResult}`)

        switch (checkResult) {
            case RESULTS.BLOCKED:
                // The user has denied usage; handled elsewhere
                return
            case RESULTS.DENIED:
                // Camera is available, need to request permissions
                break
            case RESULTS.GRANTED:
            case RESULTS.LIMITED:
                setCameraAllowed(true)
                return
            case RESULTS.UNAVAILABLE:
                Alert.alert('Camera Unavailable', `Currently, a camera is required to add an item. Please contact support for assistance.`)
                return
        }

        console.log('Requesting camera permissions...')
        const requestResult = await request(PERMISSIONS.IOS.CAMERA)
        console.log(`Got result ${requestResult}`)
        if (requestResult === RESULTS.GRANTED) {
            setCameraAllowed(true)
        }

        // TODO: handle Android permissions
        // const checkResultAndroid = await check(PERMISSIONS.ANDROID.CAMERA)
        // if (checkResultAndroid === RESULTS.UNAVAILABLE) {
        //     Alert.alert('Camera Unavailable', `Currently, a camera is required to add an item. Please contact support for assistance.`)
        //     setDidCheckForCameraPermission(true)
        //     return
        // }

        // const requestResultAndroid = await request(PERMISSIONS.ANDROID.CAMERA)

        // if (requestResultAndroid === RESULTS.GRANTED) {
        //     setCameraAllowed(true)
        // }
    }

    async function checkForPriorCameraDenial() {
        console.log('Checking for prior denial.')
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
        checkForCameraPermission().then(() => setDidCheckForCameraPermission(true))
    }, [])


    // useEffect(() => {

    //     onSuccess({data:"https://gobilabsllc.page.link/nsDwXrdJZek4MTSSA"} as BarCodeReadEvent)
    // }, [])

    useEffect(() => {
        if (didCheckForCameraPermission && ! cameraAllowed) {
            checkForPriorCameraDenial()
        }
    }, [cameraAllowed, didCheckForCameraPermission])

    return (
        <View style={{ height: '100%', backgroundColor: 'black' }}>
            {
                cameraAllowed ?
                    null
                    :
                    <Text>Grant camera permission to scan QR code.</Text>
            }
            <TouchableOpacity style={{ margin: Spacing.Gap * 1.5, zIndex: 1 }} onPress={() => navigation.goBack()}>
                <Text style={[TextStyles.i1, { color: 'white' }]}><Icon style={[TextStyles.i1, { color: 'white' }]} name = 'ios-close'/></Text>
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