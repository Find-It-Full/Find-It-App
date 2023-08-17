import React from "react"
import { useState, useRef, useEffect } from "react"
import { Text, TouchableOpacity, Platform, Linking } from "react-native"
import MapView, { LatLng, Region, Marker, Polyline } from "react-native-maps"
import { ItemIconContainer, MapItemIconContainer } from "../ui-base/containers"
import { Shadows } from "../ui-base/shadows"
import { TextStyles } from "../ui-base/text"
import { Colors } from "../ui-base/colors"
import PlatformIcon, { Icons } from "./PlatformIcon"
import analytics from '@react-native-firebase/analytics';

export default function SightingMap(props: { locations: (LatLng | null)[] | null, primaryLocation: LatLng | null, itemIcon: string, itemName: string, selectReportAtIndex: (index: number) => void, summaryHeight: number }) {

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
                console.log(`Failed to fetch IP region, ${error}`)
            })
        }
    }, [props.locations])

    useEffect(() => {
        const newRegion = (region != null && region.longitude !== 0) ? region : defaultRegion
        async function animateToRegion() {

            if (!mapRef.current) {
                return
            }
            mapRef.current.animateToRegion(newRegion)

        }
        animateToRegion()
    }, [region])

    const PrimaryLocationMarker = (lmprops: { primaryLocation: LatLng }) => {
        return (
            <Marker coordinate={lmprops.primaryLocation} key={lmprops.primaryLocation.latitude}>
                <MapItemIconContainer>
                    <Text style={TextStyles.smallEmoji}>{props.itemIcon}</Text>
                </MapItemIconContainer>
            </Marker>
        )
    }

    const MapContents = () => {

        const primaryLocation = props.primaryLocation

        if ( ! props.locations) {
            return null
        }

        if (props.locations.length === 1 && props.locations[0]) {
            return (
                <PrimaryLocationMarker primaryLocation={props.locations[0]} />
            )
        }

        return (
            <>
                <Polyline
                    coordinates={props.locations.filter((val) => val != null) as LatLng[]}
                    strokeColor={Colors.Line}
                    strokeWidth={2}
                    lineCap={'butt'}
                    lineDashPattern={[5, 4]}
                />
                {
                    props.locations.map((loc, index) => {
                        if (!loc) {
                            return null
                        }

                        if (loc.latitude === primaryLocation?.latitude && loc.longitude === primaryLocation.longitude) {
                            return null
                        }
                        return (
                            <Marker 
                                coordinate={loc} 
                                key={`${loc.latitude} ${index} ${props.summaryHeight}`} 
                                identifier={`${loc.latitude} ${index} ${props.summaryHeight}`} 
                                zIndex={1} 
                                tappable={true}
                                onPress={() => props.selectReportAtIndex(index)}>
                                <ItemIconContainer style={{ ...Shadows.SmallShadow, backgroundColor: Colors.Background, width: 42 / 2, height: 42 / 2 }} />
                            </Marker>
                        )
                    })
                }
                {
                    primaryLocation ? 
                        <PrimaryLocationMarker primaryLocation={primaryLocation} />
                        :
                        null
                }
            </>
        )
    }

    return (
        <MapView style={{ position: 'absolute', bottom: 0, top: 0, height: '100%', width: '100%' }} ref={mapRef} mapPadding={{top:0, right:0, left:0, bottom:props.summaryHeight}}>
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
    console.log({latitude: (minLat + maxLat) / 2.0,
    longitude: (minLng + maxLng) / 2.0,
    latitudeDelta,
    longitudeDelta})
    return {
        latitude: (minLat + maxLat) / 2.0,
        longitude: (minLng + maxLng) / 2.0,
        latitudeDelta,
        longitudeDelta
    }
}