import * as React from "react"
import { useEffect, useRef, useState } from "react";
import { Linking, NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import MapView, { Callout, LatLng, Marker, Region } from "react-native-maps";
import { SafeAreaInsetsContext } from "react-native-safe-area-context";
import { ExactLocationReportField, isExactLocation, Report } from "../../backend/databaseTypes";
import { useAppSelector } from "../../store/hooks";
import { VerticallyCenteringRow } from "../../ui-base/layouts";
import { Spacing } from "../../ui-base/spacing";
import { TextStyles } from "../../ui-base/text";
import { ItemDetailsProps } from "../Navigator";
import ReportSummary from "../../components/items/ReportSummary";
import { ActionButton, ItemIconContainer } from "../../ui-base/containers";
import { Colors } from "../../ui-base/colors";
import ItemProfile from "../../components/items/ItemProfile";
import { Radii } from "../../ui-base/radii";
import { Shadows } from "../../ui-base/shadows";

export default function ItemDetails(props: ItemDetailsProps) {

    const item = props.route.params.item
    const reports = Object.values(useAppSelector((state) => state.reports[item.itemID]) || { })
    const [selectedReport, setSelectedReport] = useState(getInitialState(reports))
    const windowWidth = useWindowDimensions().width
    const scrollRef = useRef<ScrollView>(null)
    const safeAreaInsets = React.useContext(SafeAreaInsetsContext)

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {

        if (reports.length === 0) {
            setSelectedReport(null)
        }

        const index = Math.max(0, Math.min(Math.round(event.nativeEvent.contentOffset.x / windowWidth), reports.length - 1))
        const locationField = reports[index].fields.EXACT_LOCATION
        const newSelectedReport = {
            reportID: reports[index].reportID,
            reportIndex: index,
            location: isExactLocation(locationField) ? locationField : null
        }
        setSelectedReport(newSelectedReport)
    }

    const scrollToOffset = (offset: number) => {

        if ( ! selectedReport) {
            return
        }

        const newIndex = Math.max(Math.min(selectedReport.reportIndex + offset, reports.length - 1), 0)
        const position = newIndex * windowWidth
        scrollRef.current?.scrollTo({ x: position, animated: true })
    }

    const canScrollToNext = (selectedReport != null) && selectedReport.reportIndex < reports.length - 1
    const canScrollToPrev = (selectedReport != null) && selectedReport.reportIndex > 0

    return (
        <View style={{ padding: 0, paddingBottom: safeAreaInsets?.bottom, backgroundColor: Colors.Background, flex: 1 }}>
            <SightingMap location={selectedReport ? selectedReport.location : null} itemIcon={item.icon} />
            <TouchableOpacity style={[styles.backButton, { top: (safeAreaInsets?.top ?? 0) }]} onPress={props.navigation.goBack}>
                <Text style={TextStyles.h3}>􀆉</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: Colors.Background, borderRadius: 8, marginTop: -8 }}>
                <View style={{ paddingVertical: Spacing.BigGap, paddingHorizontal: Spacing.ScreenPadding }}>
                    <ItemProfile {...item} />
                </View>
                <VerticallyCenteringRow style={{ paddingRight: Spacing.Gap }}>
                    <ActionButton style={styles.buttonContainer}>
                        <Text style={[TextStyles.h3, { marginBottom: Spacing.QuarterGap }]}>􀇿</Text>
                        <Text style={TextStyles.h4}>Mark as Lost</Text>
                    </ActionButton>
                    <ActionButton style={styles.buttonContainer}>
                        <Text style={[TextStyles.h3, { marginBottom: Spacing.QuarterGap }]}>􀍢</Text>
                        <Text style={TextStyles.h4}>More</Text>
                    </ActionButton>
                    <ActionButton 
                        style={styles.buttonContainer}
                        disabled={ ! selectedReport || ! selectedReport.location}
                        onPress={() => {
                            if ( ! selectedReport || ! selectedReport.location) {
                                return
                            }
                            openLocationInMaps({ lat: selectedReport.location.latitude, lng: selectedReport.location.longitude, label: `${item.name} location` })
                        }}
                    >
                        <Text style={[TextStyles.h3, { marginBottom: Spacing.QuarterGap }]}>􀙋</Text>
                        <Text style={TextStyles.h4}>Directions</Text>
                    </ActionButton>
                </VerticallyCenteringRow>
                {
                    selectedReport ?
                        <>
                            <Text style={[TextStyles.h3, { marginLeft: Spacing.ScreenPadding, marginTop: Spacing.BigGap }]}>Sightings</Text>
                            <Text style={[TextStyles.p2, { marginLeft: Spacing.ScreenPadding, marginTop: Spacing.QuarterGap }]}>{`${reports.length} total`}</Text>
                            <ScrollView 
                                horizontal={true}
                                pagingEnabled
                                style={{ zIndex: 2, paddingVertical: Spacing.ThreeQuartersGap }}
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
                                            isSelected={selectedReport?.reportID} 
                                            key={report.reportID}
                                        />
                                    )
                                }
                            </ScrollView>
                            <VerticallyCenteringRow style={{ paddingHorizontal: Spacing.ScreenPadding }}>
                                <TouchableOpacity onPress={() => scrollToOffset(-1)} disabled={ ! canScrollToPrev}>
                                    <Text style={[TextStyles.h4, { opacity: canScrollToPrev ? 1 : 0.6 }]}>􀆉 Previous</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => scrollToOffset(1)} disabled={ ! canScrollToNext}>
                                    <Text style={[TextStyles.h4, { opacity: canScrollToNext ? 1 : 0.6 }]}>Next 􀯻</Text>
                                </TouchableOpacity>
                            </VerticallyCenteringRow>
                        </> :
                        <>
                            <Text style={[TextStyles.p, { marginHorizontal: Spacing.ScreenPadding, marginTop: Spacing.BigGap, textAlign: 'center' }]}>Nobody has found this item yet. If you want to be notified when it's found, mark it as lost.</Text>
                        </>
                }
                
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

