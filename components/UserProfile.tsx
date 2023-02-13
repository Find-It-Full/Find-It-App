import * as React from 'react'
import { View, Text } from 'react-native'
import { Colors } from '../ui-base/colors'
import { TextStyles } from '../ui-base/text'

export default function UserProfile() {
    return (
        <View style={{ justifyContent: 'center', alignItems: 'stretch', flexDirection: 'row' }}>
            <View style={{ width: 86, height: 86, backgroundColor: Colors.ButtonColor, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={TextStyles.h1}>TU</Text>
            </View>
        </View>
    )
}