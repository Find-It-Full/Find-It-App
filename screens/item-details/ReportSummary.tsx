import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import { Report } from '../../backend/databaseTypes';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';

export default function ReportSummary(props: { report: Report, selected: string | null, onPress: () => void }) {

    const reportDate = new Date(props.report.timeOfCreation)

    const dateString = `${reportDate.getMonth() + 1}/${reportDate.getDate()}`
    const timeString = `${reportDate.getHours()}:${reportDate.getMinutes()}`

    const backgroundColor = (props.selected === props.report.reportID) ? 'black' : 'transparent'
    const textColor = (props.selected === props.report.reportID) ? 'white' : 'black'

    return (
        <TouchableOpacity style={{ alignItems: 'center', marginRight: Spacing.HalfGap }} onPress={props.onPress} activeOpacity={0.8}>
            <View style={{ borderColor: 'black', borderWidth: 2, padding: 4, borderRadius: 4, backgroundColor: backgroundColor }}>
                <Text style={[TextStyles.p, { marginBottom: 0, color: textColor }]}>{`${dateString} at ${timeString}`}</Text>
            </View>
            <View style={{ backgroundColor: 'black', width: 2, height: 10 }}></View>
            <View style={{ backgroundColor: 'black', width: 5, height: 5, borderRadius: 2.5 }}></View>
        </TouchableOpacity>
    )
}