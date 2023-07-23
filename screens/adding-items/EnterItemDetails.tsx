import React, { useState } from 'react'
import { EnterItemDetailsProps } from "./AddItemFlowContainer"
import { PopoverFormScreenbase } from "../../ui-base/containers"
import BackButton from '../../components/BackButton'
import { Spacing } from '../../ui-base/spacing'
import { View, Text } from 'react-native'
import BigButton from '../../components/BigButton'
import TextField from '../../components/TextField'
import { TextStyles } from '../../ui-base/text'
import EmojiPicker from '../../components/EmojiPicker'

export default function EnterItemDetails({ navigation, route }: EnterItemDetailsProps) {

    const tagID = route.params.tagID

    const [name, setName] = useState('')
    const [icon, setIcon] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const nameValid = name.length > 0
    const iconValid = icon.length > 0

    const onSubmit = async (name: string, icon: string) => {
        navigation.navigate('EnterItemNotifications',{name:name, icon:icon, tagID:tagID})
    }

    const buttons = (
        <BigButton 
            label={'Next'} 
            disabled={ ! nameValid || ! iconValid} 
            isLoading={isSubmitting}
            onPress={ async () => {
                setIsSubmitting(true)
                await onSubmit(name, icon)
                setIsSubmitting(false)
            }}
            isInColumn
        />
    )

    return (
        <PopoverFormScreenbase externalChildren={<BackButton top={Spacing.Gap} />} buttons={buttons}>
            <View style={{ flex: 1 }}>
                <Text style={[TextStyles.h2, { marginBottom: Spacing.BigGap, marginTop: 0 }]}>Create Your Item</Text>
                <Text style={[TextStyles.p, { marginBottom: Spacing.Gap }]}>What sort of item are you adding?</Text>
                <TextField
                    placeholder='Item Name'
                    value={name}
                    onChangeText={(text) => {
                        setName(text)
                    }}
                    style={{ marginBottom: Spacing.ThreeQuartersGap }}
                />
                <EmojiPicker currentValue={icon} onSelect={setIcon} />               
            </View>
        </PopoverFormScreenbase>
    )
}
