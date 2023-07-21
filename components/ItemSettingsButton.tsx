import { NavigationContext } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { SafeAreaInsetsContext } from 'react-native-safe-area-context'
import { Colors } from '../ui-base/colors'
import { Radii } from '../ui-base/radii'
import { Spacing } from '../ui-base/spacing'
import PlatformIcon, { Icons } from './PlatformIcon'

export default function ItemSettingsButton(props: { onPress: () => void }) {

    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)
    const top = (safeAreaInsets?.top ?? 0)

    return (
        <TouchableOpacity
            style={[styles.itemSettingsButton, { top }]} 
            onPress={props.onPress}
        >
            <PlatformIcon icon={Icons.COG} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    itemSettingsButton: {
        backgroundColor: Colors.Black,
        height: 38, 
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: Spacing.ScreenPadding,
        borderRadius: Radii.ItemRadius,
        zIndex: 10000
    }
})