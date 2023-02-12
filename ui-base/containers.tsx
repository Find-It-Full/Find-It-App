import * as React from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native" 
import { SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "./colors"
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

export function ActionCard(props: { children?: React.ReactNode, style?: ViewStyle }) {
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

export function ActionButton(props: { children?: React.ReactNode, style?: ViewStyle, onPress?: () => void }) {
    return (
        <TouchableOpacity 
            style={{ backgroundColor: Colors.ButtonColor, borderWidth: 1, borderColor: Colors.ItemBorder, borderRadius: Radii.ItemRadius, justifyContent: 'center', alignItems: 'center', ...props.style }}
            onPress={props.onPress}
        >
            {props.children}
        </TouchableOpacity>
    )
}