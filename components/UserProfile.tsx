import React from 'react'
import { View, Text } from 'react-native'
import { Colors } from '../ui-base/colors'
import { TextStyles } from '../ui-base/text'
import auth from '@react-native-firebase/auth'
import items from '../reducers/items'
import Icon from 'react-native-vector-icons/Ionicons'
import { ReactElement } from "react";
import { useAppSelector } from '../store/hooks'
export default function UserProfile() {
    const userData = useAppSelector(state => state.userData)
    const name = userData ? userData.firstName.substring(0,1) + userData.lastName.substring(0,1) : null
    let initials: string | null | React.ReactElement = null
    if (!name){
        initials = <Icon style={TextStyles.h1}name="ios-person"/>
    }
    else {
        initials = name
    }
    return (
        <View style={{ justifyContent: 'center', alignItems: 'stretch', flexDirection: 'row' }}>
            <View style={{ width: 86, height: 86, backgroundColor: Colors.PanelColor, borderRadius: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={TextStyles.h1}>{initials}</Text>
            </View>
        </View>
    )
}