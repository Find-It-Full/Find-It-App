import React from "react"
import { Platform, TouchableOpacity } from "react-native"
import analytics from '@react-native-firebase/analytics';
import { useNavigation } from "@react-navigation/native";
import { HomeProps, RootStackParamList } from "../screens/Navigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Spacing } from "../ui-base/spacing";
import { Text } from "react-native";
import { TextStyles } from "../ui-base/text";
import Icon from 'react-native-vector-icons/Ionicons'
import PlatformIcon, { Icons } from "./PlatformIcon";

export default function SettingsButton(props: { }) {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "Home", undefined>>()

    return (
        <TouchableOpacity
            onPress={ async () => { 
                console.log("analytics --- open settings")
                await analytics().logEvent('open_settings', {})
                navigation.navigate('AccountSettings') 
            }}
            style={{ padding: Spacing.HalfGap, marginRight: -Spacing.HalfGap }}
        >
            <PlatformIcon icon={Icons.COG} />
        </TouchableOpacity>
    )
}