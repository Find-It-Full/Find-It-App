import * as React from "react"
import { KeyboardAvoidingView, TouchableOpacity, View, ViewStyle } from "react-native" 
import { SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "./colors"
import { Spacer } from "./layouts"
import { Radii } from "./radii"
import { Spacing } from "./spacing"

export function ScreenBase(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <SafeAreaView style={{ padding: Spacing.ScreenPadding, backgroundColor: Colors.Background, flex: 1, ...props.style }}>
            {props.children}
        </SafeAreaView>
    )
}

export function ScreenBaseNoInsets(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <View style={{ padding: Spacing.ScreenPadding, backgroundColor: Colors.Background, flex: 1, ...props.style }}>
            {props.children}
        </View>
    )
}

export function FormScreenBase(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={64} style={{ 
            padding: Spacing.ScreenPadding, 
            backgroundColor: Colors.Background, 
            flex: 1, 
            justifyContent: 'center',
            alignItems: 'stretch',
            ...props.style 
        }}>
            {props.children}
        </KeyboardAvoidingView>
    )
}

export function ActionCard(props: { children?: React.ReactNode[], style?: ViewStyle }) {
    return (
        <View style={{ backgroundColor: Colors.PanelColor, borderWidth: 1, borderColor: Colors.ItemBorder, borderRadius: Radii.ItemRadius, ...props.style }}>
            {props.children}
        </View>
    )
}

export function Panel(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <View style={{ backgroundColor: Colors.PanelColor, borderWidth: 1, borderColor: Colors.PanelColor, borderRadius: Radii.ItemRadius, ...props.style }}>
            {props.children}
        </View>
    )
}

export function ActionButton(props: { children?: React.ReactNode, style?: ViewStyle, onPress?: () => void, disabled?: boolean }) {
    return (
        <TouchableOpacity 
            style={{ backgroundColor: Colors.ButtonColor, borderWidth: 1, borderColor: Colors.ItemBorder, borderRadius: Radii.ItemRadius, justifyContent: 'center', alignItems: 'center', opacity: props.disabled ? 0.6 : 1, ...props.style }}
            onPress={props.onPress}
            disabled={!!props.disabled}
        >
            {props.children}
        </TouchableOpacity>
    )
}

export function ItemIconContainer(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <View style={{ height: 38, width: 38, backgroundColor: Colors.ButtonColor, borderRadius: 40, justifyContent: 'center', alignItems: 'center', ...props.style }}>
            {props.children}
        </View>
    )
}