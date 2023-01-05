import * as React from "react"
import { useState } from "react"
import {
    Button,
    View,
    TextInput,
} from "react-native"
import { EnterItemDetailsProps } from "./AddItemFlowContainer"

export default function EnterItemDetails(props: EnterItemDetailsProps) {
    const [cont, setCont] = useState(false)
    const [name, setName] = useState("")
    // const codeId = props.route.params.id

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                placeholder={"Name"}
                onChangeText={(text: string) => {
                    setName(text)
                    if (text.length > 0) {
                        setCont(true)
                    }
                }}
            ></TextInput>
            <Button
                title="Submit"
                disabled={!cont}
                onPress={async () => {
                    // await addToFirestore(codeId, name, "URL")
                }}
            />
        </View>
    )
}
