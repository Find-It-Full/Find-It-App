import React from 'react'
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'
import { VerticallyCenteringRow } from '../ui-base/layouts'
import { ActionButton } from '../ui-base/containers'
import PlatformIcon from './PlatformIcon'

export default function SmallActionButton(props: { label: string, icon: string, onPress: () => void, disabled?: boolean, isInColumn?: boolean, isLoading?: boolean }) {

    const disabled = props.disabled || props.isLoading

    return (
        <TouchableOpacity
            disabled={disabled}
            style={{ paddingVertical: 10, paddingLeft: 20 }}
        >
            {
                props.isLoading ?
                    <ActivityIndicator size={'small'} color={Colors.Black} /> :
                    <VerticallyCenteringRow style={{ gap: Spacing.HalfGap }}>
                        <PlatformIcon icon={props.icon} />
                        <Text style={TextStyles.h5}>{props.label}</Text>
                    </VerticallyCenteringRow>
            }
        </TouchableOpacity>
    )
}