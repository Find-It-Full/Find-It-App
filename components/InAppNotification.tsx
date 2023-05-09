import React, { useEffect, useState } from 'react'
import { View, Animated } from 'react-native';
import { Spacing } from '../ui-base/spacing';

export default function InAppNotification(props: { children: React.ReactNode, shouldHide?: boolean, onHide?: () => void }) {

    const [animation] = useState(new Animated.Value(0))

    const hide = () => {
        return new Promise<void>((resolve, _) => {
            Animated.timing(animation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start(() => resolve())
        })
    }

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start()
    }, [])

    const translateY = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 0],
    })

    useEffect(() => {
        setTimeout(() => {
            hide().then(props.onHide)
        }, 2000)
    }, [])

    useEffect(() => {
        if (props.shouldHide) {
            hide().then(props.onHide)
        }
    }, [props.shouldHide])

    return (
        <Animated.View style={{ transform: [{ translateY }] }}>
            <View style={{ paddingHorizontal: Spacing.HalfGap, paddingBottom: Spacing.QuarterGap }}>
                {
                    props.children
                }
            </View>
        </Animated.View>
    )
}