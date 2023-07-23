import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'
import { Radii } from '../ui-base/radii'

export default function CancelButton(props: { label: string, onPress: () => void, disabled?: boolean }) {
    return (
        <TouchableOpacity 
            style={[styles.buttonStyle, { opacity: props.disabled ? Colors.DisabledOpacity : 1 }]}
            onPress={props.onPress}

        >
            <Text style={TextStyles.h4}>{props.label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        paddingVertical: Spacing.Gap,
        paddingHorizontal: Spacing.Gap + 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.PanelColor,
        borderRadius: Radii.ModalRadius,
        flexShrink: 1, 
        borderColor: Colors.PanelColor,
        // backgroundColor: Colors.ButtonColor, 
    }
})