import React from 'react'
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'
import Icon from 'react-native-vector-icons/FontAwesome'
export default function IconButton(props: { icon: Icon, onPress: () => void, disabled?: boolean, isInColumn?: boolean, isLoading?: boolean }) {

    const disabled = props.disabled || props.isLoading

    return (
        <TouchableOpacity 
            style={[styles.buttonStyle, { opacity: disabled ? Colors.DisabledOpacity : 1 }]}
            onPress={props.onPress}
            disabled={disabled}
        >
            {
                props.isLoading ?
                    <ActivityIndicator size={'small'} color={Colors.White} /> :
                    <Text style={TextStyles.h4}>{props.icon}</Text>
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})