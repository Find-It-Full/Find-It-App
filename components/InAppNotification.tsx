import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import { InAppNotificationPayload, setDidNotify } from '../reducers/userData';
import { HomeProps } from '../screens/Navigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Colors } from '../ui-base/colors';
import { Panel } from '../ui-base/containers';
import { Spacing } from '../ui-base/spacing';
import { TextStyles } from '../ui-base/text';

export default function InAppNotification(props: { payload: InAppNotificationPayload }) {

    const item = useAppSelector(state => state.items.items[props.payload.itemID])
    const navigation = useNavigation<HomeProps['navigation']>()
    const dispatch = useAppDispatch()

    const toggle = () => {
        LayoutAnimation.configureNext({
            duration: 500,
            create: { type: 'easeOut', property: 'scaleY' },
            delete: { type: 'easeIn', property: 'scaleY' }
        })
    }

    useEffect(() => {
        toggle()
        setTimeout(() => {
            dispatch(setDidNotify(props.payload.reportID))
        }, 3000)
    }, [])

    const hideAndNavigate = () => {
        dispatch(setDidNotify(props.payload.reportID))
        navigation.navigate('ItemDetails', { item: item })
    }

    return (
        <View style={{ paddingHorizontal: Spacing.HalfGap, paddingBottom: Spacing.QuarterGap }}>
            <TouchableOpacity activeOpacity={1} onPress={hideAndNavigate}>
                <Panel style={{ padding: Spacing.ThreeQuartersGap, shadowColor: Colors.Black, shadowOpacity: 0.7, shadowOffset: { width: 0, height: 3 } }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={TextStyles.h4}>{`􀋚   ${item.name} was spotted`}</Text>
                    </View>
                </Panel>
            </TouchableOpacity>
        </View>
    )
}