import React from 'react'
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'
import { VerticallyCenteringRow } from '../ui-base/layouts'
import { ActionButton } from '../ui-base/containers'
import Icon from 'react-native-vector-icons/Ionicons'
import { Shadows } from '../ui-base/shadows'
export default function BigPrimaryActionButton(props: { label: string, icon?: Icon, onPress: () => void, disabled?: boolean, isInColumn?: boolean, isLoading?: boolean, hideShadow?: boolean }) {

    const disabled = props.disabled || props.isLoading

    return (
        <ActionButton disabled={disabled} onPress={props.onPress} style={{
            alignSelf: 'stretch',
            flex: 0,
            paddingVertical: Spacing.Gap,
            ...(props.hideShadow ? { } : Shadows.BigActionShadow)
        }}>
            {
                props.isLoading ?
                    <ActivityIndicator size={'small'} color={Colors.Black} /> :
                    <VerticallyCenteringRow style={{ gap: Spacing.HalfGap, width: '100%', justifyContent: 'center' }}>
                        <Text style={TextStyles.h3}>{props.icon}</Text>
                        <Text style={TextStyles.h4}>{props.label}</Text>
                    </VerticallyCenteringRow>
            }
        </ActionButton>
    )
}