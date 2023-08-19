import React from 'react'
import { useEffect, useState } from "react"
import { Text, Button, TouchableOpacity, View, Linking, Alert, Platform, ActivityIndicator } from "react-native"
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
import { BarCodeReadEvent } from 'react-native-camera'
export default function ScanCode({ navigation }: ScanCodeProps) {

    const scannerRef = React.useRef<QRCodeScanner>(null)
    const [cameraAllowed, setCameraAllowed] = useState(false)
    const [didCheckForCameraPermission, setDidCheckForCameraPermission] = useState(false)
    const [isCheckingTag, setIsCheckingTag] = useState(false)

    const AsyncAlert = async (title: string, message: string) => new Promise((resolve) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        resolve('YES');
                    },
                    isPreferred: true
                },
            ],
            { cancelable: false },
        );
    });

    const AsyncAlertWithReportOption = async (title: string, message: string, link: string) => new Promise((resolve) => {
        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Close',
                    onPress: () => {
                        resolve('YES');
                    },
                    isPreferred: false
                },
                {
                    text: 'Report',
                    onPress: () => {
                        Linking.openURL(link)
                        resolve('YES')
                    },
                    isPreferred: true
                },
            ],
            { cancelable: false },
        );
    })

    const IS_KNOWN_ERROR = 'is-known-error'
    
    async function onSuccess(data: any) {
        try {
            const linkID = linkIDForURL(data.data)

            if (!linkID) {
                const err = new Error(`Looks like that's not a Beacon Tag. Only Beacon Tags can be added.`)
                err.name = IS_KNOWN_ERROR
                throw err
            }

            console.log(`LinkID: ${linkID}`)

            const tagID = await FirestoreBackend.getTagID(linkID)

            if (!tagID) {
                const err = new Error(`We can't find a Beacon Tag with that code.`)
                err.name = IS_KNOWN_ERROR
                throw err
            }

            console.log("analytics --- item scanned valid")
            await analytics().logEvent('item_scanned', { valid_tag: true })

            setIsCheckingTag(true)
            await checkCanAddItem(tagID)
            setIsCheckingTag(false)

            navigation.navigate('EnterItemDetails', { tagID: tagID })
            scannerRef.current?.reactivate()
        } 
        catch (e: any) {

            console.log("analytics --- item scanned error")
            await analytics().logEvent('item_scanned', {valid_tag:false,error:e})

            const message = (e.name === IS_KNOWN_ERROR && e.message) ? e.message : `Something went wrong, please try again`

            if (e.showReportButton) {
                await AsyncAlertWithReportOption(`Oops!`, message, data.data)
            }
            else {
                await AsyncAlert(`Oops!`, message)
            }

            setIsCheckingTag(false)
            scannerRef.current?.reactivate()
        }
    }

    async function checkCanAddItem(tagID: string) {
        try {
            await FirestoreBackend.canAddItem(tagID)
        }
        catch (e) {
            const err: {
                message: string
                name: string
                showReportButton: boolean
            } = { 
                message: `Something went wrong, please try again or contact support. (${e.message})`,
                name: IS_KNOWN_ERROR,
                showReportButton: false
            }
            switch (e.code) {
                case 'not-found':
                    err.message = `It looks like that's not a valid Beacon Tag. Please try again or contact support.`
                    break
                case 'cancelled':
                    err.message = `You've already created an item using this tag. To create a new item, delete the old one first.`
                    break
                case 'already-exists':
                    err.message = `This Beacon Tag belongs to someone else. If it's lost, do them a favor and report it!`
                    err.showReportButton = true
                    break
            }
            throw err
        }
    }

    function linkIDForURL(url: string): string | null {
        const pathSegments = url.split('/')
        const domain = 'tags.beacontags.com'

        if (!pathSegments || !pathSegments.includes(domain)) {
            return null
        }

        const domainIndex = pathSegments.indexOf(domain)

        if (domainIndex + 1 >= pathSegments.length) {
            return null
        }

        const id = pathSegments[domainIndex + 1]

        return id
    }

    async function checkForCameraPermission() {
        if (Platform.OS === 'ios') {
            const checkResult = await check(PERMISSIONS.IOS.CAMERA)

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
        }
        else {
            // TODO: handle Android permissions
            const checkResultAndroid = await check(PERMISSIONS.ANDROID.CAMERA)
            if (checkResultAndroid === RESULTS.UNAVAILABLE) {
                Alert.alert('Camera Unavailable', `Currently, a camera is required to add an item. Please contact support for assistance.`)
                setDidCheckForCameraPermission(true)
                return
            }

            const requestResultAndroid = await request(PERMISSIONS.ANDROID.CAMERA)

            if (requestResultAndroid === RESULTS.GRANTED) {
                setCameraAllowed(true)
            }
        }
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
                <Text style={[TextStyles.h2, { color: 'white', marginTop: Spacing.Gap * 4, marginBottom: Spacing.BigGap, textAlign: 'center' }]}>{`Position your Beacon Tag \nin the frame`}</Text>
                {
                    isCheckingTag ?
                        <ActivityIndicator size={'large'} />
                        :
                        null
                }
            </View>
        </View>
    )
}