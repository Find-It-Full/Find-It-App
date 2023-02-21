import React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'

export default function CancelButton(props: { label: string, onPress: () => void, disabled?: boolean }) {
    return (
        <TouchableOpacity 
            style={[styles.buttonStyle, { opacity: props.disabled ? 0.6 : 1 }]}
            onPress={props.onPress}

        >
            <Text style={TextStyles.h3}>{props.label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        paddingVertical: Spacing.Gap - 4,
        paddingHorizontal: Spacing.Gap + 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderRadius: 100,
        flexShrink: 1, 
        borderColor: Colors.White, 
        borderWidth: 4
    }
})