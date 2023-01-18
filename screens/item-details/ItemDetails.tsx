import * as React from "react"
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import MapView, { LatLng, Marker, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExactLocationReportField, ReportFieldType } from "../../backend/databaseTypes";
import { useAppSelector } from "../../store/hooks";
import { Spacer, VerticallyCenteringRow } from "../../ui-base/layouts";
import { Spacing } from "../../ui-base/spacing";
import { TextStyles } from "../../ui-base/text";
import { ItemDetailsProps } from "../Navigator";
import ReportSummary from "./ReportSummary";

export default function ItemDetails(props: ItemDetailsProps) {

    const item = props.route.params.item
    const reports = Object.values(useAppSelector((state) => state.reports[item.itemID]) || { })
    const reportsWithLocation = reports.filter((report) => (
        ReportFieldType.EXACT_LOCATION in report.fields
    ))
    const locations = reportsWithLocation.map((report) => (report.fields.EXACT_LOCATION as ExactLocationReportField))

    return (
        <SafeAreaView style={{ padding: Spacing.ScreenPadding }}>
            <VerticallyCenteringRow>
                <TouchableOpacity onPress={props.navigation.goBack}>
                    <Text style={TextStyles.b1}>{'􀆉 Back'}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style={TextStyles.b1}>{'􀇿 Mark as Lost'}</Text>
                </TouchableOpacity>
            </VerticallyCenteringRow>
            <VerticallyCenteringRow style={{ justifyContent: 'flex-start', marginVertical: Spacing.Gap }}>
                <Text style={TextStyles.h2}>{item.icon}</Text>
                <Spacer size={Spacing.HalfGap} />
                <Text style={TextStyles.h2}>{item.name}</Text>
            </VerticallyCenteringRow>
            <SightingMap locations={locations} />
            <Text style={[TextStyles.h3, { marginBottom: Spacing.HalfGap, marginTop: Spacing.Gap }]}>Sightings</Text>
            <FlatList 
                data={reports}
                renderItem={(item) => (
                    <ReportSummary report={item.item} />
                )}
            />
        </SafeAreaView>
    )
}

function SightingMap(props: { locations: LatLng[] }) {

    const defaultRegion = {
        latitude: 38.648785,
        longitude: -90.310729,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
    }

    const [region, setRegion] = useState(props.locations.length > 0 ? determineReportRegion(props.locations) : null)

    useEffect(() => {
        if (region) {
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
    }, [region])

    return (
        <MapView style={{ width: '100%', height: 400 }} region={region || defaultRegion}>
            {
                props.locations.map((location) => <Marker coordinate={location} key={location.latitude} />)
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

    const latitudeDelta = Math.max(Math.abs(maxLat - minLat) * 1.3, 0.004)
    const longitudeDelta = Math.max(Math.abs(maxLng - minLng) * 1.3, 0.004)

    return {
        latitude: (minLat + maxLat) / 2.0,
        longitude: (minLng + maxLng) / 2.0,
        latitudeDelta,
        longitudeDelta
    }
}