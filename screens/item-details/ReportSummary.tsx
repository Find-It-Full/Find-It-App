import React from 'react'
import { Text } from 'react-native';
import { Report } from '../../backend/databaseTypes';
import { Spacing } from '../../ui-base/spacing';

export default function ReportSummary(props: { report: Report }) {

    const reportDate = new Date(props.report.timeOfCreation)

    const dateString = reportDate.toLocaleDateString()
    const timeString = reportDate.toLocaleTimeString()

    return (
        <Text style={{ marginBottom: Spacing.QuarterGap }}>{`${dateString} at ${timeString}`}</Text>
    )
}