import React from 'react'
import { Text } from 'react-native';
import { Item } from '../../backend/databaseTypes';
import { ItemIconContainer } from '../../ui-base/containers';
import { Spacer, VerticallyCenteringGroupedRow } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';
import { Shadows } from '../../ui-base/shadows';

export default function ItemProfile({ icon, name }: Item) {
    return (
        <VerticallyCenteringGroupedRow style={{ justifyContent: 'flex-start' }}>
            <ItemIconContainer>
                <Text style={TextStyles.smallEmoji}>{icon}</Text>
            </ItemIconContainer>
            <Spacer size={Spacing.Gap} />
            <Text style={TextStyles.h3}>{name}</Text>
        </VerticallyCenteringGroupedRow>
    )
}