import React from 'react';
import { Linking, TouchableOpacity, Text } from "react-native";
import { Spacing } from '../ui-base/spacing';
import { TextStyles } from '../ui-base/text';

export default function SmallLink(props: { text: string, link: string }) {
    return (
        <TouchableOpacity onPress={() => {
            Linking.openURL(props.link)
        }}>
            <Text style={[TextStyles.p2, { fontSize: 12, textDecorationLine: 'underline' }]}>{props.text}</Text>
        </TouchableOpacity>
    )
}