function getInitialState(reports: Report[]): { reportID: string, reportIndex: number, location: LatLng | null, } | null {
    // (A) No reports - return nulls
    if (reports.length === 0) {
        return null
    }

    // (B) ≥ 1 report
    const reversed = [...reports].reverse()
    let field: ExactLocationReportField | null = null
    let firstReport: Report = reversed[0]
    let firstIndex: number = 0
    reversed.every((report, index) => {
        if (isExactLocation(report.fields.EXACT_LOCATION)) {
            field = report.fields.EXACT_LOCATION
            firstReport = report
            firstIndex = index
            return false
        }
        return true
    })

    return { reportID: firstReport.reportID, reportIndex: reversed.length - firstIndex - 1, location: field }
}

function openLocationInMaps({ lat, lng, label }: { lat: number, lng: number, label: string }) {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' })
    const latLng = `${lat},${lng}`
    const url = Platform.select({
        ios: `${scheme}${label}@${latLng}`,
        android: `${scheme}${latLng}(${label})`
    })

    if ( ! url) {
        console.error('could not generate url')
        return
    }
        
    Linking.openURL(url)
}

function SightingMap(props: { location: LatLng | null, itemIcon: string }) {

    const defaultRegion = {
        latitude: 38.648785,
        longitude: -97.910629,
        latitudeDelta: 65,
        longitudeDelta: 65
    }

    const [region, setRegion] = useState<Region | null>(null)
    const mapRef = useRef<MapView>(null)

    useEffect(() => {
        if (props.location) {
            setRegion(determineReportRegion([props.location]))
        } else {
            fetchIPRegion()
            .then((newIPRegion) => {
                if (newIPRegion && ! region) {
                    setRegion(region)
                }
            })
            .catch((error) => {
                console.error(`Failed to fetch IP region, ${error}`)
            })
        }
    }, [props.location])

    useEffect(() => {
        mapRef.current?.animateToRegion(region ?? defaultRegion)
    }, [region])

    return (
        <MapView style={{ flexGrow: 1 }} ref={mapRef}>
            {
                props.location ? 
                    <Marker coordinate={props.location} key={props.location.latitude}>
                        <ItemIconContainer style={{ ...Shadows.SmallShadow, borderWidth: 3, borderColor: Colors.Background, width: 42, height: 42 }}>
                            <Text style={TextStyles.h3}>{props.itemIcon}</Text>
                        </ItemIconContainer>
                    </Marker> : 
                    null
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