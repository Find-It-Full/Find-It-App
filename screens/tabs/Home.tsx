import * as React from "react"
import { useState } from "react"
import {
    Text,
    Button,
    useColorScheme,
    View,
    Modal,
} from "react-native"
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context"
import AddItemFlowContainer from "../adding-items/AddItemFlowContainer"
import { HomeProps } from "../Navigator"

export default function Home(props: HomeProps) {

    const [visible, setVisible] = useState(false)

    return (
        <SafeAreaView>
            <Button
                title="Add"
                onPress={() => {
                    props.navigation.navigate('AddItemFlow')
                }}
            />

        </SafeAreaView>
    )
}
