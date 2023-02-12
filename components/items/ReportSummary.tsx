import React from 'react'
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { isMessage, MessageReportField, Report } from '../../backend/databaseTypes';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';

export default function ReportSummary(props: { report: Report, isSelected: string | null, onPress: () => void }) {

    const reportDate = new Date(props.report.timeOfCreation)

    const dateString = `${reportDate.getMonth() + 1}/${reportDate.getDate()}`
    const timeString = `${reportDate.getHours()}:${reportDate.getMinutes()}`

    const messageField = props.report.fields.MESSAGE
    const [message, hasMessage] = isMessage(messageField) ? [messageField.message, true] : ['No message included.', false]

    const windowWidth = useWindowDimensions().width

    return (
        <View style={[{ width: windowWidth }, styles.container]}>
            <View style={styles.contentContainer}>
                <Text style={[TextStyles.h4, { marginBottom: 0, color: 'white' }]}>{`${dateString} at ${timeString}`}</Text>
                <Text style={[TextStyles.p, { color: 'white', fontStyle: hasMessage ? 'normal' : 'italic' }]}>{message}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        padding: Spacing.ScreenPadding,
    },
    contentContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        padding: Spacing.Gap,
        borderRadius: 10
    }
})