import * as React from "react"
import { useEffect, useRef, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, PlatformColor, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import { SafeAreaInsetsContext, SafeAreaView } from "react-native-safe-area-context";
import { ExactLocationReportField, isExactLocation, ReportFieldType } from "../../backend/databaseTypes";
import { useAppSelector } from "../../store/hooks";
import { Spacer, VerticallyCenteringRow } from "../../ui-base/layouts";
import { Spacing } from "../../ui-base/spacing";
import { TextStyles } from "../../ui-base/text";
import { ItemDetailsProps } from "../Navigator";
import ReportSummary from "../../components/items/ReportSummary";
import Timeline from "./Timeline";
import { ActionButton, Panel, ScreenBase } from "../../ui-base/containers";
import { Colors } from "../../ui-base/colors";
import ItemProfile from "../../components/items/ItemProfile";
import { Radii } from "../../ui-base/radii";

export default function ItemDetails(props: ItemDetailsProps) {

    const item = props.route.params.item
    const reports = Object.values(useAppSelector((state) => state.reports[item.itemID]) || { })
    const reportsWithLocation = reports.filter((report) => (
        ReportFieldType.EXACT_LOCATION in report.fields
    ))
    const locations = reportsWithLocation.map((report) => (report.fields.EXACT_LOCATION as ExactLocationReportField))
    const [reportSelected, setReportSelected] = useState(reports.length > 0 ? reports[reports.length - 1].reportID : null)
    const [selectedReportIndex, setSelectedReportIndex] = useState(reports.length - 1)
    const [selectedLocation, setSelectedLocation] = useState<ExactLocationReportField | null>(null)
    const windowWidth = useWindowDimensions().width
    const scrollRef = useRef<ScrollView>(null)
    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.max(0, Math.min(Math.round(event.nativeEvent.contentOffset.x / windowWidth), reports.length - 1))
        setReportSelected(reports[index].reportID)
        const locationField = reports[index].fields.EXACT_LOCATION
        setSelectedLocation(isExactLocation(locationField) ? locationField : null)
        setSelectedReportIndex(index)
    }

    const scrollToOffset = (offset: number) => {
        const newIndex = Math.max(Math.min(selectedReportIndex + offset, reports.length - 1), 0)
        const position = newIndex * windowWidth
        scrollRef.current?.scrollTo({ x: position, animated: true })
    }

    return (
        <View style={{ padding: 0, paddingBottom: safeAreaInsets?.bottom, backgroundColor: Colors.Background, flex: 1 }}>
            <SightingMap location={selectedLocation} />
            <TouchableOpacity style={[styles.backButton, { top: (safeAreaInsets?.top ?? 0) }]} onPress={props.navigation.goBack}>
                <Text style={TextStyles.h3}>􀆉</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: Colors.Background, borderRadius: 8, marginTop: -8 }}>
                <View style={{ paddingVertical: Spacing.BigGap, paddingHorizontal: Spacing.Gap }}>
                    <ItemProfile {...item} />
                </View>
                <VerticallyCenteringRow style={{ paddingRight: Spacing.Gap }}>
                    <ActionButton style={styles.buttonContainer}>
                        <Text style={[TextStyles.h3, { marginBottom: Spacing.QuarterGap }]}>􀇿</Text>
                        <Text style={TextStyles.h4}>Mark as Lost</Text>
                    </ActionButton>
                    <ActionButton style={styles.buttonContainer}>
                        <Text style={[TextStyles.h3, { marginBottom: Spacing.QuarterGap }]}>􀙋</Text>
                        <Text style={TextStyles.h4}>Directions</Text>
                    </ActionButton>
                    <ActionButton style={styles.buttonContainer}>
                        <Text style={[TextStyles.h3, { marginBottom: Spacing.QuarterGap }]}>􀍢</Text>
                        <Text style={TextStyles.h4}>More</Text>
                    </ActionButton>
                </VerticallyCenteringRow>
                <Text style={[TextStyles.h3, { marginLeft: Spacing.ScreenPadding, marginTop: Spacing.Gap }]}>Sightings</Text>
                <Text style={[TextStyles.p2, { marginLeft: Spacing.ScreenPadding, marginTop: Spacing.QuarterGap }]}>5 in last 30 days</Text>
                <ScrollView 
                    horizontal={true}
                    pagingEnabled
                    style={{ zIndex: 2, paddingVertical: Spacing.HalfGap }}
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={36}
                    ref={scrollRef}
                    onLayout={() => scrollRef.current?.scrollToEnd()}
                >
                    {
                        reports.map((report) => 
                            <ReportSummary 
                                report={report} 
                                isSelected={reportSelected} 
                                onPress={() => setReportSelected(report.reportID)} 
                                key={report.reportID}
                            />
                        )
                    }
                </ScrollView>
                <VerticallyCenteringRow style={{ paddingHorizontal: Spacing.ScreenPadding, marginTop: Spacing.QuarterGap }}>
                    <TouchableOpacity onPress={() => scrollToOffset(-1)} disabled={selectedReportIndex <= 0}>
                        <Text style={[TextStyles.h4, { opacity: selectedReportIndex <= 0 ? 0.6 : 1 }]}>􀆉 Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => scrollToOffset(1)} disabled={selectedReportIndex >= reports.length - 1}>
                        <Text style={[TextStyles.h4, { opacity: selectedReportIndex >= reports.length - 1 ? 0.6 : 1 }]}>Next 􀯻</Text>
                    </TouchableOpacity>
                </VerticallyCenteringRow>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: { 
        paddingVertical: Spacing.HalfGap, 
        marginLeft: Spacing.Gap, 
        flex: 1 
    },
    backButton: {
        backgroundColor: Colors.Black,
        height: 38, 
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: Spacing.ScreenPadding,
        borderRadius: Radii.ItemRadius
    }
})

