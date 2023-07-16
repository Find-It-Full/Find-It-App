import React from 'react';
import { Platform, Text, TextStyle } from "react-native";
import { TextStyles } from "../ui-base/text";
import Icon from 'react-native-vector-icons/Ionicons';

const ios = Platform.OS === 'ios'

export namespace Icons {
    export const BACK = ios ? '􀯶' : 'chevron-back'
    export const FORWARD = ios ? '􀯻' : 'chevron-forward'
    export const LOG_OUT = ios ? '􀱍' : 'log-out'
    export const ACCOUNT_DETAILS = ios ? '􀈊' : 'pencil'
    export const TOS = ios ? '􀙤' : 'document'
    export const COG = ios ? '􀣌' : 'settings'
    export const ALERT = ios ? '􀇿' : 'alert-circle'
    export const MAP = ios ? '􀙋' : 'map'
    export const MORE = ios ? '􀍢' : 'menu'
    export const SEAL = ios ? '􀇻' : 'checkmark-circle'
    export const TRASH = ios ? '􀈒' : 'trash'
    export const LOCK = ios ? '􀎡' : 'lock-closed'
}

export default function PlatformIcon(props: { icon: string, style?: TextStyle }) {
    if (ios) {
        return (
            <Text style={[TextStyles.b1, props.style]}>{props.icon}</Text>
        )
    }
    else {
        return (
            <Icon style={[TextStyles.b0, props.style]} name={props.icon}/>
        )
    }
}