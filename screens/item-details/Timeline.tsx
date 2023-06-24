import React from 'react'
import { View, Text } from 'react-native'
import { TextStyles } from '../../ui-base/text'
import Icon from 'react-native-vector-icons/FontAwesome'

export default function Timeline() {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 1, height: 5 }}>
            <Text style={[TextStyles.i3, { position: 'absolute' }]}><Icon style={[TextStyles.i3, { position: 'absolute' }]} name="chevron-left"/></Text>
            <View style={{ flex: 1, marginHorizontal: 3, height: 2, borderRadius: 0, backgroundColor: 'black' }} />
            <Text style={[TextStyles.i3, { position: 'absolute', right: 0 }]}> <Icon style={[TextStyles.i3, { position: 'absolute', right: 0 }]}name="chevron-right"/></Text>
           
        </View>
    )
}