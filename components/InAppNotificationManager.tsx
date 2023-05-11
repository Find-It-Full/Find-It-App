import React, { useContext } from 'react'
import { View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { useAppSelector } from '../store/hooks'
import InAppReportNotification from './InAppReportNotification'
import InAppErrorNotification, { InAppErrorNotificationType } from './InAppErrorNotification'

export default function InAppNotificationManager(props: { shouldShowNoInternetError: boolean, shouldShowMiscError: boolean, resetNoInternetError: () => void, resetMiscError: () => void }) {

    const safeAreaInsets = useContext(SafeAreaInsetsContext)
    const reportsPendingNotification = useAppSelector(state => state.reports.reportsPendingNotification)
    const reportsToDisplay = Object.values(reportsPendingNotification).sort((a, b) => a.timeOfCreation - b.timeOfCreation)

    if ( ! reportsToDisplay.length && ! props.shouldShowMiscError && ! props.shouldShowNoInternetError) {
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
                props.shouldShowNoInternetError ?
                    <InAppErrorNotification type={InAppErrorNotificationType.NO_INTERNET} resetAction={props.resetNoInternetError} />
                    :
                    null
            }
            {
                props.shouldShowMiscError ?
                    <InAppErrorNotification type={InAppErrorNotificationType.MISC_ERROR} resetAction={props.resetMiscError} />
                    :
                    null
            }
        </View>
    )
}