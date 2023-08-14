import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { Colors } from "../ui-base/colors";
import { Spacing } from "../ui-base/spacing";
import React from "react";
import { TextStyles } from "../ui-base/text";
import PlatformIcon from "./PlatformIcon";

export default function PillButton(props: { label: string, icon: string, onPress: () => void, onDisabledPress?: () => void, disabled?: boolean }) {
    return (
        <TouchableOpacity 
            style={[styles.container, { opacity: props.disabled ? Colors.DisabledOpacity : 1 }]}
            onPress={() => {
                if (props.disabled && props.onDisabledPress) {
                    props.onDisabledPress()
                }
                else {
                    props.onPress()
                }
            }}
            disabled={props.disabled && !props.onDisabledPress}
        >
            <PlatformIcon icon={props.icon} style={TextStyles.h6} />
            <Text style={TextStyles.h6}>{props.label}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.Black,
        paddingHorizontal: Spacing.ThreeQuartersGap,
        paddingVertical: Spacing.HalfGap,
        borderRadius: 100,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.QuarterGap
    }
})