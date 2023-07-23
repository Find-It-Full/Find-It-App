import React from 'react'
import { View } from 'react-native'
import { Colors } from '../ui-base/colors'
import { ActionCard } from '../ui-base/containers'
import { Spacer } from '../ui-base/layouts'
import { Spacing } from '../ui-base/spacing'

export default function ActionButtonList(props: { children?: React.ReactNode[] | React.ReactNode }) {

    const numberOfChildren = props.children ? (props.children['length']) ? props.children['length'] : 1 : 0

    return (
        <ActionCard style={{ alignItems: 'stretch' }}>
            {
                props.children ?
                    props.children['map'] ?
                        props.children['map']((child: React.ReactNode, index: number) => (
                            <View key={index}>
                                {child}
                                {
                                    index < numberOfChildren - 1 ?
                                        <ActionButtonListInterstitial /> :
                                        null
                                }
                            </View>
                        )) :
                        props.children :
                    undefined
            }
        </ActionCard>
    )
}

function ActionButtonListInterstitial() {
    return (
        <View style={{ height: 1, backgroundColor: Colors.DarkAccentColor, opacity: 0.1, marginHorizontal: Spacing.ThreeQuartersGap }}/>
    )
}