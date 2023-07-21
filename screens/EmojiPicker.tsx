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
import EmojiPicker, { EmojiKeyboard } from 'rn-emoji-keyboard'
import Icon from 'react-native-vector-icons/Ionicons'
export default function EmojiPickerManager(props: { currentValue: string, onSelect: (emoji: string) => void }) {

    const [showEmojis, setShowEmojis] = useState(false)
    const [currentEmoji, setCurrentEmoji] = useState(props.currentValue)

    const onSelect = (emoji: string) => {
        setCurrentEmoji(emoji)
        props.onSelect(emoji)
    }

    useEffect(() => {
        if (showEmojis) {
            Keyboard.dismiss()
        }
    }, [showEmojis])

    useEffect(() => {
        const subscription = Keyboard.addListener('keyboardWillShow', () => {
            setShowEmojis(false)
        })

        return () => subscription.remove()
    }, [])

    return (<>
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
                onPress={() => setShowEmojis( ! showEmojis)}
                style={{ marginBottom: showEmojis ? 0 : Spacing.ThreeQuartersGap }}
            >
                <VerticallyCenteringRow 
                    style={{ marginHorizontal: Spacing.ThreeQuartersGap }}
                    
                >
                    {
                        currentEmoji ?
                            <Text style={[TextStyles.emoji]}>{currentEmoji}</Text>
                            :
                            <Text style={[TextStyles.h3, { color: 'rgba(0.24, 0.24, 0.26, 0.3)' }]}>Icon</Text>
                    }
                    <Text style={[TextStyles.h3]}>{ showEmojis ? <Icon style = {[TextStyles.h3]} name='ios-chevron-up'/> : <Icon style = {[TextStyles.h3]} name='ios-chevron-down'/> }</Text>
                </VerticallyCenteringRow>
            </TouchableOpacity>
            

        </View>

        {showEmojis?

            <EmojiKeyboard defaultHeight = {300} expandable={false} onEmojiSelected={(emojiData)=>{
                
                onSelect(emojiData.emoji)
                
                setShowEmojis(false)}} />:null}
            </>
    )
}



