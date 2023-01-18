import React from 'react'
import { Text } from 'react-native';
import { Report } from '../../backend/databaseTypes';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';

export default function ReportSummary(props: { report: Report }) {

    const reportDate = new Date(props.report.timeOfCreation)

    const dateString = reportDate.toLocaleDateString()
    const timeString = reportDate.toLocaleTimeString()

    return (
        <Text style={[TextStyles.p, { marginBottom: Spacing.QuarterGap }]}>{`${dateString} at ${timeString}`}</Text>
    )
}