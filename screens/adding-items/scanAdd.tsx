import React, { useState, useEffect } from "react"
import {
    StyleSheet,
    Text,
} from "react-native"
import QRCodeScanner from "react-native-qrcode-scanner"
import { check, PERMISSIONS, RESULTS } from "react-native-permissions"

export default function AddScan(props: any) {
    const [scaned, setScanned] = useState("")
    const [allowed, setAllowed] = useState(false)
    function onSuccess(data) {
        console.warn(data)
        const url = data.data.substring(30)
        props.navigation.navigate("DetailsAdd", { id: url })
    }
    async function conf() {
        const result = await check(PERMISSIONS.IOS.CAMERA)
        if (result == RESULTS.GRANTED) {
            setAllowed(true)
        }
        const resultAndroid = await check(PERMISSIONS.ANDROID.CAMERA)
        if (resultAndroid == RESULTS.GRANTED) {
            setAllowed(true)
        }
    }
    useEffect(() => {
        conf()
    }, [])

    props.navigation.navigate("DetailsAdd", { id: "abc123" })
    return (
        <QRCodeScanner
            onRead={onSuccess}
            topContent={
                <Text style={styles.centerText}>
                    Scan your QR code {scaned}
                </Text>
            }
        />
    )
}

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: "#777",
    },
    textBold: {
        fontWeight: "500",
        color: "#000",
    },
    buttonText: {
        fontSize: 21,
        color: "rgb(0,122,255)",
    },
    buttonTouchable: {
        padding: 16,
    },
})
