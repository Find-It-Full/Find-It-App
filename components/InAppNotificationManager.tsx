import React, { useContext } from 'react'
import { View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { useAppSelector } from '../store/hooks'
import InAppNotification from './InAppNotification'

export default function InAppNotificationManager() {

    const safeAreaInsets = useContext(SafeAreaInsetsContext)
    const reportsPendingNotification = useAppSelector(state => state.userData.reportsPendingNotification)
    const reportsToDisplay = Object.values(reportsPendingNotification).sort((a, b) => a.timeOfCreation - b.timeOfCreation)

    if ( ! reportsToDisplay.length) {
        return null
    }

    return (
        <View style={{ position: 'absolute', top: safeAreaInsets?.top, left: 0, width: '100%' }}>
            {
                reportsToDisplay.map(payload => 
                    <InAppNotification payload={payload} key={payload.reportID} />
                ) 
            }
        </View>
    )
}