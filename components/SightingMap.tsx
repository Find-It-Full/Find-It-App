import React from "react"
import { useState, useRef, useEffect } from "react"
import { Text } from "react-native"
import MapView, { LatLng, Region, Marker, Polyline } from "react-native-maps"
import { Colors } from "react-native/Libraries/NewAppScreen"
import { Platform, Linking } from "react-native/types"
import { Report, ExactLocationReportField, isExactLocation } from "../backend/databaseTypes"
import { ItemIconContainer } from "../ui-base/containers"
import { Shadows } from "../ui-base/shadows"
import { TextStyles } from "../ui-base/text"

export default function SightingMap(props: { locations: LatLng[] | null, primaryLocation: LatLng | null, itemIcon: string, selectReportAtIndex: (index: number) => void }) {

    const defaultRegion = {
        latitude: 38.648785,
        longitude: -97.910629,
        latitudeDelta: 65,
        longitudeDelta: 65
    }

    const [region, setRegion] = useState<Region | null>(null)
    const mapRef = useRef<MapView>(null)

    useEffect(() => {
        if (props.locations && props.primaryLocation) {
            setRegion(determineReportRegion([props.primaryLocation]))
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
    }, [props.locations])

    useEffect(() => {
        mapRef.current?.animateToRegion((region != null && region.longitude !== 0) ? region : defaultRegion)
    }, [region])

    const MapContents = () => {

        const primaryLocation = props.primaryLocation

        if ( ! props.locations || ! primaryLocation) {
            return null
        }

        if (props.locations.length === 1) {
            return (
                <Marker coordinate={primaryLocation} key={primaryLocation.latitude}>
                    <ItemIconContainer style={{ ...Shadows.SmallShadow, borderWidth: 3, borderColor: Colors.Background, width: 42, height: 42 }}>
                        <Text style={TextStyles.h3}>{props.itemIcon}</Text>
                    </ItemIconContainer>
                </Marker>
            )
        }

        return (
            <>
                <Polyline
                    coordinates={props.locations}
                    strokeColor={Colors.Background}
                    strokeWidth={4}
                    lineCap={'butt'}
                    lineDashPattern={[5, 5]}
                />
                {
                    props.locations.map((loc, index) => {
                        if (loc.latitude === primaryLocation.latitude && loc.longitude === primaryLocation.longitude) {
                            return null
                        }
                        return (
                            <Marker 
                                coordinate={loc} 
                                key={loc.latitude + index} 
                                zIndex={1} 
                                tappable={true}
                                onPress={() => props.selectReportAtIndex(index)}>
                                <ItemIconContainer style={{ ...Shadows.SmallShadow, backgroundColor: Colors.Background, width: 42 / 2, height: 42 / 2 }} />
                            </Marker>
                        )
                    })
                }
                <Marker coordinate={primaryLocation} key={primaryLocation.latitude} zIndex={2}>
                    <ItemIconContainer style={{ ...Shadows.SmallShadow, borderWidth: 3, borderColor: Colors.Background, width: 42, height: 42 }}>
                        <Text style={TextStyles.h3}>{props.itemIcon}</Text>
                    </ItemIconContainer>
                </Marker>
            </>
        )
    }

    return (
        <MapView style={{ flexGrow: 1 }} ref={mapRef}>
            <MapContents />
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