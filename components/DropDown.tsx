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

            const keys = {'Always':{key:"1",value:"Always"}, "When Missing":{key:"2",value:"When Missing"}, "Never":{key:"3",value:"Never"}}
                
            const keysBack = {"1":"Always", "2":"When Missing", "3":"Never"}
          
    const [showOptions, setShowOptions] = useState(false)
    const [selection, setSelection] = useState(props.currentValue)

    const onSelect = (value: string) => {
        value = keysBack[value]
        setSelection(value)
        props.onSelect(value)
    }

    useEffect(() => {
        if (showOptions) {
            Keyboard.dismiss()
        }
    }, [showOptions])

    

    return (
       
            <SelectList 
            defaultOption = {props.currentValue?keys[props.currentValue]:{key:1,value:"always"}}
        setSelected={(val) => onSelect(val)} 
        data={data} 
        save="key"
    />


        // </View>
    )
}



