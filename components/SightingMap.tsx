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

export default function SightingMap(props: { locations: LatLng[] | null, primaryLocation: LatLng | null, itemIcon: string, itemName: string, selectReportAtIndex: (index: number) => void }) {

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
        mapRef.current?.animateToRegion((region != null && region.longitude !== 0) ? region : defaultRegion)
    }, [region])

    const handleRequestDirections = async (loc: LatLng) => {
        await analytics().logEvent('open_in_maps')
        openLocationInMaps({ lat: loc.latitude, lng: loc.longitude, label: `${props.itemName} location` })
    }

    const PrimaryLocationMarker = (lmprops: { primaryLocation: LatLng }) => {
        return (
            <Marker coordinate={lmprops.primaryLocation} key={lmprops.primaryLocation.latitude}>
                <MapItemIconContainer>
                    <Text style={TextStyles.smallEmoji}>{props.itemIcon} • </Text>
                    <TouchableOpacity onPress={() => handleRequestDirections(lmprops.primaryLocation)}>
                        <PlatformIcon icon={Icons.NAVIGATE} />
                    </TouchableOpacity>
                </MapItemIconContainer>
            </Marker>
        )
    }

    const MapContents = () => {

        const primaryLocation = props.primaryLocation

        if ( ! props.locations || ! primaryLocation) {
            return null
        }

        if (props.locations.length === 1) {
            return (
                <PrimaryLocationMarker primaryLocation={primaryLocation} />
            )
        }

        return (
            <>
                <Polyline
                    coordinates={props.locations}
                    strokeColor={Colors.Line}
                    strokeWidth={2}
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
                <PrimaryLocationMarker primaryLocation={primaryLocation} />
            </>
        )
    }

    return (
        <MapView style={{ flexGrow: 1 }} ref={mapRef} >
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