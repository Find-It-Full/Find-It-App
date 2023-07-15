import React, { memo, useContext, useEffect, useMemo, useState } from 'react'
import { FlatList, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../ui-base/colors'
import { TextStyles } from '../ui-base/text'
import { Spacing } from '../ui-base/spacing'
import { VerticallyCenteringRow } from '../ui-base/layouts'
import IconButton from '../components/IconButton'
import { EmojiManagerContext } from '../backend/EmojiManager'
import { Panel } from '../ui-base/containers'
import { Radii } from '../ui-base/radii'
import EmojiPicker from 'rn-emoji-keyboard'
import Icon from 'react-native-vector-icons/Ionicons'

import { SelectList } from 'react-native-dropdown-select-list'

export default function DropDown(props: { currentValue: string, onSelect: (value: string) => void }) {
        const data = [
                {key:'1', value:'Always'},
                {key:'2', value:'When Missing'},
                {key:'3', value:'Never'}
                
            ]
          
    const [showOptions, setShowOptions] = useState(false)
    const [selection, setSelection] = useState(props.currentValue)

    const onSelect = (value: string) => {
        setSelection(value)
        props.onSelect(value)
    }

    useEffect(() => {
        if (showOptions) {
            Keyboard.dismiss()
        }
    }, [showOptions])

    

    return (
        <View style={{
            backgroundColor: Colors.ButtonColor,
            paddingVertical: Spacing.ThreeQuartersGap,
            paddingBottom: 0,
            borderRadius: Radii.ItemRadius,
            borderWidth: 1,
            borderColor: Colors.ItemBorder,
            marginBottom: Spacing.Gap
        }}>
            <TouchableOpacity 
                activeOpacity={1} 
                onPress={() => setShowOptions( ! showOptions)}
                style={{ marginBottom: showOptions ? 0 : Spacing.ThreeQuartersGap }}
            >
                <VerticallyCenteringRow 
                    style={{ marginHorizontal: Spacing.ThreeQuartersGap }}
                    
                >
                    
                <Text style={[TextStyles.emoji]}>{selection}</Text>
                            
                    
                    <Text style={[TextStyles.h3]}>{ showOptions ? <Icon style = {[TextStyles.h3]} name='ios-chevron-up'/> : <Icon style = {[TextStyles.h3]} name='ios-chevron-down'/> }</Text>
                </VerticallyCenteringRow>
            </TouchableOpacity>
            <SelectList 
        setSelected={(val) => setSelection(val)} 
        data={data} 
        save="value"
    />

        </View>
    )
}



