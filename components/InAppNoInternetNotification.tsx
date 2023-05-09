import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppDispatch } from '../store/hooks';
import { Colors } from '../ui-base/colors';
import { Panel } from '../ui-base/containers';
import { Spacing } from '../ui-base/spacing';
import { TextStyles } from '../ui-base/text';
import InAppNotification from './InAppNotification';
import { resetNoInternetNotification } from '../reducers/items';

export default function InAppNoInternetNotification(props) {

    const [shouldHide, setShouldHide] = useState(false)
    const dispatch = useAppDispatch()

    const onHide = () => {
        dispatch(resetNoInternetNotification())
    }

    return (
        <InAppNotification shouldHide={shouldHide} onHide={onHide}>
            <TouchableOpacity activeOpacity={1} onPress={() => setShouldHide(true)}>
                <Panel style={{ 
                    backgroundColor: Colors.ButtonColor,
                    padding: Spacing.ThreeQuartersGap, 
                    shadowColor: Colors.Black, 
                    shadowOpacity: 0.7, 
                    shadowOffset: { width: 0, height: 3 } }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={TextStyles.h4}>{`Connection failed! Please try again`}</Text>
                    </View>
                </Panel>
            </TouchableOpacity>
        </InAppNotification>
    )
}