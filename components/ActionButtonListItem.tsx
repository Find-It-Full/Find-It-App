import React from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import { Colors } from '../ui-base/colors'
import { Spacer, VerticallyCenteringGroupedRow } from '../ui-base/layouts'
import { Spacing } from '../ui-base/spacing'
import { TextStyles } from '../ui-base/text'
import Icon from 'react-native-vector-icons/FontAwesome'

export default function ActionButtonListItem(props: { icon: Icon, label: string, onPress: () => void }) {
    return (
        <TouchableOpacity onPress={props.onPress} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: Spacing.ThreeQuartersGap }}>
            <VerticallyCenteringGroupedRow style={{ padding: Spacing.ThreeQuartersGap, justifyContent: 'flex-start' }}>
                <View style={{ width: 32, height: 32, backgroundColor: Colors.ButtonColor, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={TextStyles.b1}>{props.icon}</Text>
                </View>
                <Spacer size={Spacing.ThreeQuartersGap} />
                <Text style={TextStyles.h4}>{props.label}</Text>
            </VerticallyCenteringGroupedRow>
            <Text style={TextStyles.b1}><Icon style={TextStyles.h3}name="chevron-right"/></Text>
        </TouchableOpacity>
    )
}