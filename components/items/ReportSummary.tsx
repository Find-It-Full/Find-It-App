import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { isExactLocation, isMessage, Report } from '../../backend/databaseTypes';
import LocationCoder from '../../backend/LocationCoder';
import { Colors } from '../../ui-base/colors';
import { VerticallyCenteringGroupedRow, VerticallyCenteringRow } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';

export default function ReportSummary(props: { report: Report, isSelected: string | null }) {

    const reportDate = new Date(props.report.timeOfCreation)

    const dateString = `${reportDate.getMonth() + 1}/${reportDate.getDate()}`
    const timeString = `${reportDate.getHours()}:${reportDate.getMinutes()}`

    const messageField = props.report.fields.MESSAGE
    const [message, hasMessage] = isMessage(messageField) ? [messageField.message, true] : ['No message included.', false]
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

        LocationCoder.geocodePosition({ lat: location.latitude, lng: location.longitude })
            .then((codedLocation) => { 
                if (codedLocation.length === 0) {
                    return console.error('got no coded locations')
                }
                const loc = (` • ${codedLocation[0].streetNumber ? codedLocation[0].streetNumber + ' ' : ''}${codedLocation[0].streetName}`)
                console.log(loc)
                setLocationString(loc)
            })
            .catch((err) => console.error(err))

    }, [props.isSelected])

    const windowWidth = useWindowDimensions().width

    return (
        <View style={[{ width: windowWidth }, styles.container]}>
            <View style={styles.contentContainer}>
                <VerticallyCenteringRow style={{ marginBottom: Spacing.QuarterGap, justifyContent: 'flex-start' }}>
                    <Text style={TextStyles.h4}>{`${dateString} at ${timeString}`}</Text>
                    <Text style={TextStyles.h4}>{`${locationString}`}</Text>
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