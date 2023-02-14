import * as React from 'react'
import { ScreenBaseNoInsets } from '../ui-base/containers'
import { TextStyles } from '../ui-base/text'
import { Alert, AppState, Linking, Text } from 'react-native'
import { Spacer, VerticallyCenteringRow } from '../ui-base/layouts'
import { Spacing } from '../ui-base/spacing'
import BigButton from '../components/BigButton'
import { MarkAsLostProps } from './Navigator'
import CancelButton from '../components/CancelButton'
import messaging from '@react-native-firebase/messaging'
import { useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '../store/hooks'
import { setItemIsMissing } from '../reducers/items'

export default function MarkAsLost(props: MarkAsLostProps) {

    const appState = useRef(AppState.currentState)
    const dispatch = useAppDispatch()

    const setIsMissing = async () => {
        await dispatch(setItemIsMissing(props.route.params.item.itemID))
        props.navigation.goBack()
    }

    const requestNotificationPermission = async () => {
        const authStatus = await messaging().requestPermission()
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL
      
        if (enabled) {
            setIsMissing()
        } else {
            Alert.alert(
                'Notifications Not Enabled', 
                `Enable notifications in Settings to get notified when your item is spotted. Don't worry, sightings will still show up here regardless.`,
                [{
                    text: 'Go to Settings',
                    onPress: () => Linking.openSettings()
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
                nextAppState === 'active'
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
        <ScreenBaseNoInsets>
            <Spacer size={Spacing.BigGap} />
            <Text style={TextStyles.h2}>Mark As Lost</Text>
            <Spacer size={Spacing.BigGap} />
            <Text style={TextStyles.p}>When you mark an item as lost, you'll get notified whenever someone spots it.</Text>
            <Spacer size={Spacing.BigGap} />
            <VerticallyCenteringRow>
                <CancelButton label='Cancel' onPress={props.navigation.goBack} />
                <Spacer size={Spacing.BigGap} />
                <BigButton label='Get Notified' onPress={requestNotificationPermission}/>
            </VerticallyCenteringRow>
        </ScreenBaseNoInsets>
    )
}
