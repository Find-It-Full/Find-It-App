import React from 'react'
import { StyleProp, View, ViewStyle } from "react-native"

export function VerticallyCenteringRow(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...props.style }}>
            {props.children}
        </View>
    )
}

export function VerticallyCenteringGroupedRow(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', ...props.style }}>
            {props.children}
        </View>
    )
}

export function Spacer(props: { size: number }) {
    return (
        <View style={{ width: props.size, height: props.size }} />
    )
}