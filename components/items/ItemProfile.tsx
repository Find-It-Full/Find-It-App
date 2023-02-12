import * as React from 'react'
import { View, Text } from 'react-native';
import { Item } from '../../backend/databaseTypes';
import { Colors } from '../../ui-base/colors';
import { Spacer, VerticallyCenteringGroupedRow } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';

export default function ItemProfile({ icon, name }: Item) {
    return (
        <VerticallyCenteringGroupedRow style={{ justifyContent: 'flex-start' }}>
            <View style={{ height: 38, width: 38, backgroundColor: Colors.White, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={TextStyles.h3}>{icon}</Text>
            </View>
            <Spacer size={Spacing.Gap} />
            <Text style={TextStyles.h2}>{name}</Text>
        </VerticallyCenteringGroupedRow>
    )
}