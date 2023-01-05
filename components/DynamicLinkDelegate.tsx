import * as React from "react"
import dynamicLinks from "@react-native-firebase/dynamic-links"
import { ReactElement, useEffect } from "react"

export default function DynamicLinkDelegate(props: { children: ReactElement }) {
    useEffect(() => {
        dynamicLinks()
            .getInitialLink()
            .then((link) => {})
    }, [])

    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink)
        return () => unsubscribe()
    }, [])

    const handleDynamicLink = (link) => {
        console.log(link.url.substring(31))
    }

    return (
        props.children
    )
}