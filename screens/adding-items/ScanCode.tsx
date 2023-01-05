import * as React from "react"
import { Text, Button, TouchableOpacity } from "react-native"
import { ScanCodeProps } from "./AddItemFlowContainer"

export default function ScanCode({ navigation }: ScanCodeProps) {
    return (
        <>
            <Text>Scan the code!!!</Text>
            <Button
                title='Next'
                onPress={() => {
                    navigation.navigate('EnterItemDetails', { itemID: "" })
                }}
            />
        </>
    )
}