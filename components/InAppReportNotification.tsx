import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, LayoutAnimation, Animated } from 'react-native';
import { InAppNotificationPayload, setDidNotify } from '../reducers/reports';
import { HomeProps } from '../screens/Navigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Colors } from '../ui-base/colors';
import { Panel } from '../ui-base/containers';
import { Spacing } from '../ui-base/spacing';
import { TextStyles } from '../ui-base/text';
import InAppNotification from './InAppNotification';

export default function InAppReportNotification(props: { payload: InAppNotificationPayload }) {

    const item = useAppSelector(state => state.items.items[props.payload.itemID])
    const navigation = useNavigation<HomeProps['navigation']>()
    const dispatch = useAppDispatch()
    const [shouldHide, setShouldHide] = useState(false)

    const hideAndNavigate = () => {
        setShouldHide(true)
        dispatch(setDidNotify(props.payload.reportID))
        navigation.navigate('ItemDetails', { itemID: item.itemID })
    }

    const onAutoHide = () => {
        dispatch(setDidNotify(props.payload.reportID))
    }

    return (
        <InAppNotification shouldHide={shouldHide} onHide={onAutoHide}>
            <TouchableOpacity activeOpacity={1} onPress={hideAndNavigate}>
                <Panel style={{ padding: Spacing.ThreeQuartersGap, shadowColor: Colors.White, shadowOpacity: 0.7, shadowOffset: { width: 0, height: 3 } }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={TextStyles.h4}>{`􀋚   ${item.name} was spotted`}</Text>
                    </View>
                </Panel>
            </TouchableOpacity>
        </InAppNotification>
    )
}