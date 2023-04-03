import React from 'react'
import { Text } from 'react-native';
import { Item } from '../../backend/databaseTypes';
import { ItemIconContainer } from '../../ui-base/containers';
import { Spacer, VerticallyCenteringGroupedRow } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';

export default function SmallItemProfile({ icon, name }: Item) {
    return (
        <VerticallyCenteringGroupedRow style={{ justifyContent: 'flex-start' }}>
            <ItemIconContainer>
                <Text style={TextStyles.h3}>{icon}</Text>
            </ItemIconContainer>
            <Spacer size={Spacing.Gap} />
            
        </VerticallyCenteringGroupedRow>
    )
}