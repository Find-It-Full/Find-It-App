import React from 'react'
import { TextInput, StyleSheet, TextInputProps, TextStyle, StyleProp } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Radii } from '../ui-base/radii'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'

export default function TextField(props: { onChangeText: (text: string) => void, value: string, placeholder?: string, inputProps?: TextInputProps, style?: StyleProp<TextStyle>, children?: React.ReactNode }) {
    return (
        <TextInput
            placeholder={props.placeholder}
            style={[TextStyles.p, styles.input, { marginBottom: Spacing.ThreeQuartersGap }, props.style]}
            value={props.value}
            onChangeText={props.onChangeText}
            {...props.inputProps}
        >
            {props.children}
        </TextInput>
    )
}

export  function SignInField(props: { onChangeText: (text: string) => void, value: string, inputType:string, placeholder?: string }) {

    return (
        <TextInput
            secureTextEntry={props.inputType == "password"}
            autoComplete ={props.inputType == "password"?"password":"email"}
            placeholder={props.placeholder}
            style={[TextStyles.h3, styles.input, { marginBottom: Spacing.BigGap }]}
            value={props.value}
            onChangeText={props.onChangeText}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: Colors.PanelColor,
        padding: Spacing.ThreeQuartersGap,
        paddingVertical: Spacing.Gap,
        borderRadius: Radii.ItemRadius,
        borderWidth: 1,
        borderColor: Colors.ItemBorder,
        marginBottom: Spacing.Gap
    }
})