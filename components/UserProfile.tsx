import React from 'react'
import { View, Text } from 'react-native'
import { Colors } from '../ui-base/colors'
import { TextStyles } from '../ui-base/text'
import auth from '@react-native-firebase/auth'
import items from '../reducers/items'
import Icon from 'react-native-vector-icons/Ionicons'
import { ReactElement } from "react";
export default function UserProfile() {
    const user = auth().currentUser ?? { displayName: '_ _' }
    const name = user.displayName ?? '_ _'
    let initials: ReactElement | string = name.split(' ').map((str) => str[0]).reduce((prev, cur) => `${prev}${cur}`)
    if (initials == "__"){
        initials = <Icon style={TextStyles.h1}name="ios-person-outline"/>
    }
    return (
        <View style={{ justifyContent: 'center', alignItems: 'stretch', flexDirection: 'row' }}>
            <View style={{ width: 86, height: 86, backgroundColor: Colors.ButtonColor, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={TextStyles.h1}>{initials}</Text>
            </View>
        </View>
    )
}