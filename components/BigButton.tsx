import * as React from 'react'
import { StyleSheet, TouchableOpacity, Text } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'

export default function BigButton(props: { label: string, onPress: () => void, disabled?: boolean, isInColumn?: boolean }) {
    return (
        <TouchableOpacity 
            style={[styles.buttonStyle, { opacity: props.disabled ? 0.6 : 1, flex: props.isInColumn ? 0 : 1 }]}
            onPress={props.onPress}
            disabled={props.disabled}
        >
            <Text style={[TextStyles.h3, { color: Colors.Black }]}>{props.label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        paddingVertical: Spacing.Gap,
        paddingHorizontal: Spacing.Gap + 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.White,
        borderRadius: 100,
        flex: 1
    }
})