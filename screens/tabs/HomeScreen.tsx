import { GoogleSignin } from "@react-native-google-signin/google-signin"
import auth from "@react-native-firebase/auth"
import dynamicLinks from "@react-native-firebase/dynamic-links"
import { useState, useEffect } from "react"
import * as React from "react"
import {
    Text,
    Button,
    useColorScheme,
    View,
} from "react-native"

import {
    Colors,
} from "react-native/Libraries/NewAppScreen"

export default function HomeScreen(props: any) {
    const [linkInfo, setLinkInfo] = useState("")

    useEffect(() => {
        dynamicLinks()
            .getInitialLink()
            .then((link) => {})
    }, [])

    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink)
        // When the component is unmounted, remove the listener
        return () => unsubscribe()
    }, [])

    const handleDynamicLink = (link) => {
        // Handle dynamic link inside your own application
        console.warn(link)
        setLinkInfo(link.url.substring(31))
    }

    const isDarkMode = useColorScheme() === "dark"

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    }

    return (
        <View
            style={{
                backgroundColor: isDarkMode ? Colors.black : Colors.white,
            }}
        >
            <Text>{linkInfo}</Text>
            <Button
                title="Add"
                onPress={() => {
                    props.navigation.navigate("AddScan")
                }}
            />
        </View>
    )
}
