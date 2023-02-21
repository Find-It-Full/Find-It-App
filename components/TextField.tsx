import React from 'react'
import { TextInput, StyleSheet } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Radii } from '../ui-base/radii'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'

export default function TextField(props: { onChangeText: (text: string) => void, value: string, placeholder?: string }) {
    return (
        <TextInput
            placeholder={props.placeholder}
            style={[TextStyles.h3, styles.input, { marginBottom: Spacing.BigGap }]}
            value={props.value}
            onChangeText={props.onChangeText}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.ButtonColor,
        padding: Spacing.ThreeQuartersGap,
        borderRadius: Radii.ItemRadius,
        borderWidth: 1,
        borderColor: Colors.ItemBorder,
        marginBottom: Spacing.Gap
    }
})