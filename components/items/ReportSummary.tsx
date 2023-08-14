import React, { useEffect, useState } from 'react'
import { Linking, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { isContactInformation, isExactLocation, isMessage, Report, ReportViewStatus } from '../../backend/databaseTypes';
import { Colors } from '../../ui-base/colors';
import { VerticallyCenteringRow } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';
import analytics from '@react-native-firebase/analytics';

export default function ReportSummary(props: { report: Report, isSelected: string | null }) {

    const reportDate = new Date(props.report.timeOfCreation)
    const time = reportDate.toLocaleTimeString([], {timeZone: "America/New_York", month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit'})?.replace(',', ' at') ?? 'unknown'
    const contactPhoneNumber = isContactInformation(props.report.fields.CONTACT_INFORMATION) ? props.report.fields.CONTACT_INFORMATION.contactInfo : null

    const messageField = props.report.fields.MESSAGE
    const [message, hasMessage] = isMessage(messageField) ? [`"${messageField.message}"`, true] : ['Your spotter did not include a message', false]
    const [locationString, setLocationString] = useState<string>('')

    useEffect(() => {

        const location = props.report.fields.EXACT_LOCATION

        if ( ! isExactLocation(location)) {
            setLocationString(' • No location provided')
            return
        }

        if (props.isSelected !== props.report.reportID) {
            return
        }

        if (locationString.length > 0) {
            return
        }

    }, [props.isSelected])

    const windowWidth = useWindowDimensions().width

    const PhoneNumber = () => {
        if (contactPhoneNumber) {
            return (
                <TouchableOpacity

                    onPress={async () => {
                        console.log("analytics --- open mesages")
                        await analytics().logEvent('open_messages', { report: props.report })
                        Linking.openURL(`mailto:${contactPhoneNumber}`)
                    }
                    }
                >
                    <Text style={[TextStyles.p, { textDecorationLine: 'underline' }]}>Email your spotter 􀰾</Text>
                </TouchableOpacity>
            )
        }
        else {
            return null
        }
    }

    return (
        <View style={[{ width: windowWidth }, styles.container]}>
            <View style={styles.contentContainer}>
                <VerticallyCenteringRow style={{ marginBottom: Spacing.QuarterGap, justifyContent: 'flex-start' }}>
                    <Text style={TextStyles.h4}>{`Spotted on ${time}`}</Text>
                    <Text style={TextStyles.h4}>{`${locationString}`}</Text>
                </VerticallyCenteringRow>
                <VerticallyCenteringRow style={{ justifyContent: 'flex-start', marginBottom: Spacing.QuarterGap }}>
                    <PhoneNumber />
                </VerticallyCenteringRow>
                <Text style={[TextStyles.p, { fontStyle: hasMessage ? 'normal' : 'italic' }]}>{message}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        paddingHorizontal: Spacing.ScreenPadding,
    },
    contentContainer: {
        width: '100%',
        backgroundColor: Colors.PanelColor,
        padding: Spacing.Gap,
        borderRadius: 10
    }
})