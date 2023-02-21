import React from 'react'
import { View, Text } from 'react-native';
import { Item } from '../../backend/databaseTypes';
import { Colors } from '../../ui-base/colors';
import { ItemIconContainer } from '../../ui-base/containers';
import { Spacer, VerticallyCenteringGroupedRow } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';

export default function ItemProfile({ icon, name }: Item) {
    return (
        <VerticallyCenteringGroupedRow style={{ justifyContent: 'flex-start' }}>
            <ItemIconContainer>
                <Text style={TextStyles.h3}>{icon}</Text>
            </ItemIconContainer>
            <Spacer size={Spacing.Gap} />
            <Text style={TextStyles.h2}>{name}</Text>
        </VerticallyCenteringGroupedRow>
    )
}