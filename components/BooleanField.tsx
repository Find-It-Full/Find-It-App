import React from 'react'
import { View, StyleSheet, Text, Switch, ViewStyle, StyleProp } from 'react-native'
import { Radii } from '../ui-base/radii'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'
import { Colors } from '../ui-base/colors'
import { VerticallyCenteringGroupedRow, VerticallyCenteringRow } from '../ui-base/layouts'

export default function BooleanField(props: { label: string, onValueChange: (on: boolean) => void, value: boolean, style?: StyleProp<ViewStyle> }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <VerticallyCenteringRow style={{ padding: Spacing.ThreeQuartersGap, justifyContent: 'space-between', flex: 1 }}>
                <Text style={[TextStyles.p]}>{props.label}</Text>
                <Switch value={props.value} onValueChange={props.onValueChange}/>
            </VerticallyCenteringRow>
        </View>
        // <View style={[styles.input, props.style]}>
        //     <Text style={[TextStyles.h4]}>{props.label}</Text>
        //     <Switch value={props.value} onValueChange={props.onValueChange}/>
        // </View>
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.ButtonColor,
        padding: Spacing.Gap,
        paddingVertical: Spacing.Gap,
        borderRadius: Radii.ItemRadius,
        borderWidth: 1,
        borderColor: Colors.ItemBorder,
        marginBottom: Spacing.Gap,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    }
})