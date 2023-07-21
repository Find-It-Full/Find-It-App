import React, { useEffect, useRef, useState } from 'react'
import { FirestoreBackend } from "../../backend/firestoreBackend"
import { Alert, AppState, Linking } from 'react-native'
import ActionButtonList from '../ActionButtonList'
import BooleanField from '../BooleanField'
import messaging from '@react-native-firebase/messaging'
import { Spacing } from '../../ui-base/spacing'

export default function NotificationsSettingsSelector(props: { emailNotificationsChanged: (v: boolean) => void, pushNotificationsChanged: (v: boolean) => void, currentValues: { emailNotifications: boolean, pushNotifications: boolean }, isSubmitting: boolean }) {

    const requestNotificationPermission = async () => {

        if (!props.currentValues.pushNotifications) {
            return
        }

        const token = await messaging().getToken()
        await FirestoreBackend.addNotificationToken(token)

        const authStatus = await messaging().requestPermission()
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
      
        if (!enabled) {
            Alert.alert(
                'Notifications Not Enabled', 
                `In order to receive push notifications, please enable them in Settings.`,
                [{
                    text: 'Go to Settings',
                    isPreferred: true,
                    onPress: () => { Linking.openSettings() }
                },
                {
                    text: 'OK',
                    onPress: () => { props.pushNotificationsChanged(false) }
                }])
        }
    }

    useEffect(() => {
        if (props.isSubmitting && props.currentValues.pushNotifications) {
            requestNotificationPermission()
        }
    }, [props.isSubmitting])

    return (
        <ActionButtonList>
            <BooleanField label='Receive Push Notifications' onValueChange={props.pushNotificationsChanged} value={props.currentValues.pushNotifications} style={{ marginBottom: Spacing.ThreeQuartersGap }} />
            <BooleanField label='Receive Emails' onValueChange={props.emailNotificationsChanged} value={props.currentValues.emailNotifications} />
        </ActionButtonList>
    )
}