import React from 'react'
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Spacer, VerticallyCenteringGroupedRow } from '../ui-base/layouts'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'
import Icon from 'react-native-vector-icons/Ionicons'
import PlatformIcon, { Icons } from './PlatformIcon'

export default function ActionButtonListItem(props: { icon: Icon, label: string, onPress: () => void, isLoading?:boolean }) {
    return (
        <TouchableOpacity onPress={props.onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: Spacing.ThreeQuartersGap }}>
            <VerticallyCenteringGroupedRow style={{ padding: Spacing.Gap, justifyContent: 'flex-start' }}>
                <View style={{ width: 32, height: 32, backgroundColor: Colors.PanelColor, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                { props.isLoading ? 
                <ActivityIndicator size={'small'} color={Colors.White} /> :
                <Text style={TextStyles.b1}>{props.icon}</Text>}
                </View>
                <Spacer size={Spacing.ThreeQuartersGap} />
                <Text style={TextStyles.h4}>{props.label}</Text>
            </VerticallyCenteringGroupedRow>
            <PlatformIcon icon={Icons.FORWARD} />
        </TouchableOpacity>
    )
}