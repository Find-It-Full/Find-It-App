import React from 'react'
import { FormScreenBase, ModalFormScreenBase, ScreenBaseNoInsets } from '../ui-base/containers'
import { TextStyles } from '../ui-base/text'
import { Alert, AppState, Linking, Text, View } from 'react-native'
import { Spacer, VerticallyCenteringRow } from '../ui-base/layouts'
import { Spacing } from '../ui-base/spacing'
import BigButton from '../components/BigButton'
import { MarkAsLostProps } from './Navigator'
import CancelButton from '../components/CancelButton'
import messaging from '@react-native-firebase/messaging'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setItemIsMissing } from '../reducers/items'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { FirestoreBackend } from '../backend/firestoreBackend'

export default function MarkAsLost(props: { itemID: string, forceClose: () => void }) {

    const appState = useRef(AppState.currentState)
    const dispatch = useAppDispatch()
    const [isMarkingAsLost, setIsMarkingAsLost] = useState(false)
    const [didGoToSettings, setDidGoToSettings] = useState(false)

    const setIsMissing = async () => {
        setIsMarkingAsLost(true)

        const result = await dispatch(setItemIsMissing(props.itemID))

        // If the operation failed, we can leave the modal open but we need to stop loading
        if (result.meta.requestStatus === 'rejected') {
            setIsMarkingAsLost(false)
        }
    }

    const requestNotificationPermission = async () => {
        const authStatus = await messaging().requestPermission()
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
      
        if (enabled) {
            setIsMissing()
            const token = await messaging().getToken()
            FirestoreBackend.addNotificationToken(token)
        } else {
            Alert.alert(
                'Notifications Not Enabled', 
                `Enable notifications in Settings to get notified when your item is spotted. Don't worry, sightings will still show up here regardless.`,
                [{
                    text: 'Go to Settings',
                    onPress: () => { Linking.openSettings(); setDidGoToSettings(true) }
                },
                {
                    text: 'OK',
                    onPress: () => setIsMissing()
                }])
        }
    }

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active' &&
                didGoToSettings
            ) {
                setIsMissing()
            }

            appState.current = nextAppState
        })

        return () => {
            subscription.remove()
        }
    }, [])

    return (
        <ModalFormScreenBase closeModal={props.forceClose}>
            <Text style={TextStyles.h2}>Set as Lost</Text>
            <Spacer size={Spacing.BigGap} />
            <Text style={TextStyles.p}>When you set this item as lost, you'll get notified whenever someone spots it.</Text>
            <Spacer size={Spacing.BigGap} />
            <VerticallyCenteringRow>
                <CancelButton label='Cancel' onPress={props.forceClose} disabled={isMarkingAsLost} />
                <Spacer size={Spacing.BigGap} />
                <BigButton label='Get Notified' onPress={requestNotificationPermission} isLoading={isMarkingAsLost} />
            </VerticallyCenteringRow>
        </ModalFormScreenBase>
    )
}
