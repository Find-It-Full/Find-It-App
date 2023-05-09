import React, { useContext } from 'react'
import { View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { useAppSelector } from '../store/hooks'
import InAppReportNotification from './InAppReportNotification'
import InAppNoInternetNotification from './InAppNoInternetNotification'

export default function InAppNotificationManager() {

    const safeAreaInsets = useContext(SafeAreaInsetsContext)
    const reportsPendingNotification = useAppSelector(state => state.reports.reportsPendingNotification)
    const reportsToDisplay = Object.values(reportsPendingNotification).sort((a, b) => a.timeOfCreation - b.timeOfCreation)

    const shouldShowNoInternetError = useAppSelector(state => state.items.notifyOfNoInternet)
    const shouldShowMiscError = useAppSelector(state => state.items.notifyOfMiscError)

    if ( ! reportsToDisplay.length && ! shouldShowMiscError && ! shouldShowNoInternetError) {
        return null
    }

    return (
        <View style={{ position: 'absolute', top: safeAreaInsets?.top, left: 0, width: '100%' }}>
            {
                reportsToDisplay.map(payload => 
                    <InAppReportNotification payload={payload} key={payload.reportID} />
                ) 
            }
            {
                shouldShowNoInternetError ?
                    <InAppNoInternetNotification />
                    :
                    null
            }
        </View>
    )
}