function SightingMap(props: { location: LatLng | null }) {

    const defaultRegion = {
        latitude: 38.648785,
        longitude: -90.310729,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    }

    const [region, setRegion] = useState<Region | null>(null)
    const mapRef = useRef<MapView>(null)

    useEffect(() => {
        if (props.location) {
            setRegion(determineReportRegion([props.location]))
            return
        }

        fetchIPRegion()
            .then((region) => {
                if (region) {
                    setRegion(region)
                }
            })
            .catch((error) => {
                console.error(`Failed to fetch IP region, ${error}`)
            })
    }, [props.location])

    useEffect(() => {
        mapRef.current?.animateToRegion(region || defaultRegion)
    }, [region])

    return (
        <MapView style={{ flexGrow: 1 }} ref={mapRef}>
            {
                props.location ? <Marker coordinate={props.location} key={props.location.latitude} /> : null
            }
        </MapView>
    )
}

async function fetchIPRegion(): Promise<Region | null> {
    const res = await fetch('https://geolocation-db.com/json/')
    const data = await res.json()
    if (data.latitude && data.longitude) {
        return { 
            latitude: data.latitude, 
            longitude: data.longitude,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025
        }
    }
    return null
}

function determineReportRegion(locations: LatLng[]): Region {
    let minLat = Number.MAX_VALUE
    let maxLat = -Number.MAX_VALUE
    let minLng = Number.MAX_VALUE
    let maxLng = -Number.MAX_VALUE

    for (const location of locations) {
        if (location.latitude < minLat) {
            minLat = location.latitude
        }

        if (location.latitude > maxLat) {
            maxLat = location.latitude
        }

        if (location.longitude < minLng) {
            minLng = location.longitude
        }

        if (location.longitude > maxLng) {
            maxLng = location.longitude
        }
    }

    const latitudeDelta = Math.max(Math.abs(maxLat - minLat) * 1.3, 0.01)
    const longitudeDelta = Math.max(Math.abs(maxLng - minLng) * 1.3, 0.01)

    return {
        latitude: (minLat + maxLat) / 2.0,
        longitude: (minLng + maxLng) / 2.0,
        latitudeDelta,
        longitudeDelta
    }
}