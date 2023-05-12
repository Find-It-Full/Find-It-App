import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { Colors } from '../ui-base/colors';
import { Panel } from '../ui-base/containers';
import { Spacing } from '../ui-base/spacing';
import { TextStyles } from '../ui-base/text';
import InAppNotification from './InAppNotification';
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit';

export enum InAppErrorNotificationType {
    NO_INTERNET = 'no-internet',
    MISC_ERROR = 'misc-error'
}

export default function InAppErrorNotification(props: { type: InAppErrorNotificationType, resetAction: () => void }) {

    const [shouldHide, setShouldHide] = useState(false)
    const dispatch = useAppDispatch()
    const message = props.type === InAppErrorNotificationType.NO_INTERNET ? `Connection failed! Please try again.` : `An error occurred! Please try again.`

    const onHide = () => {
        props.resetAction()
    }

    return (
        <InAppNotification shouldHide={shouldHide} onHide={onHide}>
            <TouchableOpacity activeOpacity={1} onPress={() => setShouldHide(true)}>
                <Panel style={{ 
                    backgroundColor: Colors.ButtonColor,
                    padding: Spacing.ThreeQuartersGap, 
                    shadowColor: Colors.White, 
                    shadowOpacity: 0.7, 
                    shadowOffset: { width: 0, height: 3 } }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={TextStyles.h4}>{message}</Text>
                    </View>
                </Panel>
            </TouchableOpacity>
        </InAppNotification>
    )
}