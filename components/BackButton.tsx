import { NavigationContext } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { Colors } from '../ui-base/colors'
import { Radii } from '../ui-base/radii'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'

export default function BackButton() {

    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)
    const navigation = React.useContext(NavigationContext)

    return (
        <TouchableOpacity style={[styles.backButton, { top: (safeAreaInsets?.top ?? 0) }]} onPress={navigation?.goBack}>
            <Text style={TextStyles.h3}>􀆉</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    backButton: {
        backgroundColor: Colors.Black,
        height: 38, 
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: Spacing.ScreenPadding,
        borderRadius: Radii.ItemRadius
    }
})