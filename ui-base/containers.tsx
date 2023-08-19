import React, { useContext, useEffect, useRef, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View, ViewStyle } from "react-native" 
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context"
import { Colors } from "./colors"
import { Spacer } from "./layouts"
import { Radii } from "./radii"
import { Spacing } from "./spacing"
import { Shadows } from './shadows'
import { TextStyles } from './text'

export function ScreenBase(props: { children?: React.ReactNode, style?: ViewStyle }) {

    const safeAreaInsets = useContext(SafeAreaInsetsContext)

    return (
        <SafeAreaView 
            style={{ 
                paddingHorizontal: Spacing.ScreenPadding, 
                paddingTop: Spacing.ScreenPadding,
                paddingBottom: safeAreaInsets?.bottom ? 0 : Spacing.ScreenPadding,
                backgroundColor: Colors.Background, 
                flex: 1,
                ...props.style 
            }}
        >
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

export function FormScreenBase(props: { children?: React.ReactNode, externalChildren?: React.ReactNode, buttons?: React.ReactNode, style?: ViewStyle }) {

    const safeAreaInsets = useContext(SafeAreaInsetsContext)
    const viewRef = useRef<KeyboardAvoidingView>(null)

    return (
        <View 
            style={{ flex: 1, backgroundColor: Colors.Background }}
        >
            {props.externalChildren}
             
            <KeyboardAvoidingView 
                behavior= { Platform.OS ==="ios"?'padding':undefined}
                style=
               { 
                { 
                    padding: Spacing.ScreenPadding,
                    marginTop: (safeAreaInsets?.top) ? safeAreaInsets.top : Spacing.ScreenPadding,
                    marginBottom: (safeAreaInsets?.bottom) ? safeAreaInsets.bottom : Spacing.ScreenPadding,
                    flex: 1, 
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    ...props.style 
                }}
                key={"123"}
                
                ref={viewRef}
            >
            
            
                <ScrollView keyboardDismissMode='interactive' contentContainerStyle={{ flex: 1 }}>
                    {props.children}
                </ScrollView>
                <Spacer size={Spacing.HalfGap} />
                {props.buttons}
                <Spacer size={Spacing.HalfGap} />
            </KeyboardAvoidingView>
            
        </View>
    )
}

export function PopoverFormScreenbase(props: { children?: React.ReactNode, externalChildren?: React.ReactNode, buttons?: React.ReactNode, style?: ViewStyle }) {

    const safeAreaInsets = useContext(SafeAreaInsetsContext)
    const viewRef = useRef<KeyboardAvoidingView>(null)
    const [isShowingKeyboard, setIsShowingKeyboard] = useState(false)

    const onKeyboardShow = () => {
        setIsShowingKeyboard(true)
    }

    const onKeyboardHide = () => {
        setIsShowingKeyboard(false)
    }

    useEffect(() => {
        if (Platform.OS === 'ios') {
            const keyboardWillShow = Keyboard.addListener('keyboardWillShow', onKeyboardShow)
            const keyboardWillHide = Keyboard.addListener('keyboardWillHide', onKeyboardHide)
            return () => {
                keyboardWillShow.remove()
                keyboardWillHide.remove()
            }
        } else {
            const keyboardDidShow = Keyboard.addListener('keyboardDidShow', onKeyboardShow)
            const keyboardDidHide = Keyboard.addListener('keyboardDidHide', onKeyboardHide)
            return () => {
                keyboardDidShow.remove()
                keyboardDidHide.remove()
            }
        }
    })

    return (
        <View 
            style={{ flex: 1, backgroundColor: Colors.Background }}
        >
            {props.externalChildren}
            <KeyboardAvoidingView 
                behavior='height' 
                style={{ 
                    padding: Spacing.ScreenPadding,
                    paddingBottom: 0,
                    marginTop: Spacing.BigGap * 2.5,
                    marginBottom: (safeAreaInsets?.bottom) ? safeAreaInsets.bottom : Spacing.ScreenPadding, 
                    flex: 1, 
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    ...props.style 
                }}
                ref={viewRef}
            >
                <ScrollView contentContainerStyle={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        {props.children}
                    </TouchableWithoutFeedback>
                </ScrollView>
                {props.buttons}
                {
                    isShowingKeyboard ?
                        <Spacer size={Spacing.BigGap * 2 + Spacing.Gap + Spacing.HalfGap} />
                        :
                        null
                }
            </KeyboardAvoidingView>
        </View>
    )
}

export function ModalFormScreenBase(props: { children?: React.ReactNode, style?: ViewStyle, closeModal: () => void }) {

    const superViewRef = React.useRef<View>(null)
    const safeAreaInsets = useContext(SafeAreaInsetsContext)

    return (
        <View 
            style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: Colors.ModalBackground }}
            ref={superViewRef} 
            onTouchEnd={(event) => {
                if (event.target == superViewRef.current) {
                    props.closeModal()
                }
            }}
        >
            <KeyboardAvoidingView behavior='padding' style={{ 
                paddingHorizontal: Spacing.ScreenPadding, 
                backgroundColor: Colors.Background, 
                flex: 0,
                marginBottom: 0,
                bottom: 0, 
                paddingTop: Spacing.BigGap,
                justifyContent: 'center',
                alignItems: 'stretch',
                borderTopRightRadius: Radii.ModalRadius,
                borderTopLeftRadius: Radii.ModalRadius,
                ...props.style 
            }}
            >
                <View style={{ marginBottom: !!(safeAreaInsets?.bottom) ? safeAreaInsets.bottom : Spacing.ScreenPadding }}>
                    {props.children}
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

export function ActionCard(props: { children?: React.ReactNode[] | React.ReactNode, style?: ViewStyle }) {
    return (
        <View style={{ backgroundColor: Colors.PanelColor, borderWidth: 1, borderColor: Colors.ItemBorder, borderRadius: Radii.ItemRadius, ...Shadows.ActionShadow, ...props.style }}>
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
            style={{ backgroundColor: Colors.PanelColor, borderWidth: 1, borderColor: Colors.ItemBorder, borderRadius: Radii.ItemRadius, justifyContent: 'center', alignItems: 'center', opacity: props.disabled ? Colors.DisabledOpacity : 1, ...props.style }}
            onPress={props.onPress}
            disabled={!!props.disabled}
        >
            {props.children}
        </TouchableOpacity>
    )
}

export function ItemIconContainer(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <View style={{ height: 38, width: 22, borderRadius: 40, justifyContent: 'center', alignItems: 'center', ...props.style }}>
            {props.children}
        </View>
    )
}

export function MapItemIconContainer(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <View style={{ ...Shadows.SmallShadow, flexDirection: 'row', padding: Spacing.HalfGap, backgroundColor: Colors.PanelColor, borderRadius: 40, justifyContent: 'center', alignItems: 'center', ...props.style, aspectRatio: 1 }}>
            {props.children}
        </View>
    )
}

export function SmallItemIconContainer(props: { children?: React.ReactNode, style?: ViewStyle }) {
    return (
        <View style={{ height: 32, width: 32, backgroundColor: Colors.ButtonColor, borderRadius: 40, justifyContent: 'center', alignItems: 'center', ...props.style }}>
            {props.children}
        </View>
    )
}   