import * as React from "react"
import { useEffect, useRef, useState } from "react";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, PlatformColor, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExactLocationReportField, isExactLocation, ReportFieldType } from "../../backend/databaseTypes";
import { useAppSelector } from "../../store/hooks";
import { Spacer, VerticallyCenteringRow } from "../../ui-base/layouts";
import { Spacing } from "../../ui-base/spacing";
import { TextStyles } from "../../ui-base/text";
import { ItemDetailsProps } from "../Navigator";
import ReportSummary from "./ReportSummary";
import Timeline from "./Timeline";

export default function ItemDetails(props: ItemDetailsProps) {

    const item = props.route.params.item
    const reports = Object.values(useAppSelector((state) => state.reports[item.itemID]) || { })
    const reportsWithLocation = reports.filter((report) => (
        ReportFieldType.EXACT_LOCATION in report.fields
    ))
    const locations = reportsWithLocation.map((report) => (report.fields.EXACT_LOCATION as ExactLocationReportField))
    const [reportSelected, setReportSelected] = useState(reports.length > 0 ? reports[0].reportID : null)
    const [selectedLocation, setSelectedLocation] = useState<ExactLocationReportField | null>(null)
    const windowWidth = useWindowDimensions().width

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.max(0, Math.min(Math.round(event.nativeEvent.contentOffset.x / windowWidth), reports.length - 1))
        setReportSelected(reports[index].reportID)
        const locationField = reports[index].fields.EXACT_LOCATION
        setSelectedLocation(isExactLocation(locationField) ? locationField : null)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <VerticallyCenteringRow style={{ paddingTop: Spacing.ScreenPadding, paddingHorizontal: Spacing.ScreenPadding }}>
                <TouchableOpacity onPress={props.navigation.goBack} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={TextStyles.i2}>􀆉</Text>
                    <Text style={TextStyles.b1}>{' Back'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={TextStyles.i2}>􀍢</Text>
                </TouchableOpacity>
            </VerticallyCenteringRow>
            <VerticallyCenteringRow style={{ alignItems: 'center', alignContent: 'center' }}>
                <VerticallyCenteringRow style={{ justifyContent: 'flex-start', padding: Spacing.ScreenPadding, backgroundColor: 'rgb(242, 242, 242)', borderRadius: 8, marginBottom: -8, zIndex: 2 }}>
                    <Text style={TextStyles.h2}>{item.icon}</Text>
                    <Spacer size={Spacing.HalfGap} />
                    <Text style={TextStyles.h2}>{item.name}</Text>
                </VerticallyCenteringRow>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Text style={TextStyles.i2}>􀇿</Text>
                    <Text style={TextStyles.b1}>Mark as Lost</Text>
                </TouchableOpacity>
            </VerticallyCenteringRow>
            <SightingMap location={selectedLocation} />
            <View style={{ backgroundColor: 'rgb(242, 242, 242)', borderRadius: 8, marginTop: -8, flex: 1 }}>
                <Text style={[TextStyles.h3, { marginBottom: Spacing.HalfGap, marginTop: Spacing.Gap }]}>Sightings</Text>
                <ScrollView 
                    horizontal={true}
                    pagingEnabled
                    style={{ zIndex: 2, marginBottom: -5 }}
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={36}
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
            </View>
        </SafeAreaView>
    )
}

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
        <MapView style={{ width: '100%', height: '70%' }} ref={mapRef}>
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