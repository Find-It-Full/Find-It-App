import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, LayoutAnimation, Animated } from 'react-native';
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

    const [animation] = useState(new Animated.Value(0))

    const hide = () => {
        return new Promise<void>((resolve, _) => {
            Animated.timing(animation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => resolve())
        })
    }

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }, [])

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 0],
    })

    useEffect(() => {
        setTimeout(() => {
            hide().then(() => dispatch(setDidNotify(props.payload.reportID)))
        }, 3000)
    }, [])

    const hideAndNavigate = () => {
        hide()
        dispatch(setDidNotify(props.payload.reportID))
        navigation.navigate('ItemDetails', { item: item })
    }

    return (
        <Animated.View style={{ transform: [{ translateY }] }}>
            <View style={{ paddingHorizontal: Spacing.HalfGap, paddingBottom: Spacing.QuarterGap }}>
                <TouchableOpacity activeOpacity={1} onPress={hideAndNavigate}>
                    <Panel style={{ padding: Spacing.ThreeQuartersGap, shadowColor: Colors.Black, shadowOpacity: 0.7, shadowOffset: { width: 0, height: 3 } }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={TextStyles.h4}>{`􀋚   ${item.name} was spotted`}</Text>
                        </View>
                    </Panel>
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}