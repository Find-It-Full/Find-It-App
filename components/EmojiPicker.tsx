import React, { memo, useContext, useEffect, useMemo, useState } from 'react'
import { FlatList, Keyboard, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from '../ui-base/colors'
import { TextStyles } from '../ui-base/text'
import { Spacing } from '../ui-base/spacing'
import { VerticallyCenteringRow } from '../ui-base/layouts'
import IconButton from './IconButton'
import { EmojiManagerContext } from '../backend/EmojiManager'
import { Panel } from '../ui-base/containers'
import { Radii } from '../ui-base/radii'
import Icon from 'react-native-vector-icons/Ionicons'
import PlatformIcon, { Icons } from './PlatformIcon'
interface IEmojiData {
    categories: { id: string, emojis: string[] }[]
    emojis: {
        [key: string]: {
            id: string
            name: string
            keywords: string[]
            skins: {
                unified: string
                native: string
                x: number
                y: number
            }[]
            version: number
        }
    }
    aliases: {
        [key: string]: string
    }
    sheet: {
        cols: number
        rows: number
    }
}

export default function EmojiPicker(props: { currentValue: string, onSelect: (emoji: string) => void }) {

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

    return (
        <View style={{
            backgroundColor: Colors.ButtonColor,
            paddingVertical: Spacing.Gap,
            paddingBottom: 0,
            borderRadius: Radii.ItemRadius,
            borderWidth: 1,
            borderColor: Colors.ItemBorder,
            marginBottom: Spacing.Gap
        }}>
            <TouchableOpacity 
                activeOpacity={1} 
                onPress={() => setShowEmojis( ! showEmojis)}
                style={{ marginBottom: showEmojis ? 0 : Spacing.Gap }}
            >
                <VerticallyCenteringRow 
                    style={{ marginHorizontal: Spacing.ThreeQuartersGap }}
                    
                >
                    {
                        currentEmoji ?
                            <Text style={[TextStyles.smallEmoji]}>{currentEmoji}</Text>
                            :
                            <Text style={[TextStyles.p, { color: 'rgba(0.24, 0.24, 0.26, 0.3)' }]}>Icon</Text>
                    }
                    <Text style={[TextStyles.h3]}>{ showEmojis ? <PlatformIcon icon={Icons.UP} /> : <PlatformIcon icon={Icons.DOWN} /> }</Text>
                </VerticallyCenteringRow>
            </TouchableOpacity>
            {
                showEmojis ? 
                    <MemoizedEmojiGrid onSelect={onSelect} />
                    :
                    null
            }
        </View>
    )
}

function EmojiGrid(props: { onSelect: (emoji: string) => void }) {
    const { emojis, getEmojiAtScaledLocation, getCategorySize } = useContext(EmojiManagerContext)

    const lineHeight = 32
    const letterSpacing = 8

    const handleEmojiSelection = (category: number, localX: number, localY: number) => {
        const width = (getCategorySize(category)) * ((TextStyles.emoji as any).fontSize + letterSpacing + 3)
        const height = lineHeight * 5

        const emoji = getEmojiAtScaledLocation(category, (localY / height), localX / width)

        if (emoji) {
            props.onSelect(emoji)
        }
    }

    return (
        <>
            <View style={{ marginLeft: Spacing.ThreeQuartersGap, marginRight: Spacing.ThreeQuartersGap, marginVertical: Spacing.HalfGap, borderTopWidth: 1, borderTopColor: Colors.ItemBorder }} />
            <ScrollView
                horizontal={true}
                contentContainerStyle={{ paddingLeft: Spacing.ThreeQuartersGap }}
                style={{ marginBottom: Spacing.HalfGap }}
            >
                {
                    emojis.map(([categoryName, emojis], index) => 
                        <View key={index} style={{ marginRight: Spacing.HalfGap }}>
                            <TouchableOpacity
                                onPress={(event) => {
                                    handleEmojiSelection(
                                    index,
                                    event.nativeEvent.locationX,
                                    event.nativeEvent.locationY
                                    )
                                }}
                                activeOpacity={1}
                            >
                                <Text style={[TextStyles.emoji, { lineHeight, letterSpacing }]}>
                                    {emojis}
                                </Text>
                            </TouchableOpacity>
                            <Text style={[TextStyles.h5, { opacity: Colors.DisabledOpacity / 2 }]}>{categoryName}</Text>
                        </View>
                    )
                }
            </ScrollView>
        </>
    )
}

const MemoizedEmojiGrid = memo(EmojiGrid, (prev, next) => true)