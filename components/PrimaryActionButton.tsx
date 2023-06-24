import React from 'react'
import { ActionButton } from '../ui-base/containers'
import { Text, StyleSheet, ActivityIndicator, StyleProp, TextStyle } from 'react-native'
import { TextStyles } from '../ui-base/text'
import { Spacing } from '../ui-base/spacing'
import { Colors } from '../ui-base/colors'
import Icon from 'react-native-vector-icons/FontAwesome'
interface PrimaryActionButtonProps {
    label: string
    icon: Icon
    onPress: () => void
    disabled?: boolean
    isLoading?: boolean
    textSyle?: StyleProp<TextStyle>
}

export default function PrimaryActionButton(props: PrimaryActionButtonProps) {
    return (
        <ActionButton 
            style={styles.buttonContainer}
            disabled={(props.disabled ?? false) || (props.isLoading ?? false)}
            onPress={props.onPress}
        >
            {
                props.isLoading ?
                    <ActivityIndicator size={'small'} color={Colors.TextColor} />
                    :
                    <>
                        <Text style={[TextStyles.h3, props.textSyle]}>{props.icon}</Text>
                        <Text style={[TextStyles.h4, props.textSyle, { marginTop: Spacing.QuarterGap }]}>{props.label}</Text>
                    </>
            }
        </ActionButton>
    )
}

const styles = StyleSheet.create({
    buttonContainer: { 
        paddingVertical: Spacing.HalfGap, 
        marginLeft: Spacing.Gap, 
        flex: 1,
        alignSelf: 'stretch'
    }
})