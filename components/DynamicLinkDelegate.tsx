import * as React from "react"
import dynamicLinks from "@react-native-firebase/dynamic-links"
import { ReactElement, useEffect } from "react"
import { Linking, StyleSheet, Text, View } from "react-native";
export default function DynamicLinkDelegate(props: { children: ReactElement }) {
    useEffect(() => {
        Linking
            .getInitialURL()
            .then((link) => {console.warn(link)})
    }, [])

    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink)
        return () => unsubscribe()
    }, [])

    const handleDynamicLink = (link) => {
        console.error(link)
        console.log(link.url.substring(31))
    }

    return (
        props.children
    )
}