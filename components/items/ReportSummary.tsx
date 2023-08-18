import React, { useEffect, useState } from 'react'
import { Alert, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { isContactInformation, isExactLocation, isMessage, Report, ReportViewStatus } from '../../backend/databaseTypes';
import { Colors } from '../../ui-base/colors';
import { VerticallyCenteringRow } from '../../ui-base/layouts';
import { Spacing } from '../../ui-base/spacing';
import { TextStyles } from '../../ui-base/text';
import analytics from '@react-native-firebase/analytics';
import PillButton from '../PillButton';
import { Icons } from '../PlatformIcon';

export default function ReportSummary(props: { report: Report, isSelected: string | null, itemName: string, onNewHeight: (height: number) => void }) {

    const reportDate = new Date(props.report.timeOfCreation)
    const time = reportDate.toLocaleTimeString([], {timeZone: "America/New_York", month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit'})?.replace(',', ' at') ?? 'unknown'
    const contactPhoneNumber = isContactInformation(props.report.fields.CONTACT_INFORMATION) ? props.report.fields.CONTACT_INFORMATION.contactInfo : null
    const messageField = props.report.fields.MESSAGE
    const [message, hasMessage] = isMessage(messageField) ? [`"${messageField.message}"`, true] : ['Your spotter did not include a message', false]
    const locationString = isExactLocation(props.report.fields.EXACT_LOCATION) ? '' : 'No location provided'
    const location = isExactLocation(props.report.fields.EXACT_LOCATION) ? props.report.fields.EXACT_LOCATION : null
    const [height, setHeight] = useState(0)
    const [contentSize, setContentSize] = useState(0)

    useEffect(() => {
        if (props.isSelected === props.report.reportID) {
            props.onNewHeight(height)
        }
    }, [props.isSelected, height])

    const updateHeight = (newHeight: number) => {
        setHeight(newHeight)
    }

    const windowWidth = useWindowDimensions().width

    const onEmailSpotter = async () => {
        console.log("analytics --- open mesages")
        await analytics().logEvent('open_messages', { report: props.report })
        Linking.openURL(`mailto:${contactPhoneNumber}`)
    }

    const handleRequestDirections = async () => {
        await analytics().logEvent('open_in_maps')
        if (location) {
            openLocationInMaps({ lat: location.latitude, lng: location.longitude, label: `${props.itemName} location` })
        }
    }

    return (
        <View 
            style={[{ width: windowWidth }, styles.container]}
        >
            <View style={styles.contentContainer} onLayout={(event) => updateHeight(event.nativeEvent.layout.height)}>
                <VerticallyCenteringRow style={{ justifyContent: 'flex-start' }}>
                    <Text style={TextStyles.h4}>{`Spotted on ${time}`}</Text>
                </VerticallyCenteringRow>
                {
                    locationString.length > 0 ? 
                        <Text style={TextStyles.p}>{`${locationString}`}</Text>
                        : 
                        null
                }
                <ScrollView style={{maxHeight:200}} scrollEnabled={contentSize>200} onContentSizeChange={(w,h)=>setContentSize(h)}>
                    <Text style={[TextStyles.p, { fontStyle: hasMessage ? 'normal' : 'italic', marginTop: Spacing.HalfGap }]}>{message}</Text>
                </ScrollView>
                <View style={styles.buttonContainer}>
                    <PillButton 
                        icon={Icons.NAVIGATE} 
                        label='Directions' 
                        onPress={handleRequestDirections} 
                        disabled={locationString.length > 0} 
                        onDisabledPress={() => Alert.alert('No Location Provided', 'Your spotter did not provide a map location.')}
                    />
                    <PillButton 
                        icon={Icons.ENVELOPE} 
                        label='Email Spotter' 
                        onPress={onEmailSpotter} 
                        disabled={!contactPhoneNumber} 
                        onDisabledPress={() => Alert.alert('No Email Provided', 'Your spotter did not provide an email address.')}
                    />
                </View>
            </View>
        </View>
    )
}

async function openLocationInMaps({ lat, lng, label }: { lat: number, lng: number, label: string }) {
    const scheme = Platform.select({ ios: 'http://maps.apple.com/?q=', android: 'geo:0,0?q=' })
    const latLng = `${lat},${lng}`
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    })

    if (!url) {
        console.error('could not generate url')
        return
    }
    console.log("analytics --- open maps")
    await analytics().logEvent('open_directions', { lat: lat, lng: lng, label: label })
    Linking.openURL(url)
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'flex-start',
        paddingHorizontal: Spacing.ScreenPadding,
    },
    contentContainer: {
        width: '100%',
        backgroundColor: Colors.PanelColor,
        padding: Spacing.Gap,
        borderRadius: 10,
        position: 'absolute',
        marginLeft: Spacing.Gap
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        position: 'relative',
        gap: Spacing.HalfGap,
        marginTop: Spacing.ThreeQuartersGap,
        justifyContent: 'flex-start'
    }
})