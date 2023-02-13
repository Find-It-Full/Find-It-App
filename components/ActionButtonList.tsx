import * as React from 'react'
import { View } from 'react-native'
import { Colors } from '../ui-base/colors'
import { ActionCard } from '../ui-base/containers'
import { Spacer } from '../ui-base/layouts'
import { Spacing } from '../ui-base/spacing'

export default function ActionButtonList(props: { children?: React.ReactNode[] }) {

    const numberOfChildren = props.children ? props.children.length : 0

    return (
        <ActionCard style={{ alignItems: 'stretch' }}>
            {
                props.children != null ?
                    props.children.map((child, index) => (
                        <View key={index}>
                            {child}
                            {
                                index < numberOfChildren - 1 ?
                                    <ActionButtonListInterstitial /> :
                                    null
                            }
                        </View>
                    )) :
                    undefined
            }
        </ActionCard>
    )
}

function ActionButtonListInterstitial() {
    return (
        <View style={{ height: 1, backgroundColor: Colors.ItemBorder }}/>
    )
}